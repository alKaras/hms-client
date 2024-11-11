import React, { useState } from 'react'
import { getOrderByFilter } from '../../api/httpApiClient';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FeedFilterStyles from './FeedFilter.module.scss';
import { addDays, format } from 'date-fns';
import { ReportFilterEnum } from '../../utils/enums/ReportFiltersEnum';

export default function FeedFilter({
    hospitalId,
    filter,
    perPage,
    page,
    onFetchData,
    onFetchReport,
    reportPage
}) {
    const [conditions, setConditions] = useState([]);

    const [dateCreated, setDateCreated] = useState(null);
    const [dateEndCreated, setDateEndCreated] = useState(null);
    const [dateConfirmed, setDateConfirmed] = useState(null);
    const [dateEndConfirmed, setDateEndConfirmed] = useState(null);
    const [reportFilter, setReportFilter] = useState('');

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');

    const handleDateCreatedChange = (date) => {
        setDateCreated(date);
        if (date && dateEndCreated) {
            setConditions((prevConditions) => [
                ...prevConditions.filter(cond => cond[0] !== 'created_at'),
                ['created_at', '>=', format(new Date(date), 'yyyy-MM-dd')],
                ['created_at', '<=', format(new Date(dateEndCreated), 'yyyy-MM-dd')]
            ]);
        }
    };

    const handleDateEndCreatedChange = (date) => {
        setDateEndCreated(date);
        if (dateCreated && date) {
            setConditions((prevConditions) => [
                ...prevConditions.filter(cond => cond[0] !== 'created_at'),
                ['created_at', '>=', format(new Date(dateCreated), 'yyyy-MM-dd')],
                ['created_at', '<=', format(new Date(date), 'yyyy-MM-dd')]
            ]);
        }
    };

    const handleDateConfirmedChange = (date) => {
        setDateConfirmed(date);
        if (date && dateEndConfirmed) {
            setConditions((prevConditions) => [
                ...prevConditions.filter(cond => cond[0] !== 'confirmed_at'),
                ['confirmed_at', '>=', format(new Date(date), 'yyyy-MM-dd')],
                ['confirmed_at', '<=', format(new Date(dateEndConfirmed), 'yyyy-MM-dd')]
            ]);
        }
    };

    const handleDateEndConfirmedChange = (date) => {
        setDateEndConfirmed(date);
        if (dateConfirmed && date) {
            setConditions((prevConditions) => [
                ...prevConditions.filter(cond => cond[0] !== 'confirmed_at'),
                ['confirmed_at', '>=', format(new Date(dateEndConfirmed), 'yyyy-MM-dd')],
                ['confirmed_at', '<=', format(new Date(date), 'yyyy-MM-dd')]
            ]);
        }
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;

        setTitle(value);
        setConditions((prevConditions) => [
            ...prevConditions.filter(cond => cond[0] !== 'title'),
            ['hospital_title', 'LIKE', `%${value}%`]
        ]);
    }

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatus(value);
        setConditions((prevConditions) => [
            ...prevConditions.filter(cond => cond[0] !== 'status'),
            ['status', '=', parseInt(value, 10)]
        ]);
    };

    const handleFilterReportChange = (e) => {
        const value = e.target.value;
        setReportFilter(value);
    }

    const fetchData = () => {
        if (!reportPage) {
            onFetchData(
                page,
                conditions
            )
        } else {
            onFetchReport(
                conditions,
                reportFilter
            )
        }

    };

    const refreshFilter = (e) => {
        e.preventDefault();
        setConditions([]);
        setDateCreated(null);
        setDateEndCreated(null);
        setDateConfirmed(null);
        setDateEndConfirmed(null);
        setTitle('');
        setStatus('');
        setReportFilter('');
    }

    return (
        <div className={FeedFilterStyles.root}>

            <div className={FeedFilterStyles.content}>
                <div>
                    <div style={{ marginBottom: '10px' }} className='d-flex align-items-center justify-content-between gap-3'>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={'Created Date Start:'}
                                value={dateCreated}
                                onChange={handleDateCreatedChange}
                                format='dd.MM.yyyy'
                                placeholderText="Select start date"
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={'Created Date End:'}
                                value={dateEndCreated}
                                onChange={handleDateEndCreatedChange}
                                minDate={addDays(new Date(dateCreated), 1)}
                                format='dd.MM.yyyy'
                                placeholderText="Select end date"

                            />
                        </LocalizationProvider>
                    </div>

                    <div className='d-flex align-items-center justify-content-between gap-3'>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={'Confirmed Date Start:'}
                                value={dateConfirmed}
                                onChange={handleDateConfirmedChange}
                                format='dd.MM.yyyy'
                                placeholderText="Select start date"
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={'Confirmed Date End:'}
                                value={dateEndConfirmed}
                                onChange={handleDateEndConfirmedChange}
                                minDate={addDays(new Date(dateConfirmed), 1)}
                                format='dd.MM.yyyy'
                                placeholderText="Select end date"
                            />
                        </LocalizationProvider>
                    </div>
                </div>
                {!reportPage ? (
                    <>
                        <div className='d-flex flex-column'>
                            <label style={{ marginBottom: '5px', marginTop: '10px', fontWeight: 'bold' }}>Title:</label>
                            <input
                                type="text"
                                value={title}
                                placeholder="Enter title"
                                onChange={handleTitleChange}
                                className={FeedFilterStyles.inputText}
                            />
                        </div>

                        <div className='d-flex flex-column'>
                            <label style={{ marginBottom: '5px', marginTop: '10px', fontWeight: 'bold' }}>Status:</label>
                            <select value={status} defaultValue={""} onChange={handleStatusChange}>
                                <option value="" disabled>Select Status</option>
                                <option value="1">PENDING</option>
                                <option value="2">PAID</option>
                                <option value="3">CANCELED</option>
                            </select>
                        </div>
                    </>
                ) : (
                    <div className='d-flex flex-column'>
                        <select value={reportFilter} defaultValue={""} onChange={handleFilterReportChange}>
                            <option value="" disabled>Select report filter</option>
                            <option value={ReportFilterEnum.REPORT_BY_HOSPITAL}>Report by hospital</option>
                        </select>
                    </div>
                )}


                <div style={{ alignSelf: 'flex-end' }}>
                    <button style={{ marginRight: '15px' }} className='btn btn-primary' onClick={fetchData}>Fetch Data</button>
                    <button style={{ background: 'none' }} onClick={(e) => refreshFilter(e)}>
                        <i class="fa-solid fa-arrows-rotate"></i>
                    </button>
                </div>

            </div>
        </div>
    );
}
