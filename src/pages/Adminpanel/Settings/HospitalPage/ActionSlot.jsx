import React, { useEffect, useState } from 'react'
import Header from '../../../../components/Header'
import ActionSlotStyles from './HospitalPage.module.scss';
import { useParams } from 'react-router-dom';
import { createTimeSlot, fetchDoctorByService, generateTimeSlots, getTimeSlotsByFilter } from '../../../../api/httpApiClient';
import { DateTimePicker, LocalizationProvider, PickersActionBar, TimeClock } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { Button, Table } from 'react-bootstrap';
import { differenceInHours, format } from 'date-fns';

export const ActionSlot = () => {
    const { _id } = useParams();

    const [doctorId, setDoctorId] = useState(null);
    let currentDate = new Date();
    const [startTime, setStartTime] = useState(currentDate.setHours(10, 0, 0));
    const [endTime, setEndTime] = useState(currentDate.setHours(19, 0, 0));
    const [price, setPrice] = useState("");

    const [isDoctorsLoaded, setDoctorLoaded] = useState(false);
    const [serviceDoctorList, setServiceDoctorList] = useState([]);

    const [isDisabled, setDisabled] = useState(false);

    useEffect(() => {
        fetchDoctorByService({
            service_id: _id
        })
            .then((res) => {
                console.log(res.data);
                setDoctorLoaded(true);
                setServiceDoctorList(res.data.data);
            })
            .catch((err) => {
                console.error(err)
            })

    }, [_id]);

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
            price: Number(price)
        };

        let diffHour = differenceInHours(endTime, startTime);
        if (diffHour > 2) {
            //run generate process
            generateTimeSlots(params)
                .then((resp) => {
                    alert(resp.data.message);
                    setTimeout(() => setDisabled(false), 5000);
                    setDefaults();
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        } else {
            createTimeSlot(params)
                .then((resp) => {
                    alert(resp.data.message);
                    setDefaults();
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        }
    }

    const setDefaults = () => {
        setPrice("");
        setStartTime(null);
        setEndTime(null);
        setDoctorId(null);
    }

    return (
        <>
            <Header />
            <div className={`${ActionSlotStyles.root}`}>
                {/* <div className={ActionSlotStyles.actionRoot}> */}
                <h1 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>Створити талони</h1>
                <form className={`d-flex gap-4 align-items-center`} onSubmit={handleSubmit}>
                    <div className="d-flex flex-column">
                        <>
                            {isDoctorsLoaded && (
                                <>
                                    <label style={{ marginBottom: '5px' }}>Лікарі</label>
                                    <select className={ActionSlotStyles['select-service']} value={doctorId || ""} onChange={handleDoctorChange} required>
                                        <option value="" disabled>Оберіть лікаря</option>
                                        {serviceDoctorList.map(doc => (
                                            <option key={doc.id} value={doc.id}>
                                                <div>
                                                    {doc.id} {doc.name + " " + doc.surname} {doc.email}
                                                </div
                                                >
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </>
                    </div>
                    <div className="d-flex flex-column">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label="Select start slottime"
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
                                label="Select end slottime"
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
                    <div className="d-flex flex-column">
                        <label style={{ marginBottom: '5px' }}>Ціна (UAH)</label>
                        <input
                            type="number"
                            onWheel={(e) => e.target.blur()}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <Button disabled={isDisabled} type='submit' className='btn btn-secondary'>
                        {isDisabled ? "Please wait..." : "Створити"}
                    </Button>
                </form>
            </div>
        </>
    )
}
