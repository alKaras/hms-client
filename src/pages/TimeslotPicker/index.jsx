import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import TimeSlotStyles from './TimeslotPicker.module.scss';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useParams } from 'react-router-dom';
import { getFreeDates, getTimeSlotsByFilter, setItemToCart } from '../../api/httpApiClient';
import { Button } from 'react-bootstrap';
import format from 'date-fns/format';
import { useTranslation } from 'react-i18next';

export const TimeSlotPicker = ({
    isDoctorPage,
    isServicePage
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isSlotLoaded, setisSlotLoaded] = useState(false);
    const [infoSlotCollection, setinfoSlotCollection] = useState([]);
    const [isStatsLoaded, setStatsLoaded] = useState(false);
    const [slotStats, setSlotStats] = useState([]);

    const { _id, hospitalId } = useParams();

    const pickTimeSlot = async (e, id) => {
        e.preventDefault();

        const params = { time_slot_id: id, hospital_id: hospitalId }

        setItemToCart(params)
            .then((resp) => {
                console.log(resp.data);
                alert("Послугу додано в кошик");
            })
            .catch((err) => {
                // console.error(err);
                alert(err.response.data.message);
            })
    }


    const { i18n } = useTranslation();
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        let params = {
            date: format(selectedDate, 'yyyy-MM-dd'),
            freeOnly: 1,
            hospital_id: hospitalId,
        }

        if (isDoctorPage) {
            params.doctor_id = _id;
            getFreeDates({
                doctor_id: _id
            })
                .then((resp) => {
                    setStatsLoaded(true);
                    let doctorData = resp.data.data;

                    let consultsFreeSlots = doctorData.filter((res) => res.serviceName.includes('Консультація'));
                    setSlotStats(consultsFreeSlots);

                })
                .catch((err) => {
                    console.error(err);
                })
        }
        if (isServicePage) {
            params.service_id = _id;

            getFreeDates({
                service_id: _id
            })
                .then((resp) => {
                    setStatsLoaded(true);
                    setSlotStats(resp.data.data);
                })
                .catch((err) => {
                    console.error(err);
                })
        }

        getTimeSlotsByFilter(params)
            .then((res) => {
                setisSlotLoaded(true);
                let resultData = res.data.data;
                if (isDoctorPage) {
                    let doctorsRes = resultData.filter((res) => res.service.name.includes('Консультація'))
                    // let doctorsRes = resultData.filter((res) => res.service.name.includes('Консультація'));
                    setinfoSlotCollection(doctorsRes);
                } else {
                    setinfoSlotCollection(resultData);
                }
            })
            .catch((err) => {
                setisSlotLoaded(false);
                console.error(err);
            })
    }, [selectedDate])

    console.log(infoSlotCollection);
    const { t } = useTranslation();

    return (
        <>
            <Header />
            <div className={TimeSlotStyles.root}>

                <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '25px' }} >{t('timeslots')} {isDoctorPage ? t('forConsult') : ''}</h2>

                <div className='d-flex justify-between align-items-center'>
                    <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '25px' }}>{t('availableSlots')}: </h3>

                    <ul className='d-flex justify-between align-items-center'>
                        {isSlotLoaded && slotStats.length > 0 ? slotStats.map((slot) => (
                            <>
                                <li style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', marginLeft: '10px' }}>
                                    <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>{[slot.serviceId]} {slot.serviceName}</p>
                                    <p style={{ marginBottom: '5px' }}>{t('date')}: {format(new Date(slot.date), 'dd.MM.yyyy')}</p>
                                    <p style={{ margin: 0 }}>{t('numofavailable')} {slot.free_slots}</p>
                                </li >
                            </>

                        ))
                            : (
                                <>
                                    {t('emptyAvailableSlots')}
                                </>
                            )}
                    </ul>
                </div>


                <div style={{ marginBottom: '25px' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label={t('chdate')}
                            value={selectedDate}
                            onChange={(newDate) => {
                                if (newDate) {
                                    setSelectedDate(newDate)
                                }
                            }}
                            // minDate={new Date()}
                            format='dd.MM.yyyy'
                            renderInput={(params) => <TextField {...params} fullWidth margin='normal' />}

                        />
                    </LocalizationProvider>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '25px' }} >{t('selectTimeslot')}</h2>

                    <ul className={TimeSlotStyles.slotmenu}>
                        {isSlotLoaded &&
                            infoSlotCollection.length > 0 ?
                            infoSlotCollection.map((slot) => (
                                <>
                                    <li>
                                        <Button onClick={(e) => pickTimeSlot(e, slot.id)} className={`${TimeSlotStyles.slotBtn} ${slot.isOnline ? TimeSlotStyles.onlineBtn : ''}`}>
                                            <div className={TimeSlotStyles.slotContent}>
                                                {slot.service.name}
                                                {slot.isOnline ? ' (Online)' : (<></>)}
                                            </div>
                                            <div className={TimeSlotStyles.slotTime}>
                                                {format(new Date(slot.start_time), 'HH:mm')} <span> - </span>
                                                {format(new Date(slot.end_time), 'HH:mm')}
                                            </div>

                                            <div className={TimeSlotStyles.slotPrice}>{slot.price} {t('uah')}</div>
                                        </Button >
                                    </li>
                                </>
                            )) : (
                                <>
                                    {t('emptyTimeslots')}
                                </>
                            )}
                    </ul>
                </div >


            </div >



        </>
    )
}
