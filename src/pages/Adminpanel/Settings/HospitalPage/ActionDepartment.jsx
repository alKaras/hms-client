import React, { useEffect, useState } from 'react'
import Header from '../../../../components/Header'
import ActionHospitalStyles from './HospitalPage.module.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { attachExistedDepartments, createDepartment, editDepartment, fetchDepartment } from '../../../../api/httpApiClient';
import { useTranslation } from 'react-i18next';

export const ActionDepartment = ({ isEdit }) => {
    const [currentDep, setCurrentDep] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    const { _id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const hospitalId = queryParams.get('hospital');

    const [alias, setAlias] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDesc] = useState('');


    useEffect(() => {

        if (isEdit) {
            fetchDepartment(_id)
                .then((resp) => {
                    setCurrentDep(resp.data.data);
                    setIsLoaded(true);
                })
                .catch((err) => {
                    // alert(err.data.message);
                    console.log(err);
                    setIsLoaded(false);
                })
        }
    }, [_id, isEdit])

    useEffect(() => {
        if (isLoaded) {
            setTitle(currentDep.content.title);
            setAlias(currentDep.alias);
            setEmail(currentDep.email);
            setPhone(currentDep.phone);
            setDesc(currentDep.content.description);
        }
    }, [isLoaded]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let params = {};

        if (isEdit) {
            if (title !== currentDep.title && title) params.title = title;
            if (email !== currentDep.email && email) params.email = email;
            if (phone !== currentDep.phone && phone) params.phone = phone;
            if (description !== currentDep.description && description) params.description = description;


            if (Object.keys(params).length > 0) {
                editDepartment(_id, params)
                    .then((resp) => {
                        alert("Department info Updated");
                        navigate(`/adminpanel/hospitals`);
                    })
                    .catch((err) => {
                        alert("Something went wrong");
                        console.log(err);
                    })
            }
            else {
                alert("No changes detected");
            }
        } else {
            params = {
                title: title,
                alias: alias,
                email: email,
                phone: phone,
                description: description,
                hospital_id: hospitalId
            }
            createDepartment(params)
                .then((resp) => {
                    alert("Department created successfully");
                    navigate(`/adminpanel/settings/${hospitalId}/hospital`);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
    const { t } = useTranslation();

    return (
        <>
            <Header />
            <div className={`${ActionHospitalStyles.actionRoot} d-flex align-items-center justify-content-center`}>
                <form className={`${ActionHospitalStyles['login-form']}`} onSubmit={handleSubmit}>
                    <div className={`${ActionHospitalStyles['auth-form-content']}`}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '25px', textAlign: 'center' }}>
                            {isEdit ? t('editDep') : t('addDep')}
                        </h3>
                        <div className="d-flex flex-column">
                            <label>{t('name')}</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t('name')}
                            />
                        </div>

                        {isEdit ? (
                            <></>
                        ) : (
                            <div className="d-flex flex-column">
                                <label>{t('alias')}</label>
                                <input
                                    type="text"
                                    value={alias}
                                    onChange={(e) => setAlias(e.target.value)}
                                    placeholder={`${t('alias')} (endo-dep)`}
                                />
                            </div>
                        )}
                        <div className="d-flex flex-column">
                            <label>{t('email')}</label>
                            <input
                                type="email"
                                placeholder={t('email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <label>{t('phone')}</label>
                            <input
                                type="text"
                                value={phone}
                                placeholder={`${t('phone')} +380(00)000 00 00`}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <label>{t('description')}</label>
                            <input
                                style={{ padding: '10px', border: '1px solid dodgerblue', resize: 'none' }}
                                type="text"
                                value={description}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={`btn ${ActionHospitalStyles['btn']}`}>{isEdit ? t('save') : t('create')}</button>
                    </div>
                </form>
            </div>

        </>
    )
}
