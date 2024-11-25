import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cancelCheckout, getOrderByFilter, sendConfirmationEmail } from '../../../../api/httpApiClient';
import { OrderFiltersEnum } from '../../../../utils/enums/OrderFiltersEnum';
import OrderOperationsStyles from './OrderOperations.module.scss';
import Header from '../../../../components/Header';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Modal, Spinner, Tab, Table, Tabs } from 'react-bootstrap';
import Pagination from '../../../../components/Pagination';
import { format } from 'date-fns';
import { ShoppingCartItem } from '../../../../components/ShoppingCartItem';
import FeedFilter from '../../../../components/FeedFilter';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../../redux/slices/authSlice';

export const OrderOperations = ({ isManager }) => {
    const { _id } = useParams() ?? null;

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [orderFeedData, setOrderFeedData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCanceled, setIsCanceled] = useState(false);

    const { t } = useTranslation();

    const [specificOrder, setSpecificOrder] = useState(null);
    const [servicesByOrder, setServicesByOrder] = useState([]);
    const [specificOrderId, setSpecificOrderId] = useState(null);
    const [isSpecificLoaded, setSpecificLoaded] = useState(false);
    const [show, setShow] = useState(false);
    const [filter, setFilter] = useState([]);

    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const isNotAllowedToSee = (_id === undefined && !isManager);

    console.log(isNotAllowedToSee);

    const fetchOrdersFeed = async (page, filters = []) => {
        setFilter(filters);
        getOrderByFilter({
            filter: OrderFiltersEnum.ORDERS_OPERATIONS,
            hospital_id: _id,
            per_page: 10,
            page: currentPage,
            criteriaCondition: filters
        })
            .then((resp) => {
                setIsLoaded(true);
                setOrderFeedData(resp.data.data);
                setCurrentPage(resp.data.meta.current_page);
                setTotalPages(resp.data.meta.last_page);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const handleClose = () => {
        setShow(false);
        setSpecificOrder(null);
        setSpecificLoaded(false);
    }

    const handleShow = async (order_id, e) => {
        e.preventDefault();
        setShow(true);
        getOrderByFilter({
            filter: OrderFiltersEnum.ORDERS_BY_ID,
            order_id: order_id,
        })
            .then((resp) => {
                setSpecificLoaded(true);
                setSpecificOrder(orderFeedData.find((order) => order.orderId === order_id));
                setServicesByOrder(resp.data.order_services);
            })
            .catch((err) => {
                console.error(err);
            })
        // setSpecificOrderId(order_id);
        // let result = orderFeedData.find((order) => order.orderId === order_id);
        // setSpecificOrder(result);
    }
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        if (isLogged && !isNotAllowedToSee) {
            fetchOrdersFeed(currentPage, filter);
        } else if (isNotAllowedToSee) {
            navigate('/404');
        }

        if (isCanceled) {
            fetchOrdersFeed(currentPage, filter);
            setIsCanceled(false);
        }

    }, [currentPage, isLogged, isCanceled])

    const handlePageChange = async (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    }

    const sendConfirmation = (order_id, e) => {
        e.preventDefault();
        setIsDisabled(true);

        sendConfirmationEmail({ order_id: order_id })
            .then((resp) => {
                setTimeout(() => {
                    setIsDisabled(false);
                }, 20000);
                alert(resp.data.message);
            })
            .catch((err) => {
                console.error(err);
            })

    }

    const cancelOrder = (order_id, e) => {
        e.preventDefault();
        const params = { order_id: order_id }
        setIsDisabled(true);

        cancelCheckout(params)
            .then((resp) => {
                alert(resp.data.message);
                setTimeout(() => {
                    setIsDisabled(false);
                }, 20000);
                setIsCanceled(true);
                handleClose();
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const [isButtonDisabled, setIsDisabled] = useState(false);

    return (
        <>
            <Header />
            <div className={OrderOperationsStyles.root}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>{t('operations')}</h1>
                <div className={OrderOperationsStyles.filterDiv}>
                    <FeedFilter
                        hospitalId={_id}
                        filter={OrderFiltersEnum.ORDERS_OPERATIONS}
                        perPage={10}
                        page={currentPage}
                        onFetchData={fetchOrdersFeed}
                    />
                </div>
                {isLoaded ? (
                    <div>
                        <Table hover>
                            <thead>
                                <th>ID</th>
                                <th>{t('status')}</th>
                                <th>{t('name')}</th>
                                <th>{t('numofservices')}</th>
                                <th>{t('totalSum')}</th>
                                <th>{t('dateSold')}</th>
                                <th>{t('reserveExp')}</th>
                                <th>{t('client')}</th>
                            </thead>
                            <tbody>
                                {orderFeedData.map((obj, index) => (
                                    <tr className={OrderOperationsStyles.rows} onClick={(e) => handleShow(obj.orderId, e)}>
                                        <td>{obj.orderId}</td>
                                        <td>{obj.paid_status === 'SOLD' ? t('paid') : obj.paid_status === 'PENDING' ? t('pending') : t('cancel')}</td>
                                        <td>{obj.hospital_title}</td>
                                        <td>{obj.service_quantity}</td>
                                        <td>{obj.paid_total}</td>
                                        <td>{obj.date_confirmed ? format(new Date(obj.date_confirmed), 'dd.MM.yyyy HH:mm') : '-'}</td>
                                        <td>{obj.reserve_expiration ? format(new Date(obj.reserve_expiration), 'dd.MM.yyyy HH:mm') : '-'}</td>
                                        <td>{obj.client_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                ) : (
                    <>
                        Loading....
                    </>
                )}
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    size={"lg"}

                >
                    {isSpecificLoaded ? (
                        <>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>{t('order')}</strong>
                                            # {specificOrder.orderId}

                                            <Badge style={{ marginLeft: '10px' }} bg={specificOrder.paid_status === 'SOLD' ? 'success' : specificOrder.paid_status === 'PENDING' ? 'info' : 'danger'}>{specificOrder.paid_status === 'SOLD' ? t('paid') : specificOrder.paid_status === 'PENDING' ? t('pending') : t('cancel')}
                                            </Badge>
                                        </div>

                                        {specificOrder.payment_id && (
                                            <div style={{ marginLeft: '10px' }}>
                                                <Badge bg="secondary">
                                                    {specificOrder.payment_id}
                                                </Badge>
                                            </div>
                                        )}

                                    </div>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <Tabs
                                        defaultActiveKey="orderInfo"
                                        // id="fill-tab-example"
                                        className="mb-3"
                                        fill
                                    >
                                        <Tab eventKey="orderInfo" title={t('information')}>
                                            <div className={OrderOperationsStyles.orderInfoRoot}>
                                                <div>
                                                    <p>
                                                        <strong>{t('client')}:</strong>
                                                        <span> {specificOrder.client_name}</span>
                                                    </p>
                                                    <p>
                                                        <strong>{t('phone')}:</strong>
                                                        <span> {specificOrder.client_phone}</span>
                                                    </p>
                                                    <p>
                                                        <strong>{t('email')}:</strong>
                                                        <span> {specificOrder.client_email}</span>
                                                    </p>
                                                    {specificOrder.reserve_expiration && (
                                                        <p>
                                                            <strong>{t('reserveExp')}:</strong>
                                                            <span> {format(new Date(specificOrder.reserve_expiration), 'dd.MM.yyyy HH:mm')}</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <p>
                                                        <strong>{t('dateCreated')}:</strong>
                                                        <span> {format(new Date(specificOrder.date_created), 'dd.MM.yyyy HH:mm')}</span>
                                                    </p>
                                                    <p>
                                                        <strong>{t('dateConfirmed')}:</strong>
                                                        <span>  {specificOrder.date_confirmed ? format(new Date(specificOrder.date_confirmed), 'dd.MM.yyyy HH:mm') : '-'}</span>
                                                    </p>
                                                    <p>
                                                        <strong>{t('totalSum')}:</strong>
                                                        <span> {specificOrder.paid_total} {t('uah')}</span>
                                                    </p>
                                                    <p>
                                                        <strong>{t('subtotal')}:</strong>
                                                        <span> {specificOrder.paid_subtotal} {t('uah')}</span>
                                                    </p>
                                                    <p>
                                                        <strong>{t('serviceFee')}:</strong>
                                                        <span> {specificOrder.paid_total - specificOrder.paid_subtotal} {t('uah')}</span>
                                                    </p>
                                                    {specificOrder.canceled_at && (
                                                        <>
                                                            <p>
                                                                <strong>{t('dateCancel')}:</strong>
                                                                <span> {specificOrder.canceled_at}</span>
                                                            </p>
                                                            <p>
                                                                <strong>{t('reason')}:</strong>
                                                                <span> {specificOrder.cancel_reason}</span>
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>


                                        </Tab>
                                        <Tab eventKey="orderServices" title={t('services')}>
                                            <div style={{ padding: '20px 30px 10px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                                                    <div >
                                                        <p>
                                                            <strong>{t('hospital')}:</strong> {specificOrder.hospital_title}
                                                        </p>
                                                        <p>
                                                            <strong>{t('address')}:</strong> {specificOrder.hospital_address}
                                                        </p>
                                                    </div>
                                                    <div style={{ marginBottom: '15px' }}>
                                                        <p>
                                                            <strong>{t('phone')}:</strong> {specificOrder.hospital_phone}
                                                        </p>
                                                        <p>
                                                            <strong>{t('email')}:</strong> {specificOrder.hospital_email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
                                                    {t('services')}
                                                </div>
                                                {servicesByOrder.map((item, ind) => (
                                                    <ShoppingCartItem
                                                        service_id={item.timeslot.service.id}
                                                        service_name={item.timeslot.service.name}
                                                        start_time={item.timeslot.start_time}
                                                        department={item.timeslot.department.title}
                                                        price={item.timeslot.price}
                                                        key={ind}
                                                        canDownload={specificOrder.paid_status !== 'CANCELED' && specificOrder.paid_status !== 'PENDING'}

                                                    />
                                                ))}

                                            </div>
                                        </Tab>
                                        <Tab disabled={specificOrder.paid_status !== 'SOLD'} eventKey="orderActions" title={t('actions')}>
                                            <div style={{ padding: '20px 30px 10px' }}>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>
                                                        <div>{t('sendSlots')} - {specificOrder.client_email}</div>
                                                        <Button disabled={isButtonDisabled} onClick={(e) => sendConfirmation(specificOrder.orderId, e)} style={{ margin: '15px 0' }} >
                                                            {t('sendSth')}
                                                        </Button>
                                                    </div>
                                                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>
                                                        <div>{t('cancelOrder')}</div>
                                                        <Button onClick={(e) => cancelOrder(specificOrder.orderId, e)} style={{ margin: '15px 0' }} >
                                                            {t('confirmAct')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Modal.Body>
                        </>

                    ) :
                        (
                            <div className='d-flex justify-content-center align-items-center' style={{ maxHeight: '100vh' }}>
                                <Spinner animation="border" variant="primary" />
                            </div>

                        )
                    }
                </Modal>
            </div>
        </>
    )
}
