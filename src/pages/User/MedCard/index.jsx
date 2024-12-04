import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import MedcardStyles from './MedCard.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { getMe, infoAboutUser, selectIsLogged } from '../../../redux/slices/authSlice';
import { fetchUserMedCard } from '../../../api/httpApiClient.js';
import { Button, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

export const MedCard = () => {
    const [loaded, setLoaded] = useState(false);
    const dispatch = useDispatch();

    const [medcardData, setMedcardData] = useState(null);
    const user = useSelector(infoAboutUser);
    const isLogged = useSelector(selectIsLogged);
    const userId = isLogged && user.id;
    const [noRecord, setNoRecord] = useState(false);

    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        if (isLogged) {
            fetchUserMedCard({
                user_id: userId,
            }).then((resp) => {
                setMedcardData(resp.data.data);
                setLoaded(true);
            }).catch((err) => {
                console.error(err);
                if (err.response.status === 404) {
                    setNoRecord(true);
                }
            })

            if (user.medcard === null) {
                dispatch(getMe());
            }
        }
    }, [userId])

    const { t } = useTranslation();

    return (
        <>
            <Header />
            {noRecord && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', overflow: 'hidden', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>{t('emptyMedcard')}</h2>
                            <LinkContainer to={'/user/medcard/create'} style={{ color: 'white' }}>
                                <Button className='btn btn-secondary'>{t('fillMedCard')}</Button>
                            </LinkContainer>
                        </div>
                    </div>
                </>
            )}
            {loaded ? (
                <div className={MedcardStyles.root}>
                    <div style={{ marginBottom: '25px' }} className='d-flex justify-content-between align-content-center'>
                        <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>{t('yourMedCard')}</h3>
                        <LinkContainer to={`/user/medcard/${medcardData.id}/edit`}>
                            <Button className='btn btn-warning'><i class="fa-solid fa-pen-to-square"></i></Button>
                        </LinkContainer>
                    </div>

                    <div className={MedcardStyles.content}>
                        <div>
                            <p>
                                <strong>{t('firstname')}: </strong>
                                {medcardData.firstname}
                            </p>
                            <p>
                                <strong>{t('lastname')}: </strong>
                                {medcardData.lastname}
                            </p>
                            <p>
                                <strong>{t('gender')}: </strong>
                                {medcardData.gender === 'male' ? t('male') : medcardData.gender === 'female' ? t('female') : t('nonBinary')}
                            </p>
                            <p>
                                <strong>{t('phone')}: </strong>
                                {medcardData.contact_number}
                            </p>
                            <p>
                                <strong>{t('date_birthday')}: </strong>
                                {format(new Date(medcardData.date_birthday), 'dd.MM.yyyy')}
                            </p>
                            <p>
                                <strong>{t('address')}: </strong>
                                {medcardData.address}
                            </p>
                            <p>
                                <strong>{t('blood_type')}: </strong>
                                {medcardData.blood_type || `_______`}
                            </p>
                            <p>
                                <strong>{t('emergency_contact_name')}: </strong>
                                {medcardData.emergency_contact_name || `_______`}
                            </p>
                            <p>
                                <strong>{t('emergency_contact_phone')}: </strong>
                                {medcardData.emergency_contact_phone || `_______`}
                            </p>
                        </div>
                        <hr style={{ marginTop: '25px' }} />

                        <div style={{ marginTop: '25px' }}>
                            <p style={{ marginBottom: '25px' }}>
                                <span style={{ marginBottom: '20px', display: 'block' }}><strong>{t('insurance_details')}</strong></span>
                                <p>
                                    {medcardData.insurance_details || `_____`}
                                </p>
                            </p>
                            <p style={{ marginBottom: '25px' }}>
                                <span style={{ marginBottom: '20px', display: 'block' }}><strong>{t('allergies')}</strong></span>
                                <p>
                                    {medcardData.allergies || `_____`}
                                </p>
                            </p>
                            <p style={{ marginBottom: '25px' }}>
                                <span style={{ marginBottom: '20px', display: 'block' }}><strong>{t('chronic_conditions')}</strong></span>
                                <p>
                                    {medcardData.chronic_conditions || `_____`}
                                </p>
                            </p>
                            <p style={{ marginBottom: '25px' }}>
                                <span style={{ marginBottom: '20px', display: 'block' }}><strong>{t('current_medications')}</strong></span>
                                <p>
                                    {medcardData.current_medications || `_____`}
                                </p>
                            </p>
                            <p style={{ marginBottom: '25px' }}>
                                <span style={{ marginBottom: '20px', display: 'block' }}><strong>{t('additional_notes')}</strong></span>
                                <p>
                                    {medcardData.additional_notes || `_____`}
                                </p>
                            </p>
                        </div>
                        <LinkContainer style={{ color: 'white', fontWeight: 'bold' }} to={`/user/${userId}/appointments/list`}>
                            <Button className='btn btn-info'>{t('details')}</Button>
                        </LinkContainer>
                    </div>
                </div>
            ) : (
                <div className={"d-flex justify-content-center align-items-center"} style={{ minHeight: '100vh' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

        </>
    )
}
