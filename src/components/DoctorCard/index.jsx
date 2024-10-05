import React, { useState } from 'react';
import DoctorCardStyles from './DoctorCard.module.scss';
import { LinkContainer } from "react-router-bootstrap";
import { Button, Modal, ProgressBar } from "react-bootstrap";

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
                        <div className={DoctorCardStyles.status}>
                            {active ? (
                                <> Active</>
                            ) : (
                                <>
                                    Non active
                                </>
                            )}
                        </div>
                    </div>

                    <div className={DoctorCardStyles.shortDesc}>
                        {email}
                    </div>
                    <div className={DoctorCardStyles.contentFooter}>
                        <div className={DoctorCardStyles.chips}>
                            {specialization}
                        </div>
                        <LinkContainer to={`/hospital/doctor/${doctor_id}/timeslots`}>
                            <Button className={DoctorCardStyles.btnWidget}>Записатися до
                                лікаря</Button>
                        </LinkContainer>
                    </div>
                </div>
            </div>
        </>
    );
}
