import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getOrderByFilter } from '../../../../api/httpApiClient';
import { OrderFiltersEnum } from '../../../../utils/enums/OrderFiltersEnum';
import OrderOperationsStyles from './OrderOperations.module.scss';
import Header from '../../../../components/Header';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap';
import Pagination from '../../../../components/Pagination';
import { format } from 'date-fns';

export const OrderOperations = () => {
    const { _id } = useParams() ?? null;

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [orderFeedData, setOrderFeedData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        getOrderByFilter({
            filter: OrderFiltersEnum.ORDERS_OPERATIONS,
            hospital_id: _id,
            per_page: 10,
            page: currentPage
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
    }, [currentPage])

    const handlePageChange = async (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    }

    return (
        <>
            <Header />
            <div className={OrderOperationsStyles.root}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>{t('operations')}</h1>
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
                        {isLoaded && orderFeedData.map((obj, index) => (
                            <tr className={OrderOperationsStyles.rows}>
                                <td>{obj.orderId}</td>
                                <td>{obj.paid_status}</td>
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

        </>
    )
}
