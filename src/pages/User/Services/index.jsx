import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import UserServiceStyle from './Services.module.scss';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOrderByFilter } from '../../../api/httpApiClient';
import { OrderFiltersEnum } from '../../../utils/enums/OrderFiltersEnum';
import { Accordion, Card } from 'react-bootstrap';
import { ServiceToggler } from '../../../components/ServiceToggler';
import Moment from 'react-moment';

export const UserServices = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [userServiceData, setUserServiceData] = useState([]);

    const { _id } = useParams();

    useEffect(() => {
        getOrderByFilter({
            filter: OrderFiltersEnum.ORDERS_BY_USER,
            user_id: _id
        })
            .then((resp) => {
                setIsLoaded(true);
                setUserServiceData(resp.data.data);
            })
            .catch((err) => {
                console.error(err.response);
            })
    }, [])

    return (
        <>
            <Header />
            <div className={UserServiceStyle.root}>
                <h2 style={{ fontSize: '24px', marginBottom: '25px' }}>Мої послуги</h2>

                {isLoaded && userServiceData.length > 0 ? userServiceData.map((item) => (
                    <Accordion>
                        <Card>
                            <Card.Header>
                                <ServiceToggler orderId={item.order.id} amountServices={item.services.length} eventKey="0">Послуги</ServiceToggler>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    {item.services.map((serviceData) => (
                                        <li className={`d-flex justify-content-between align-items-center ${serviceData.is_canceled === 1 ? UserServiceStyle.canceled : ''}`} style={{ marginBottom: '15px', border: '1px solid gray', borderRadius: '15px', padding: '10px' }}>
                                            <div>
                                                <div style={{ marginBottom: '10px' }}>[{serviceData.timeslot.service.id}] {serviceData.timeslot.service.name}</div>
                                                <div>Відділення: {serviceData.timeslot.department.title}</div>
                                            </div>
                                            <div>
                                                <div style={{ marginBottom: '10px' }}>Дата початку: <Moment format='DD.MM.YYYY HH:mm:ss'>{serviceData.timeslot.start_time}</Moment></div>
                                                <div>Ціна: {serviceData.timeslot.price}</div>
                                            </div>
                                        </li>
                                    ))}
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                )) : (<></>)}


            </div>
        </>
    )
}
