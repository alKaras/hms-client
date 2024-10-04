import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import TimeSlotStyles from './TimeslotPicker.module.scss';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useParams } from 'react-router-dom';
import { getTimeSlotsByFilter } from '../../api/httpApiClient';
import { Button } from 'react-bootstrap';
import format from 'date-fns/format';
import Moment from 'react-moment';

export const TimeSlotPicker = ({
    isDoctorPage,
    isServicePage
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isSlotLoaded, setisSlotLoaded] = useState(false);
    const [infoSlotCollection, setinfoSlotCollection] = useState([]);

    const { _id } = useParams();



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

    return (
        <>
            <Header />
            <div className={TimeSlotStyles.root}>

                <h2 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '25px' }} >Select timeslot</h2>

                <div style={{ marginBottom: '25px' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Select Date"
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
                    <h2 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '25px' }} >Choose timeslot</h2>

                    <ul className={TimeSlotStyles.slotmenu}>
                        {isSlotLoaded &&
                            infoSlotCollection.length > 0 ?
                            infoSlotCollection.map((slot) => (
                                <>
                                    <li>
                                        <Button className={TimeSlotStyles.slotBtn}>
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

                                            <div className={TimeSlotStyles.slotPrice}>{slot.price} UAH</div>
                                        </Button >
                                    </li>
                                </>
                            )) : (
                                <>
                                    Відсутні талони на цей час
                                </>
                            )}
                    </ul>
                </div >


            </div >



        </>
    )
}
