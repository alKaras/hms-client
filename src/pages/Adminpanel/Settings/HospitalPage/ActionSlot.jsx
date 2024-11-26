import React, { useEffect, useState } from 'react'
import Header from '../../../../components/Header'
import ActionSlotStyles from './HospitalPage.module.scss';
import { useParams } from 'react-router-dom';
import { createTimeSlot, destroyTimeSlot, fetchDoctorByService, generateTimeSlots, getTimeSlotsByFilter } from '../../../../api/httpApiClient';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { differenceInHours, format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export const ActionSlot = () => {
    const { _id } = useParams();
    const { hospitalId } = useParams();

    const [doctorId, setDoctorId] = useState(null);
    let currentDate = new Date();
    const [startTime, setStartTime] = useState(currentDate.setHours(10, 0, 0));
    const [endTime, setEndTime] = useState(currentDate.setHours(19, 0, 0));
    const [price, setPrice] = useState("");
    const [isOnline, setOnline] = useState(0);

    const [isDoctorsLoaded, setDoctorLoaded] = useState(false);
    const [serviceDoctorList, setServiceDoctorList] = useState([]);

    const [isDisabled, setDisabled] = useState(false);

    const [isSlotLoaded, setSlotLoaded] = useState(false);
    const [slotCollection, setSlotCollection] = useState([]);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [DeletedSuccesfully, setDeleted] = useState(false);

    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        fetchDoctorByService({
            service_id: _id,
            hospital_id: hospitalId,
        })
            .then((res) => {
                console.log(res.data);
                setDoctorLoaded(true);
                setServiceDoctorList(res.data.data);
            })
            .catch((err) => {
                console.error(err)
            })

        getTimeSlotsByFilter({
            service_id: _id,
            hospital_id: hospitalId,
            date: format(selectedDate, 'yyyy-MM-dd'),
        })
            .then((resp) => {
                setSlotCollection(resp.data.data);
                setSlotLoaded(true);
            })
            .catch((err) => {
                console.error(err);
            })
        if (DeletedSuccesfully) {
            getTimeSlotsByFilter({
                service_id: _id,
                date: format(selectedDate, 'yyyy-MM-dd'),
            })
                .then((resp) => {
                    setSlotCollection(resp.data.data);
                    setSlotLoaded(true);
                })
                .catch((err) => {
                    console.error(err);
                })
        }
    }, [_id, selectedDate, DeletedSuccesfully]);

    const handleDoctorChange = (e) => {
        const selectedDoctor = e.target.value;
        setDoctorId(selectedDoctor);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisabled(true);
        const params = {
            doctor_id: doctorId,
            service_id: _id,
            start_time: format(startTime, 'yyyy-MM-dd HH:mm'),
            end_time: format(endTime, 'yyyy-MM-dd HH:mm'),
            price: Number(price),
            isOnline: Number(isOnline)
        };

        let diffHour = differenceInHours(endTime, startTime);
        if (endTime < startTime) {
            alert("End time should be less than start time");
            setDisabled(false);
            return;
        }
        if (diffHour > 1) {
            //run generate process
            generateTimeSlots(params)
                .then((resp) => {
                    alert(resp.data.message);
                    setTimeout(() => setDisabled(false), 5000);
                    setDefaults();
                })
                .catch((err) => {
                    alert(err.response.message);
                    setDefaults();
                })
        } else {
            createTimeSlot(params)
                .then((resp) => {
                    alert(resp.data.message);
                    setDefaults();
                })
                .catch((err) => {
                    alert(err.response.message);
                    setDefaults();
                })
        }
    }

    const setDefaults = () => {
        setPrice("");
        setStartTime(null);
        setEndTime(null);
        setDoctorId(null);
        setOnline(0);
    }

    const handleToggle = () => {
        setOnline(!isOnline);
    }

    const deleteSlotById = async (slotId, e) => {
        e.preventDefault();
        console.log(slotId);
        setDeleted(true);
        destroyTimeSlot(slotId)
            .then((resp) => {
                alert(resp.data.message);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const { t } = useTranslation();

    return (
        <>
            <Header />
            <div className={`${ActionSlotStyles.root}`}>
                {/* <div className={ActionSlotStyles.actionRoot}> */}
                <h1 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>{t('addTimeSlot')}</h1>
                <form className={`d-flex gap-4 align-items-center`} onSubmit={handleSubmit}>
                    <div className="d-flex flex-column">
                        {isDoctorsLoaded && (
                            <>
                                <label style={{ marginBottom: '5px' }}>{t('doctors')}</label>
                                <select className={ActionSlotStyles['select-service']} value={doctorId || ""} onChange={handleDoctorChange} required>
                                    <option value="" disabled>{t('chdoc')}</option>
                                    {serviceDoctorList.map(doc => (
                                        <option key={doc.id} value={doc.id}>
                                            <div>
                                                {doc.id} {doc.name + " " + doc.surname} {doc.email}
                                            </div>
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>
                    <div className="d-flex flex-column">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label={t('chStartTime')}
                                value={startTime}
                                onChange={(newStartTime) => {
                                    if (newStartTime) {
                                        setStartTime(newStartTime)
                                    }
                                }}
                                minDate={new Date()}
                                format='dd.MM.yyyy HH:mm'
                                ampm={false}
                                renderInput={(params) => <TextField {...params} fullWidth margin='normal' />}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="d-flex flex-column">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label={t('chEndTime')}
                                value={endTime}
                                onChange={(newEndTime) => {
                                    if (newEndTime) {
                                        setEndTime(newEndTime)
                                    }
                                }}
                                minDate={new Date()}
                                format='dd.MM.yyyy HH:mm'
                                ampm={false}
                                renderInput={(params) => <TextField {...params} fullWidth margin='normal' />}
                            />
                        </LocalizationProvider>
                    </div>
                    <Form.Group className="d-flex flex-column">
                        <Form.Label>{t('isOnline')}</Form.Label>
                        <Form.Check
                            type="switch"
                            id="slot-toggle"
                            label={isOnline ? t('online') : t('offline')}
                            checked={isOnline}
                            onChange={handleToggle}
                        />
                    </Form.Group>
                    <div className="d-flex flex-column">
                        <label style={{ marginBottom: '5px' }}>{t('price')} ({t('uah')})</label>
                        <input
                            type="number"
                            onWheel={(e) => e.target.blur()}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <Button disabled={isDisabled} type='submit' className='btn btn-secondary'>
                        {isDisabled ? "Please wait..." : t('create')}
                    </Button>
                </form>
                <div className={ActionSlotStyles.slotList}>
                    <h2 style={{ marginBottom: '15px', marginTop: '50px', fontSize: '18px', fontWeight: 'bold' }}>{t('cfgTimeSlots')}</h2>
                    <div style={{ marginBottom: '25px' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={t('chdate')}
                                value={selectedDate}
                                onChange={(newDate) => {
                                    if (newDate) {
                                        setSlotLoaded(false);
                                        setSelectedDate(newDate)
                                    }
                                }}
                                // minDate={new Date()}
                                format='dd.MM.yyyy'
                                renderInput={(params) => <TextField {...params} fullWidth margin='normal' />}

                            />
                        </LocalizationProvider>
                    </div>
                    {isSlotLoaded ? (
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Id#</th>
                                    <th>{t('name')}</th>
                                    <th>{t('doctor')}</th>
                                    <th>{t('startTime')}</th>
                                    <th>{t('endTime')}</th>
                                    <th>{t('price')}</th>
                                    <th>{t('status')}</th>
                                    <th>{t('type')}</th>
                                    <th>{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slotCollection.length > 0 && slotCollection.map((slot) => (
                                    <>
                                        <tr>
                                            <td>{slot.id}</td>
                                            <td>{slot.service.name}</td>
                                            <td>{slot.doctor.name + " " + slot.doctor.surname} - {slot.doctor.email}</td>
                                            <td>{format(new Date(slot.start_time), 'dd.MM.yyyy HH:mm')}</td>
                                            <td>{format(new Date(slot.end_time), 'dd.MM.yyyy HH:mm')}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    onWheel={(e) => e.target.blur()}
                                                    value={slot.price}
                                                    // onChange={(e) => setPrice(e.target.value)}
                                                    // required
                                                    disabled
                                                />
                                            </td>
                                            <td>{slot.state === 2 ? t('sold') : slot.state === 1 ? t('free') : t('reserved')}</td>
                                            <td>{slot.isOnline !== 0 ? t('online') : t('offline')}</td>
                                            <td>
                                                {(slot.state === 1) && (
                                                    <div>
                                                        {/* <Button style={{ marginRight: '15px' }} className='btn btn-warning'><i className="fa-solid fa-pen-to-square"></i></Button> */}
                                                        <Button title={'delete slot'} className='btn btn-danger' onClick={(e) => deleteSlotById(slot.id, e)}><i className="fa-solid fa-delete-left"></i></Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>

                                    </>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className={"d-flex justify-content-center align-items-center"} style={{ marginTop: '15px' }}>
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
