import React, { useEffect, useState } from 'react';
import Header from '../../../../components/Header';
import OrderHistoryStyles from './OrderHistory.module.scss';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../../redux/slices/authSlice';
import { getOrderByFilter } from '../../../../api/httpApiClient';
import { OrderFiltersEnum } from '../../../../utils/enums/OrderFiltersEnum';
import { useTranslation } from 'react-i18next';
import Pagination from '../../../../components/Pagination';
import { format } from 'date-fns';

export default function OrderHistory({ byDoctor, byHospital }) {
    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const doctorId = isLogged && byDoctor && user.doctor;
    const hospitalId = isLogged && byHospital && user.hospitalId;

    const [isLoaded, setLoaded] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);

    useEffect(() => {
        if (doctorId) {
            getOrderByFilter({ filter: OrderFiltersEnum.ORDERS_BY_DOCTOR, doctor_id: Number(doctorId), per_page: 10, page: currentPage })
                .then((resp) => {
                    setLoaded(true);
                    setOrderHistory(resp.data.data);
                    setCurrentPage(resp.data.meta.current_page);
                    setTotalPages(resp.data.meta.last_page);
                })
                .catch((err) => {
                    console.error(err);
                })
        } else if (hospitalId) {
            getOrderByFilter({ filter: OrderFiltersEnum.ORDERS_BY_HOSPITAL, hospital_id: Number(hospitalId), per_page: 10, page: currentPage })
                .then((resp) => {
                    setLoaded(true);
                    setOrderHistory(resp.data.data);
                    setCurrentPage(resp.data.meta.current_page);
                    setTotalPages(resp.data.meta.last_page);
                })
                .catch((err) => {
                    console.error(err.response.message);
                })
        }

    }, [doctorId, hospitalId, currentPage])

    const { t } = useTranslation();
    const handlePageChange = async (page) => {
        // dispatch(getUsers({ page, perPage: 10 }));
        if (page !== currentPage) {
            setCurrentPage(page);
        }
        // getUsers({ page: page, perPage: 10 });
    }

    return (
        <>
            <Header />
            <div className={OrderHistoryStyles.root}>
                <h2 style={{ fontSize: '24px' }}>{t('orderHistory')}</h2>
                {isLoaded && orderHistory.length > 0 ? (
                    <>
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>#{t('order')}</th>
                                    <th>{t('paymentStatus')}</th>
                                    {byHospital && (<th>{t('paymentId')}</th>)}
                                    <th>{t('services')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderHistory.map((item) => (
                                    <tr>
                                        <td width={50}>{item.id}</td>
                                        <td width={150}>{item.paid_status === 'paid' ? 'Оплачено' : ''}</td>
                                        {byHospital && (<td width={250}>{item.payment_id}</td>)}
                                        <td className='d-flex align-items-center flex-wrap gap-1'>
                                            {item.serviceData.map((service) => (
                                                <div className='d-flex align-items-center justity-content-between gap-3' style={{ border: '1px solid black', padding: '5px', borderRadius: '5px', width: '300px', marginBottom: '5px' }}>
                                                    <div>{service.serviceName}</div>
                                                    <div>{service.departmentTitle}</div>
                                                    <div>{format(new Date(service.startTime), 'dd.MM.yyyy HH:mm')}</div>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                ) : (
                    <>
                        {byDoctor ? t('doctor') : t('hospitals')} {t('emptyOrders')}
                    </>
                )}
                <Pagination

                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}

                />
            </div >
        </>
    );
}
