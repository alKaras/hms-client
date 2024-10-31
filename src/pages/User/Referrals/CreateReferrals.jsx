import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import createReferralStyle from './Referrals.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../redux/slices/authSlice';
import { createReferralForUser, fetchHospitalServices } from '../../../api/httpApiClient';
import { CardCheckbox } from '../../../components/CardCheckbox';
import { useTranslation } from 'react-i18next';

export const CreateReferrals = () => {
    const { _id } = useParams();
    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const hospitalId = isLogged && Number(user.hospitalId);
    const [servicesLoaded, setLoaded] = useState(false);
    const [serviceCollection, setServiceCollection] = useState([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);

    useEffect(() => {
        fetchHospitalServices({
            hospital_id: hospitalId
        })
            .then((resp) => {
                setServiceCollection(resp.data.services);
                setLoaded(true);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [hospitalId]);

    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let params = {
            user_id: Number(_id),
            service_id: selectedServiceIds
        }

        createReferralForUser(params)
            .then((resp) => {
                alert(`${t('createdRefMsg')} - ${resp.data.data.referral_code}`);
                setSelectedServiceIds([]);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const toggleSelection = (serviceId) => {
        setSelectedServiceIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(serviceId)) {
                return prevSelectedIds.filter((id) => id !== serviceId);
            } else {
                return [...prevSelectedIds, serviceId];
            }
        });
    }
    return (
        <>
            <Header />
            <div className={createReferralStyle.createRoot}>
                <div>
                    <div className={"d-flex flex-column justify-content-between align-items-start"}>
                        <h2 style={{ fontSize: '20px' }}>{t('selectServices')}</h2>
                        <div className={createReferralStyle.contentServices}>
                            {servicesLoaded && serviceCollection.map((service) => (

                                <CardCheckbox
                                    key={service.id}
                                    service={service}
                                    isSelected={selectedServiceIds.includes(service.id)}
                                    toggleSelection={toggleSelection}
                                />

                            ))}
                        </div>
                    </div>
                    <button className='btn btn-secondary' style={{ marginTop: '35px' }} onClick={handleSubmit}>{t('sendSth')}</button>
                </div>
            </div>
        </>
    )
}
