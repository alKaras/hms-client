import React, { useEffect, useState } from 'react';
import Header from '../../../../components/Header';
import OrderHistoryStyles from './OrderHistory.module.scss';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../../redux/slices/authSlice';
import { getOrderByFilter } from '../../../../api/httpApiClient';
import Moment from 'react-moment';
import { OrderFiltersEnum } from '../../../../utils/enums/OrderFiltersEnum';

export default function OrderHistory() {
    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const doctorId = isLogged && user.data.doctor.id;

    const [isLoaded, setLoaded] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        getOrderByFilter({ filter: OrderFiltersEnum.ORDERS_BY_DOCTOR, doctor_id: Number(doctorId) })
            .then((resp) => {
                setLoaded(true);
                setOrderHistory(resp.data.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [doctorId])
    return (
        <>
            <Header />
            <div className={OrderHistoryStyles.root}>
                <h2 style={{ fontSize: '24px' }}>Замовлення</h2>
                {isLoaded && orderHistory.length > 0 ? (
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>#Замовлення</th>
                                <th>Статус оплати</th>
                                <th>Айді оплати</th>
                                <th>Послуги</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderHistory.map((item) => (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.paid_status === 'paid' ? 'Оплачено' : ''}</td>
                                    <td>{item.payment_id}</td>
                                    <td className='d-flex align-items-center justity-content-between gap-2 flex-wrap'>
                                        {item.serviceData.map((service) => (
                                            <>
                                                <div>{service.serviceName}</div>
                                                <div>{service.departmentTitle}</div>
                                                <div><Moment format='DD.MM.YYYY HH:mm'>{service.startTime}</Moment></div>
                                            </>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <>
                        Для цього лікаря ще немає оплачених замовлень
                    </>
                )}
            </div>
        </>
    );
}
