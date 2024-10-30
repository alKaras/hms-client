import React, { useState } from 'react';
import DoctorCardStyles from './DoctorCard.module.scss';
import { LinkContainer } from "react-router-bootstrap";
import { Button, Modal, ProgressBar } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../redux/slices/authSlice';

export default function DoctorCard({
    title,
    email,
    specialization,
    active,
    hospital_id,
    doctor_id,
}) {

    const [step, setStep] = useState(1);
    const [slots, setSlots] = useState([]);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);

    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);

    return (
        <>
            <div className={DoctorCardStyles.root}>
                <div className={DoctorCardStyles.image}>
                    <img src='/assets/profile.jpg' style={{ objectFit: 'cover', maxWidth: '100%', maxHeight: '100%' }} alt='profile logo' />
                </div>
                <div className={DoctorCardStyles.content}>
                    <div className={DoctorCardStyles.headContent}>
                        <div className={DoctorCardStyles.heading}>
                            {title}
                        </div>
                    </div>

                    <div className={DoctorCardStyles.shortDesc}>
                        {email}
                    </div>
                    <div className={DoctorCardStyles.contentFooter}>
                        <div className={DoctorCardStyles.chips}>
                            {specialization}
                        </div>
                    </div>
                </div>
                <div className={DoctorCardStyles.additional}>
                    <div className={DoctorCardStyles.status}>
                        {active ? (
                            <span style={{ color: 'green' }}><i className="fa-solid fa-circle"></i></span>
                        ) : (
                            <span style={{ color: 'red' }}><i className="fa-solid fa-circle"></i></span>
                        )}
                    </div>
                    {isLogged && user.data.email_verified_at && (<LinkContainer to={`/hospital/doctor/${doctor_id}/timeslots`}>
                        <Button className={DoctorCardStyles.btnWidget}>Записатися</Button>
                    </LinkContainer>)}
                </div>

            </div>
        </>
    );
}
