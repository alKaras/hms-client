import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import UserServiceStyle from './Services.module.scss';
import { useParams } from 'react-router-dom';
import { downloadPdfTimeslot, getOrderByFilter } from '../../../api/httpApiClient';
import { OrderFiltersEnum } from '../../../utils/enums/OrderFiltersEnum';
import { Accordion, Button, Card } from 'react-bootstrap';
import { ServiceToggler } from '../../../components/ServiceToggler';
import Moment from 'react-moment';
import { useTranslation } from 'react-i18next';

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
                //Output only sold orders
                let tempUserData = resp.data.data.filter((item) => item.order.status === 2);
                setUserServiceData(tempUserData);
            })
            .catch((err) => {
                console.error(err.response);
            })
    }, [])

    const downloadItem = async (e, id) => {
        e.preventDefault();
        downloadPdfTimeslot(id)
            .then((resp) => {
                const file = new Blob([resp.data], {
                    type: 'application/pdf',
                });

                const link = document.createElement('a');

                link.href = window.URL.createObjectURL(file);

                link.download = `timeslot-${id}.pdf`;

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
            })
            .catch((err) => console.error(err.response));

    }

    const { t } = useTranslation();

    return (
        <>
            <Header />
            <div className={UserServiceStyle.root}>
                <h2 style={{ fontSize: '24px', marginBottom: '25px' }}>{t('userServices')}</h2>
                <div className={UserServiceStyle.content}>
                    {isLoaded && userServiceData.length > 0 ? userServiceData.map((item) => (
                        <Accordion>
                            <Card>
                                <Card.Header>
                                    <ServiceToggler
                                        orderId={item.order.id}
                                        status={item.order.status === 2 ? t('paid') : (item.order.status === 3 ? t('cancel') : t('pending'))}
                                        amountServices={item.services.length}
                                        eventKey="0"
                                    >
                                        <i class="fa-solid fa-angle-down"></i>
                                    </ServiceToggler>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body className={UserServiceStyle.cardsContent}>
                                        {item.services.map((serviceData) => (
                                            <li
                                                className={`d-flex justify-content-between align-items-center 
                                                    ${serviceData.is_canceled === 1 ? UserServiceStyle.canceled : ''} 
                                                    ${UserServiceStyle.cardService}`
                                                }
                                            >
                                                <div>
                                                    <div style={{ marginBottom: '10px' }}>[{serviceData.timeslot.service.id}] {serviceData.timeslot.service.name}</div>
                                                    <div>{t('departments')}: {serviceData.timeslot.department.title}</div>
                                                </div>
                                                <div className={`d-flex justify-content-between align-items-center`}>
                                                    <div>
                                                        <div style={{ marginBottom: '10px' }}>{t('startTime')}: <Moment format='DD.MM.YYYY HH:mm:ss'>{serviceData.timeslot.start_time}</Moment></div>
                                                        <div>{t('price')}: {serviceData.timeslot.price}</div>
                                                    </div>
                                                    {serviceData.is_canceled === 0 ? (
                                                        <Button onClick={(e) => downloadItem(e, serviceData.timeslot.id)} className='btn btn-secondary' style={{ color: 'white', marginLeft: '15px' }}><i class="fa-solid fa-download"></i></Button>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    )) : (<></>)}
                </div>


            </div>
        </>
    )
}
