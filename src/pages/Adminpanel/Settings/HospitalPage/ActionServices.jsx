import React, { useEffect, useState } from 'react'
import Header from '../../../../components/Header'
import ActionServicesStyles from './HospitalPage.module.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createService, fetchHospitalDepartments, fetchHospitalDoctors } from '../../../../api/httpApiClient';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../../redux/slices/authSlice';

export const ActionServices = () => {
    const [hospitalDoctorsCollection, setHospDoctors] = useState([]);
    const [hospitalDoctorsLoaded, setHospitalDoctorsLoaded] = useState(false);
    const [hospitalDepCollection, setHospDepColl] = useState([]);
    const [hospitalDepLoaded, setHospitalDepLoaded] = useState(false);

    const { _id } = useParams();
    const [isCreated, setIsCreated] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const hospitalId = queryParams.get('hospital');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [departmentAlias, setDepartmentAlias] = useState('');
    const [doctorId, setDoctorId] = useState(null);

    const { i18n } = useTranslation();

    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const isAllowedToEdit = isLogged && ((user.roles === 'manager' && Number(user.hospitalId) === Number(hospitalId)) || user.roles === 'admin')
    const navigate = useNavigate();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        if (isLogged) {

            if (!isAllowedToEdit) {
                navigate('/404');
            }

            fetchHospitalDepartments(hospitalId)
                .then((resp) => {
                    setHospDepColl(resp.data.data)
                    setHospitalDepLoaded(true);
                }).catch((err) => {
                    console.log(err);
                })

            if (isCreated) {
                navigate(`/adminpanel/settings/${hospitalId}/hospital`);
            }
        }



    }, [hospitalId, isLogged, isCreated])

    useEffect(() => {
        if (departmentAlias) {
            const params = {
                hospital_id: hospitalId,
                dep_alias: departmentAlias
            }
            fetchHospitalDoctors(params)
                .then((resp) => {
                    setHospDoctors(resp.data.doctors);
                    setHospitalDoctorsLoaded(true);
                    console.log(resp.data.doctors);
                })
                .catch((err) => {
                    console.log(err);
                    setHospitalDoctorsLoaded(false);
                })
        }
    }, [departmentAlias])

    const handleDepartmentChange = (e) => {
        const selectedAlias = e.target.value;
        setDepartmentAlias(selectedAlias);
    }

    // const fetchDoctorsBySelectedDep = async (e) => {
    //     e.preventDefault();
    //     setHospitalDoctorsLoaded(false);
    //     if (departmentAlias) {
    //         const params = {
    //             hospital_id: hospitalId,
    //             dep_alias: departmentAlias
    //         }
    //         fetchHospitalDoctors(params)
    //             .then((resp) => {
    //                 setHospDoctors(resp.data.doctors);
    //                 setHospitalDoctorsLoaded(true);
    //                 console.log(resp.data.doctors);
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //                 setHospitalDoctorsLoaded(false);
    //             })
    //     }
    // }

    // const findDoctorsByOption = async (e) => {
    //     fetchDoctorsBySelectedDep(e);
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!name || !departmentAlias || !doctorId) {
            alert("Please fill out all required fields.");
            return;
        }
        const params = {
            name,
            description: description || null,
            department: departmentAlias,
            doctor_id: doctorId,
            hospital_id: hospitalId,
        };

        try {
            await createService(params);
            alert("Service created successfully");
            setIsCreated(true);

        } catch (error) {
            console.error("Error creating service: ", error);

        }

    }

    const { t } = useTranslation();


    return (
        <>
            <Header />
            <div className={`${ActionServicesStyles.actionRoot} d-flex align-items-center justify-content-center`}>
                <form className={`${ActionServicesStyles['login-form']}`} onSubmit={handleSubmit}>
                    <div className={`${ActionServicesStyles['auth-form-content']}`}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '25px', textAlign: 'center' }}>
                            {t('addService')}
                        </h3>
                        <div className="d-flex flex-column">
                            <label>{t('name')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('nameServicePlaceHolder')}
                                required
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <label>{t('description')}</label>
                            <input
                                style={{ padding: '10px', border: '1px solid dodgerblue', resize: 'none' }}
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <>
                                {hospitalDepLoaded ? (
                                    <>
                                        <label>{t('departments')}</label>
                                        <select className={ActionServicesStyles['select-service']} value={departmentAlias} onChange={handleDepartmentChange} required>
                                            <option value="" disabled>{t('chdep')}</option>
                                            {hospitalDepCollection.map((dep, index) => (
                                                <option key={index} value={dep.alias}>
                                                    {dep.content.title}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        </div>
                        <div className="d-flex flex-column">
                            <label>{t('doctor')}</label>
                            <select className={ActionServicesStyles['select-service']} value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
                                <option value="" disabled={hospitalDoctorsLoaded}>{t('chdoc')}</option>
                                {hospitalDoctorsLoaded ? hospitalDoctorsCollection.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name} {doctor.email}
                                    </option>
                                )) : (<>

                                </>)}
                            </select>
                        </div>

                        <button type="submit" className={`btn ${ActionServicesStyles['btn']}`}>{t('create')}</button>
                    </div>
                </form >
            </div >
        </>
    )
}
