import React, { useEffect, useState } from 'react';
import Header from '../../../../components/Header';
import OrderHistoryStyles from './OrderHistory.module.scss';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../../redux/slices/authSlice';
import { getOrderByFilter } from '../../../../api/httpApiClient';
import Moment from 'react-moment';
import { OrderFiltersEnum } from '../../../../utils/enums/OrderFiltersEnum';
import { useTranslation } from 'react-i18next';

export default function OrderHistory({ byDoctor, byHospital }) {
    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const doctorId = isLogged && byDoctor && user.data.doctor.id;
    const hospitalId = isLogged && byHospital && user.hospitalId;

    const [isLoaded, setLoaded] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        if (doctorId) {
            getOrderByFilter({ filter: OrderFiltersEnum.ORDERS_BY_DOCTOR, doctor_id: Number(doctorId) })
                .then((resp) => {
                    setLoaded(true);
                    setOrderHistory(resp.data.data);
                })
                .catch((err) => {
                    console.error(err);
                })
        } else if (hospitalId) {
            getOrderByFilter({ filter: OrderFiltersEnum.ORDERS_BY_HOSPITAL, hospital_id: Number(hospitalId) })
                .then((resp) => {
                    setLoaded(true);
                    setOrderHistory(resp.data.data);
                })
                .catch((err) => {
                    console.error(err.response.message);
                })
        }

    }, [doctorId, hospitalId])

    const { t } = useTranslation();

    return (
        <>
            <Header />
            <div className={OrderHistoryStyles.root}>
                <h2 style={{ fontSize: '24px' }}>{t('orderHistory')}</h2>
                {isLoaded && orderHistory.length > 0 ? (
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>#{t('order')}</th>
                                <th>{t('paymentStatus')}</th>
                                <th>{t('paymentId')}</th>
                                <th>{t('services')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderHistory.map((item) => (
                                <tr>
                                    <td width={50}>{item.id}</td>
                                    <td width={150}>{item.paid_status === 'paid' ? 'Оплачено' : ''}</td>
                                    <td width={250}>{item.payment_id}</td>
                                    <td className='d-flex align-items-center flex-wrap gap-1'>
                                        {item.serviceData.map((service) => (
                                            <div className='d-flex align-items-center justity-content-between gap-3' style={{ border: '1px solid black', padding: '5px', borderRadius: '5px', width: '300px', marginBottom: '5px' }}>
                                                <div>{service.serviceName}</div>
                                                <div>{service.departmentTitle}</div>
                                                <div><Moment format='DD.MM.YYYY HH:mm'>{service.startTime}</Moment></div>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <>
                        {byDoctor ? t('doctor') : t('hospitals')} {t('emptyOrders')}
                    </>
                )}
            </div >
        </>
    );
}
