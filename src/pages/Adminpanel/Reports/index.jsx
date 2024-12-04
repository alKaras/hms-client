import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../../components/Header';
import ReportStyles from './Reports.module.scss';
import FeedFilter from '../../../components/FeedFilter';
import { exportReport, getReportByFilter } from '../../../api/httpApiClient';
import { Button, Table } from 'react-bootstrap';
import { useTranslation, i18n } from 'react-i18next';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../redux/slices/authSlice';
import { Alert, Snackbar } from '@mui/material';

export default function Reports() {

    const location = useLocation();
    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const queryParams = new URLSearchParams(location.search);
    const hospitalId = (isLogged && user.hospitalId !== null) ? user.hospitalId : queryParams.get('hospital');

    const [filter, setFilter] = useState([]);
    const [reportFilter, setReportFilter] = useState('HospitalReport');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [isLoaded, setLoaded] = useState(false);
    const [reportFeedData, setReportFeedData] = useState([]);
    const [reportFeedDataDetailed, setReportDetailedData] = useState([]);
    const [reportData, setReportData] = useState([]);



    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState(null);


    const fetchReportFeed = async (filters = [], filter) => {
        setFilter(filters);
        setReportFilter(filter);
        getReportByFilter({
            filterType: filter,
            hospital_id: hospitalId,
            criteriaCondition: filters
        })
            .then((resp) => {
                setLoaded(true);
                setReportFeedData(resp.data.general);
                setReportDetailedData(resp.data.detailed);
                setReportData(resp.data);
                setDisabled(false);
            })
            .catch((err) => {
                console.error(err);
                setLoaded(false);
                setReportFeedData([]);
                setReportDetailedData([]);
                setReportData([]);
                setDisabled(true);
                setError("Data is not provided or there is no data for this filters");
            })
    }
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        if (isLogged) {
            fetchReportFeed(filter, reportFilter);
        }
    }, [hospitalId]);




    const onDownloadReport = async (e) => {
        e.preventDefault();
        setDisabled(true);
        try {
            const resp = await exportReport({
                data: reportData
            });

            if (resp.status === 200) {

                const blob = resp.data;
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Hospital_Report.xlsx';
                document.body.appendChild(link);
                link.click();

                // Cleanup
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                setDisabled(false);
                console.error('Failed to export report');
            }
        } catch (err) {
            setDisabled(false);
            console.error('Error downloading report:', err);
        }
    }

    const handleClose = () => {
        setError(null);
    }



    return (
        <>
            <Header />
            <div className={ReportStyles.root}>
                <div style={{ marginBottom: '15px' }}>
                    <FeedFilter
                        reportPage={true}
                        page={currentPage}
                        perPage={10}
                        onFetchReport={fetchReportFeed}
                    />
                </div>
                <div style={{ marginTop: '25px' }}>
                    <Button disabled={disabled} onClick={(e) => onDownloadReport(e)} className='btn btn-secondary'>{t('download')} <i className="fa-solid fa-file-export"></i></Button>
                </div>
                <div style={{ marginTop: '50px' }}>
                    {isLoaded ? (
                        <>
                            <h2 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '15px' }}>{t('information')}</h2>
                            <Table style={{ marginBottom: '25px' }}>
                                <thead>
                                    <tr className='text-center'>
                                        <th>ID</th>
                                        <th>{t('name')}</th>
                                        <th>{t('address')}</th>
                                        <th>{t('numofservices')}</th>
                                        <th>{t('totalSum')}</th>
                                        <th>{t('avgServicePerDay')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportFeedData.map((item) => (
                                        <tr className='text-center'>
                                            <td>{item.hospitalId}</td>
                                            <td>{item.hospitalTitle}</td>
                                            <td>{item.hospitalAddress}</td>
                                            <td>{item.totalServiceQuantity}</td>
                                            <td>{item.totalSum}</td>
                                            <td>{Number(item.averageServicesPerDay).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <h2 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '15px' }}>{t('detailedInfo')}</h2>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>{t('service')}</th>
                                        <th>{t('numofservices')}</th>
                                        <th>{t('totalSum')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportFeedDataDetailed.map((detail) => (
                                        <tr>
                                            <td>[{detail.serviceId}] {detail.serviceName}</td>
                                            <td>{detail.quantity}</td>
                                            <td>{detail.serviceTotalSum}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </div>
            </div>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
}
