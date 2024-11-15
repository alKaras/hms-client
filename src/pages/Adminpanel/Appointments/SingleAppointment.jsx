import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import SingleAppointStyles from './Appointment.module.scss';
import { useParams } from 'react-router-dom';
import { confirmAppointment, getSingleAppointment } from '../../../api/httpApiClient';
import { Badge, Button, Form } from 'react-bootstrap';

export const SingleAppointment = () => {
    const { _id } = useParams();
    const [isLoaded, setLoaded] = useState(false);
    const [appointment, setAppointment] = useState(null);

    const [isConfirm, setIsConfirm] = useState(true);
    const { confirmed, setConfirmed } = useState(false);

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



    useEffect(() => {
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

        try {
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

                })
                .catch((err) => {
                    console.error(err);
                })
        } catch (error) {
            alert(error.response?.data?.error || "An error occurred");
        } finally {
            // setLoading(false);
        }

    }
    return (
        <>
            <Header />
            <div className={SingleAppointStyles.root}>

                {isLoaded && (
                    <>
                        <div className={SingleAppointStyles.contentSingle}>
                            <h1 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '25px' }}>
                                Medical Appointment [{appointment.id}] <Badge bg={appointment.status === 'scheduled' ? 'info' : appointment.status === 'canceled' ? 'danger' : 'success'}>
                                    <span style={{ textTransform: 'uppercase' }}>{appointment.status}</span>
                                </Badge>
                            </h1>

                            <div>
                                <div>
                                    <p>
                                        <strong>Послуга: </strong> [{appointment.service.id}] {appointment.service.name}
                                    </p>
                                    <p>
                                        <strong>Час зустрічі: </strong> {appointment.service.start_time}
                                    </p>
                                    <p>
                                        <strong>Лікарня: </strong> {appointment.hospital.title} ({appointment.hospital.address}) | {appointment.hospital.email}
                                    </p>
                                    <p>
                                        <strong>Лікар: </strong> {appointment.doctor.name} {appointment.doctor.surname}
                                    </p>

                                    <p>
                                        <strong>Пошта лікаря: </strong> {appointment.doctor.email}
                                    </p>

                                    <p>
                                        <strong>Пацієнт: </strong> {appointment.patient.name} {appointment.patient.surname}
                                    </p>
                                    <p>
                                        <strong>Пошта пацієнта: </strong> {appointment.patient.email}
                                    </p>
                                </div>

                                <Form onSubmit={handleSubmit} style={{ marginTop: '50px' }}>
                                    <Form.Group style={{ marginBottom: '25px' }} className="d-flex flex-column">
                                        <Form.Label style={{ fontWeight: 'bold' }}>Summary</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            style={{ border: '1px solid dodgerblue', resize: 'none' }}
                                            rows={3}
                                            disabled={!isConfirm}
                                            value={formData.summary}
                                            placeholder={'Summary'}
                                            name="summary"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group style={{ marginBottom: '25px' }} className="d-flex flex-column">
                                        <Form.Label style={{ fontWeight: 'bold' }}>Notes</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            disabled={!isConfirm}
                                            style={{ border: '1px solid dodgerblue', resize: 'none' }}
                                            value={formData.notes}
                                            placeholder={'Notes'}
                                            name="notes"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group style={{ marginBottom: '25px' }} className="d-flex flex-column">
                                        <Form.Label style={{ fontWeight: 'bold' }}>Recommendations</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            disabled={!isConfirm}
                                            style={{ border: '1px solid dodgerblue', resize: 'none' }}
                                            value={formData.recommendations}
                                            placeholder={'Recommendations'}
                                            name="recommendations"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </Form.Group>

                                    <Button type="submit" disabled={!isConfirm} className='btn btn-success'>Confirm</Button>
                                </Form>
                            </div>
                        </div>
                    </>

                )}



            </div >
        </>
    )
}
