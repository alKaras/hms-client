import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { getOrderByFilter } from '../../api/httpApiClient';
import { Link, useLocation } from 'react-router-dom';
import SuccessPageStyles from './Checkout.module.scss';
import { LinkContainer } from 'react-router-bootstrap';
import { ShoppingCartItem } from '../../components/ShoppingCartItem';
import { OrderFiltersEnum } from '../../utils/enums/OrderFiltersEnum';
import { useTranslation } from 'react-i18next';

export const SuccessPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id') ?? null;
    const orderId = queryParams.get('order_id') ?? null;

    const [orderData, setOrderData] = useState(null);
    const [orderServiceData, setOrderServiceData] = useState([]);
    const [isDataLoaded, setDataLoaded] = useState(false);

    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
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
    const { t } = useTranslation();
    return (
        <>
            <div className={SuccessPageStyles.root}>
                <div className={SuccessPageStyles.contentBlock}>
                    <div style={{ fontSize: '22px', textTransform: 'uppercase', fontWeight: '600' }}>
                        {t('successmsg1')}
                    </div>
                    <div>
                        <p style={{ lineHeight: '150%', marginBottom: '10px' }}>{t('successmsg2')}</p>
                        <LinkContainer className={SuccessPageStyles.links} to={'/user/profile'}>
                            <button>{t("intoProfile")}</button>
                        </LinkContainer>
                        <p>{t('successmsg3')}</p>
                        <p>{t('successmsg4')}</p>
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
                                <p><strong>{t('order')}</strong>: {orderData.id}</p>
                                <p><strong>{t('paymentStatus')}</strong>: {orderData.status === 2 ? t('paid') : (orderData.status === 1 ? t('pending') : t('cancel'))}</p>

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
                    ) : (<>Loading...</>)}
                </div>
            </div>

        </>
    )
}
