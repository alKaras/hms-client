import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import SingleAppointStyles from './Appointment.module.scss';
import { useParams } from 'react-router-dom';
import { getSingleAppointment } from '../../../api/httpApiClient';

export const SingleAppointment = ({ isEdit, isConfirm }) => {
    const { _id } = useParams();
    const [isLoaded, setLoaded] = useState(false);
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        getSingleAppointment({
            appointmentId: _id
        })
            .then((resp) => {
                setLoaded(true);
                console.log(resp.data.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [])
    return (
        <>
            <Header />
            <div className={SingleAppointStyles.root}>
                1
            </div>
        </>
    )
}
