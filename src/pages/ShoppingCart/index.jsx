import React from 'react'
import Header from '../../components/Header'
import CartStyles from './shoppingCart.module.scss';
import { Badge, Button, Col, Row, Table } from 'react-bootstrap';
import Moment from 'react-moment';

export const ShoppingCart = () => {
    return (
        <>
            <Header />
            <div className={CartStyles.root}>
                <h1 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '25px' }}>
                    Ваш кошик <Badge style={{ marginLeft: '10px' }} bg="secondary">15</Badge>
                </h1>
                <Row>
                    <Col className={CartStyles.cartContent} lg={8} md={8} xs={8}>
                        <h2 style={{ fontSize: '16px', fontWeight: '500' }}>Вміст кошика</h2>
                        <div className={CartStyles.scrollContainer}>
                            <ul className={CartStyles.itemsList}>
                                {[...Array(5)].map((item) => (
                                    <li className={CartStyles.itemContent}>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>[1] Консультація ендокринолога</div>
                                            <div style={{ color: 'gray' }}><Moment format='DD.MM.YYYY HH:mm'>2024-10-07 14:00:00</Moment></div>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div style={{ fontSize: '15px' }}>Ендокринологія</div>
                                            <div style={{ fontWeight: '600', fontSize: '15px' }}>100UAH</div>
                                        </div>
                                        <button>Видалити</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>
                    <Col className={CartStyles.checkoutCard} lg={4} md={4} xs={4}>
                        <div className={CartStyles.checkoutCardContent} >
                            <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px' }}>Підсумки замовлення</div>
                            <hr />
                            <div style={{ paddingTop: '50px', marginBottom: '15px' }} className='d-flex align-content-center justify-content-between'>
                                <div className={CartStyles.cartFirstEl}>Сума замовлення</div>
                                <div>200</div>
                            </div>
                            <div style={{ marginBottom: '15px', paddingBottom: '25px' }} className='d-flex align-content-center justify-content-between'>
                                <div className={CartStyles.cartFirstEl}>Сервісний збір</div>
                                <div>15%</div>
                            </div>
                            <hr />
                            <div className='d-flex align-content-center justify-content-between'>
                                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>ВСЬОГО</div>
                                <div style={{ fontWeight: 'bold' }} >220 UAH</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '10px' }} className='d-flex align-content-center justify-content-center gap-3' >
                            <Button className='btn btn-danger'>Скасувати</Button>
                            <Button className='btn btn-success'>Підтвердити</Button>
                        </div>

                    </Col>
                </Row>
            </div>
        </>
    )
}
