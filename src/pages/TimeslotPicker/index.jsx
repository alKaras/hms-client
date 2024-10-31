import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import TimeSlotStyles from './TimeslotPicker.module.scss';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useParams } from 'react-router-dom';
import { getTimeSlotsByFilter, setItemToCart } from '../../api/httpApiClient';
import { Button } from 'react-bootstrap';
import format from 'date-fns/format';
import Moment from 'react-moment';
import { useTranslation } from 'react-i18next';

export const TimeSlotPicker = ({
    isDoctorPage,
    isServicePage
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isSlotLoaded, setisSlotLoaded] = useState(false);
    const [infoSlotCollection, setinfoSlotCollection] = useState([]);

    const { _id } = useParams();

    const pickTimeSlot = async (e, id) => {
        e.preventDefault();

        const params = { time_slot_id: id }

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



    useEffect(() => {
        let params = {
            date: format(selectedDate, 'yyyy-MM-dd'),
        }

        if (isDoctorPage) {
            params.doctor_id = _id;
        }
        if (isServicePage) {
            params.service_id = _id;
        }


        getTimeSlotsByFilter(params)
            .then((res) => {
                setisSlotLoaded(true);
                let resultData = res.data.data;
                if (isDoctorPage) {
                    let doctorsRes = resultData.filter((res) => res.service.name === 'consulting')
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

                <h2 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '25px' }} >{t('timeslots')}</h2>

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
                                        <Button onClick={(e) => pickTimeSlot(e, slot.id)} className={TimeSlotStyles.slotBtn}>
                                            <div className={TimeSlotStyles.slotContent}>
                                                {slot.service.name}
                                            </div>
                                            <div className={TimeSlotStyles.slotTime}>
                                                <Moment format='HH:mm'>
                                                    {slot.start_time}
                                                </Moment> <span> - </span>
                                                <Moment format='HH:mm'>
                                                    {slot.end_time}
                                                </Moment>
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
