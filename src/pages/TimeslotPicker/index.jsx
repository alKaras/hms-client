import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import TimeSlotStyles from './TimeslotPicker.module.scss';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

export const TimeSlotPicker = ({
    isDoctorPage,
    isServicePage
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filteredSlots, setFilteredSlots] = useState([]);
    const [slotCollection, setSlotCollection] = useState([]);



    useEffect(() => {

    })

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    }
    return (
        <>
            <Header />
            <div className={TimeSlotStyles.root}>
                <h1 style={{ fontWeight: 'bold', fontSize: '18px' }} >Select timeslot</h1>

                <DatePicker
                    showIcon
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    isClearable
                    dateFormat={'YYYY-MM-dd'}
                />
            </div>



        </>
    )
}
