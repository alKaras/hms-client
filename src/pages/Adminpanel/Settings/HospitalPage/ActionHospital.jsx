import React, { useEffect, useState } from 'react';
import ActionHospitalStyles from './HospitalPage.module.scss';
import Header from '../../../../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { createHospital, editHospital, fetchHospital } from '../../../../api/httpApiClient';
import { useTranslation } from 'react-i18next';
import { infoAboutUser, selectIsLogged } from '../../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';

export default function ActionHospital({ isEdit }) {
    const [title, setTitle] = useState(null);
    const [address, setAddress] = useState(null);
    const [alias, setAlias] = useState(null);
    const [hospitalEmail, setHospitalEmail] = useState(null);
    const [hospitalPhone, setHospitalPhone] = useState(null);
    const [hospitalDescription, setHospDescr] = useState("");
    const [hospitalData, setHospitalData] = useState(null);
    const [isLoaded, setLoaded] = useState(false);

    const { _id } = useParams();
    const navigate = useNavigate();

    const user = useSelector(infoAboutUser);
    const isLogged = useSelector(selectIsLogged);
    const isManager = isLogged && user.roles === 'manager';

    const { i18n } = useTranslation();

    const isAllowedToEdit = (isLogged && isEdit) && ((isManager && (Number(user.hospitalId) === Number(_id))) || user.roles === 'admin');


    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        if (isLogged) {
            if (!isAllowedToEdit) {
                navigate('/404');
            }
            if (isEdit) {
                fetchHospital(_id).then((resp) => {
                    setHospitalData(resp.data);
                    setLoaded(true);
                });
            }
        }

    }, [_id, isEdit, isLogged])

    useEffect(() => {
        if (isLoaded) {
            setTitle(hospitalData.content.title);
            setAddress(hospitalData.content.address);
            setHospitalEmail(hospitalData.hospital_email);
            setAlias(hospitalData.alias);
            setHospitalPhone(hospitalData.hospital_phone);
            setHospDescr(hospitalData.content.description);
        }
    }, [isLoaded])


    const handleSubmit = async (e) => {
        e.preventDefault();
        let params;
        console.log();
        if (isEdit) {

            const params = {};

            if (title !== hospitalData.content.title && title) params.title = title;
            if (address !== hospitalData.content.address && address) params.address = address;
            if (hospitalDescription !== hospitalData.content.description && hospitalDescription) params.description = hospitalDescription;
            if (hospitalEmail !== hospitalData.hospital_email && hospitalEmail) params.hospital_email = hospitalEmail;
            if (hospitalPhone !== hospitalData.hospital_phone && hospitalPhone) params.hospital_phone = hospitalPhone;

            if (Object.keys(params).length > 0) {
                editHospital(_id, params)
                    .then((resp) => {
                        alert("Hospital info changed successfully");
                        if (isManager) {
                            navigate(`/adminpanel/settings/${_id}/hospital`)
                        } else {
                            navigate('/adminpanel/hospitals');
                        }

                    })
                    .catch((err) => {
                        alert("Something went wrong");
                        console.log(err);
                    })
            } else {
                alert("No changes detected");
            }

        } else {
            params = {
                title: title,
                alias: alias,
                address: address,
                hospital_email: hospitalEmail,
                hospital_phone: hospitalPhone
            };
            if (hospitalDescription) params.description = hospitalDescription;
            createHospital(params)
                .then((resp) => {
                    alert("Hospital integrated successfully");
                    navigate('/adminpanel/hospitals');
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
                            {isEdit ? t('editHosp') : t('addHospital')}
                        </h3>
                        <div className="d-flex flex-column">
                            <label>{t('name')}</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t('nameOfHospitalPlaceHolder')}
                            />
                        </div>

                        {isEdit ? (
                            <></>
                        ) : (
                            <div className="d-flex flex-column">
                                <label>{t('aliasPlaceholder')}</label>
                                <input
                                    type="text"
                                    value={alias}
                                    onChange={(e) => setAlias(e.target.value)}
                                    placeholder={t('aliasPlaceholder')}
                                />
                            </div>
                        )}
                        <div className="d-flex flex-column">
                            <label>{t('address')}</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder={t('address')}
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <label>{t('email')}</label>
                            <input
                                type="email"
                                placeholder={t('email')}
                                value={hospitalEmail}
                                onChange={(e) => setHospitalEmail(e.target.value)}
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <label>{t('phone')}</label>
                            <input
                                type="text"
                                value={hospitalPhone}
                                placeholder={`${t('phone')} +380(00)000 00 00`}
                                onChange={(e) => setHospitalPhone(e.target.value)}
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <label>{t('description')}</label>
                            <textarea
                                style={{ padding: '10px', border: '1px solid dodgerblue', resize: 'none', borderRadius: '5px' }}
                                value={hospitalDescription}
                                rows={5}
                                cols={10}
                                onChange={(e) => setHospDescr(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={`btn ${ActionHospitalStyles['btn']}`}>{isEdit ? t('save') : t('create')}</button>
                    </div>
                </form>
            </div>
        </>
    );
}