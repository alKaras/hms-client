import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import SingleAppointStyles from './Appointment.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { confirmAppointment, getSingleAppointment } from '../../../api/httpApiClient';
import { Badge, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../redux/slices/authSlice';

export const SingleAppointment = ({ forUser }) => {
    const { _id } = useParams();
    const [isLoaded, setLoaded] = useState(false);
    const [appointment, setAppointment] = useState(null);

    const [isConfirm, setIsConfirm] = useState(true);
    const [confirmed, setConfirmed] = useState(false);

    const [formData, setFormData] = useState({
        summary: '',
        notes: '',
        recommendations: ''
    });

    const getSingleRecord = async (id) => {
        getSingleAppointment({
            appointmentId: id
        })
            .then((resp) => {
                setLoaded(true);
                console.log(resp.data.data);
                setAppointment(resp.data.data);
                setFormData({
                    summary: resp.data.data.summary ?? '',
                    notes: resp.data.data.notes ?? '',
                    recommendations: resp.data.data.recommendations ?? ''
                })
                if (resp.data.data.status === 'scheduled') {
                    setIsConfirm(true);
                } else {
                    setIsConfirm(false);
                }
            })
            .catch((err) => {
                console.error(err);
            })
    }


    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        if (confirmed) {
            getSingleRecord(_id);
        }
        getSingleRecord(_id);
    }, [confirmed])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        confirmAppointment({
            appointment: _id,
            ...formData
        })
            .then((resp) => {
                alert('Appointment confirmed');
                setFormData({
                    recommendations: resp.data.data.recommendations || '',
                    notes: resp.data.data.notes || '',
                    summary: resp.data.data.summary || ''
                })
                setConfirmed(true);
                window.location.reload();

            })
            .catch((err) => {
                // alert(err.response?.data?.error || "An error occurred")
                console.log(err);
            })

    }

    const { t } = useTranslation();

    return (
        <>
            <Header />
            <div className={SingleAppointStyles.root}>

                {isLoaded && (
                    <>
                        <div className={SingleAppointStyles.contentSingle}>
                            <h1 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '25px' }}>
                                {t('medAppointment')} [{appointment.id}] <Badge bg={appointment.status === 'scheduled' ? 'info' : appointment.status === 'canceled' ? 'danger' : 'success'}>
                                    <span style={{ textTransform: 'uppercase' }}>{appointment.status === 'scheduled' ? t('scheduled') : appointment.status === 'completed' ? t('completed') : t('canceledAppointment')}</span>
                                </Badge>
                            </h1>

                            <div>
                                <div>
                                    <p>
                                        <strong>{t('service')}: </strong> [{appointment.service.id}] {appointment.service.name} {appointment.service.isOnline ? '(Online)' : ''}
                                    </p>
                                    <p>
                                        <strong>{t('startTime')}: </strong> {appointment.service.start_time}
                                    </p>
                                    <p>
                                        <strong>{t('hospital')}: </strong> {appointment.hospital.title} ({appointment.hospital.address}) | {appointment.hospital.email}
                                    </p>
                                    <p>
                                        <strong>{t('doctor')}: </strong> {appointment.doctor.name} {appointment.doctor.surname}
                                    </p>

                                    <p>
                                        <strong>{t('email')}: </strong> {appointment.doctor.email}
                                    </p>

                                    <p>
                                        <strong>{t('patient')}: </strong> {appointment.patient.name} {appointment.patient.surname}
                                    </p>
                                    <p>
                                        <strong>{t('email')}: </strong> {appointment.patient.email}
                                    </p>
                                    {appointment.service.isOnline ? (
                                        <>
                                            <p>
                                                <strong>{t('Link')}</strong> {appointment.meetLink}
                                            </p>
                                        </>) : (<></>)}

                                </div>
                                {(forUser && isConfirm) ? (
                                    <>
                                    </>
                                ) : (
                                    <>
                                        <Form onSubmit={handleSubmit} style={{ marginTop: '50px' }}>
                                            <Form.Group style={{ marginBottom: '25px' }} className="d-flex flex-column">
                                                <Form.Label style={{ fontWeight: 'bold' }}>{t('summary')}</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    style={{ border: '1px solid dodgerblue', resize: 'none' }}
                                                    rows={3}
                                                    disabled={!isConfirm}
                                                    value={formData.summary}
                                                    placeholder={t('summary')}
                                                    name="summary"
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </Form.Group>
                                            <Form.Group style={{ marginBottom: '25px' }} className="d-flex flex-column">
                                                <Form.Label style={{ fontWeight: 'bold' }}>{t('notes')}</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    disabled={!isConfirm}
                                                    style={{ border: '1px solid dodgerblue', resize: 'none' }}
                                                    value={formData.notes}
                                                    placeholder={t('notes')}
                                                    name="notes"
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </Form.Group>
                                            <Form.Group style={{ marginBottom: '25px' }} className="d-flex flex-column">
                                                <Form.Label style={{ fontWeight: 'bold' }}>{t('recommendations')}</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    disabled={!isConfirm}
                                                    style={{ border: '1px solid dodgerblue', resize: 'none' }}
                                                    value={formData.recommendations}
                                                    placeholder={t('recommendations')}
                                                    name="recommendations"
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </Form.Group>

                                            <Button type="submit" disabled={!isConfirm} className='btn btn-success'>{t('confirmAct')}</Button>
                                        </Form>
                                    </>
                                )}


                            </div>
                        </div>
                    </>

                )}



            </div >
        </>
    )
}
