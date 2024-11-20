import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import CartStyles from './shoppingCart.module.scss';
import { Badge, Button, Col, Row } from 'react-bootstrap';
import { checkout, getShoppingCart, removeItemFromCart, resetShoppingCart } from '../../api/httpApiClient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import CountdownTimer from '../../components/CountdownTimer';

export const ShoppingCart = () => {
    const [cartData, setCartData] = useState([]);
    const [isCartItemsLoaded, setCartItemsLoaded] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [shoppingCartId, setShopCartId] = useState(null);
    const [cartCreatedAt, setCartCreated] = useState(
        localStorage.getItem('cartCreatedAt') || null
    );
    const navigate = useNavigate();

    const [isRemoved, setRemoved] = useState(false);

    const fetchShoppingCart = async () => {
        getShoppingCart()
            .then((resp) => {
                setCartItemsLoaded(true);
                setCartData(resp.data.items);
                setTotalPrice(getTotalPriceFromItems(resp.data.items));
                setShopCartId(resp.data.id);
                setCartCreated(resp.data.created_at);
                localStorage.setItem('cartCreatedAt', resp.data.created_at);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        fetchShoppingCart();
        if (isRemoved) {
            fetchShoppingCart();
            setRemoved(false);
        }
    }, [isRemoved]);

    const getTotalPriceFromItems = (data) => {
        let totalPrice = 0;
        data.forEach(element => {
            totalPrice += Number(element.price)
        });
        return totalPrice;
    }

    const removeItem = async (e, id) => {
        e.preventDefault();

        removeItemFromCart(id)
            .then((resp) => {
                alert(resp.data.message);
                setRemoved(true);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const cancelShopCart = async (e, id) => {
        e.preventDefault();
        localStorage.removeItem('cartCreatedAt');
        setCartCreated(null);

        resetShoppingCart({
            cart_id: id
        })
            .then((resp) => {
                alert(resp.data.message);
                navigate('/');
            })
            .catch((err) => {
                alert(err.response.data.message)
            })
    }

    const confirmCart = async (e) => {
        e.preventDefault();

        checkout()
            .then((resp) => {
                console.log(resp.data);
                window.location.href = resp.data.session_url || resp.data.success_url;
                localStorage.removeItem('cartCreatedAt');
                setCartCreated(null);
            })
            .catch((err) => {
                console.error(err)
            });
    }

    const handleExpire = () => {
        setCartData([]);
        setCartCreated(null);
        setTotalPrice(0);
        localStorage.removeItem('cartCreatedAt');
    }

    const { t } = useTranslation();

    return (
        <>
            <Header />
            <div className={CartStyles.root}>
                <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', display: 'flex', 'justifyContent': 'center', alignItems: 'center' }}>
                    {t('cart')}
                    <Badge style={{ marginLeft: '10px' }} bg="secondary">{isCartItemsLoaded ? (cartData.length > 0 ? cartData.length : 0) : 0}</Badge>
                    {cartCreatedAt !== null && <CountdownTimer cartCreatedAt={cartCreatedAt} onExpire={handleExpire} />}
                </h1>
                <Row>
                    <Col className={CartStyles.cartContent} lg={8} md={8} xs={8}>
                        <h2 style={{ fontSize: '16px', fontWeight: '500' }}>{t('contents')}</h2>
                        <div className={CartStyles.scrollContainer}>
                            <ul className={CartStyles.itemsList}>
                                {isCartItemsLoaded ? cartData.map((item) => (
                                    <>
                                        <li className={CartStyles.itemContent}>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                                    [{item.service.service_id}]
                                                    {item.service.name}
                                                </div>
                                                <div style={{ color: 'gray' }}>{format(new Date(item.service.start_time), 'dd.MM.yyyy HH:mm')}</div>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div style={{ fontSize: '15px' }}>{item.service.department}</div>
                                                <div style={{ fontWeight: '600', fontSize: '15px' }}>{item.price} {t('uah')}</div>
                                            </div>
                                            <button onClick={(e) => removeItem(e, item.id)}>{t('delete')}</button>
                                        </li>
                                    </>
                                )) : (
                                    <>
                                    </>
                                )}
                            </ul>
                        </div>
                    </Col>
                    {isCartItemsLoaded && (
                        <Col className={CartStyles.checkoutCard} lg={4} md={4} xs={4}>
                            <div className={CartStyles.checkoutCardContent} >
                                <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px' }}>{t('userOrder')}</div>
                                {isCartItemsLoaded && cartData.map((item) => (
                                    <>
                                        <div style={{ marginBottom: '10px' }} className='d-flex align-content-center justify-content-between'>
                                            <div className={CartStyles.cartFirstEl}>{item.service.name}</div>
                                            <div>{item.price}</div>
                                        </div>
                                    </>
                                ))}
                                <div style={{ marginTop: '15px' }} className='d-flex align-content-center justify-content-between'>
                                    <div className={CartStyles.cartFirstEl}>{t('serviceFee')}</div>
                                    <div>10%</div>
                                </div>
                                <hr />
                                <div className='d-flex align-content-center justify-content-between'>
                                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{t('total')}</div>
                                    <div style={{ fontWeight: 'bold' }} >{totalPrice + totalPrice * 0.1} {t('uah')}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '10px' }} className='d-flex align-content-center justify-content-center gap-3' >

                                <Button className='btn btn-danger' onClick={(e) => cancelShopCart(e, shoppingCartId)}>{t('cancelAct')}</Button>
                                <Button className='btn btn-success' onClick={(e) => confirmCart(e)} >{t('confirmAct')}</Button>
                            </div>

                        </Col>
                    )}

                </Row>
            </div>
        </>
    )
}
