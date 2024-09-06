import React, {useState} from 'react';
import DoctorCardStyles from './DoctorCard.module.scss';
import {LinkContainer} from "react-router-bootstrap";
import {Button, Modal, ProgressBar} from "react-bootstrap";
import DatePicker from "react-date-picker";

export default function DoctorCard({
                                       title,
                                       description,
                                       specialization,
                                       active,
                                   }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [step, setStep] = useState(1);
    const [slots, setSlots] = useState([]);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <>
            <div className={DoctorCardStyles.root}>
                <div className={DoctorCardStyles.image}>
                    {/*<img src="" alt="doctor image"/>*/}
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
                        {description}
                    </div>
                    <div className={DoctorCardStyles.contentFooter}>
                        <div className={DoctorCardStyles.chips}>
                            {specialization}
                        </div>
                        {/*<LinkContainer>*/}
                        <Button className={DoctorCardStyles.btnWidget} onClick={handleShow}>Записатися до
                            лікаря</Button>
                        {/*</LinkContainer>*/}
                    </div>
                </div>
            </div>
        </>
    );
}
