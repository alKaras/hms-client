import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { getOrderByFilter } from '../../api/httpApiClient';
import { Link, useLocation } from 'react-router-dom';
import SuccessPageStyles from './Checkout.module.scss';
import { LinkContainer } from 'react-router-bootstrap';
import { ShoppingCartItem } from '../../components/ShoppingCartItem';
import { OrderFiltersEnum } from '../../utils/enums/OrderFiltersEnum';

export const SuccessPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id') ?? null;
    const orderId = queryParams.get('order_id') ?? null;

    const [orderData, setOrderData] = useState(null);
    const [orderServiceData, setOrderServiceData] = useState([]);
    const [isDataLoaded, setDataLoaded] = useState(false);
    useEffect(() => {
        let params = {};
        if (sessionId) {
            params.session_id = sessionId;
            params.filter = OrderFiltersEnum.ORDERS_BY_SESSION
        }
        if (orderId) {
            params.order_id = orderId;
            params.filter = OrderFiltersEnum.ORDERS_BY_ID
        }
        getOrderByFilter(params)
            .then((resp) => {
                console.log(resp.data);
                setDataLoaded(true);
                setOrderData(resp.data.order);
                setOrderServiceData(resp.data.order_services);
            })
            .catch((err) => {
                console.error(err);
                setDataLoaded(false);
            })
    }, [])
    return (
        <>
            <div className={SuccessPageStyles.root}>
                <div className={SuccessPageStyles.contentBlock}>
                    <div style={{ fontSize: '22px', textTransform: 'uppercase', fontWeight: '600' }}>
                        Дякуємо за оплату! Ваше бронювання підтверджено
                    </div>
                    <div>
                        <p style={{ lineHeight: '150%', marginBottom: '10px' }}>Ваша оплата пройшла успішно, і ми раді повідомити, що талони для обраних послуг були успішно заброньовані. Наші фахівці будуть готові прийняти вас у призначений час. Ви можете переглянути деталі бронювання у своєму особистому кабінеті.</p>
                        <LinkContainer className={SuccessPageStyles.links} to={'/user/profile'}>
                            <button>Перейти в кабінет</button>
                        </LinkContainer>
                        <p>Якщо у вас виникли питання або ви хочете змінити час візиту, будь ласка, зв'яжіться з нашою підтримкою.</p>
                        <p>Дякуємо, що обрали нашу лікарню для вашого здоров'я! Ми дбаємо про ваше здоров'я. Залишайтесь на зв'язку та будьте здорові!</p>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div>
                            <Link className='d-flex justify-content-between align-items-center' to={'/'}>
                                <img
                                    src="/assets/logo/logo.svg"
                                    alt="logo"
                                    width={40}
                                    height={40}
                                    className='align-middle' />

                                <p style={{ marginLeft: '15px', fontWeight: 'bold', fontSize: '18px' }}>HMS</p>
                            </Link>
                        </div>
                        <div className='d-flex justify-content-between align-items-center gap-5'>
                            <a href='mailto:al.karas.pr@gmail.com'>info@hms.ua</a>
                            <a href='tel:+380500415840'>0800123456</a>
                        </div>
                    </div>
                    {isDataLoaded ? (
                        <div className={SuccessPageStyles.orderContent}>
                            <div style={{ fontSize: '16px' }}>
                                <p><strong>Замовлення</strong>: {orderData.id}</p>
                                <p><strong>Статус оплати</strong>: {orderData.status === 2 ? 'Оплачено' : (orderData.status === 1 ? 'В очікуванні оплати' : 'Скасовано')}</p>

                            </div>
                            <div className={SuccessPageStyles.orderServiceContent}>
                                <ul style={{ marginTop: '25px' }}>
                                    {orderServiceData.map((data) => (
                                        <>
                                            <ShoppingCartItem
                                                service_id={data.timeslot.service.id}
                                                service_name={data.timeslot.service.name}
                                                start_time={data.timeslot.start_time}
                                                department={data.timeslot.department.title}
                                                price={data.timeslot.price}
                                                key={data.id}
                                                id={data.timeslot.id}
                                                canRemove={false}
                                                canDownload={true}

                                            />

                                        </>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (<>Завантаження...</>)}
                </div>
            </div>

        </>
    )
}
