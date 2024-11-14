import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import AppointmentStyles from './Appointment.module.scss';
import { Badge, Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cancelAppointment, destroyAppointment, downloadAppointmentSummary, getAppointmentByDoctor, sendAppointmentSummary } from '../../../api/httpApiClient';
import { format } from 'date-fns';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../redux/slices/authSlice';

export const AppointmentList = () => {
    const [isLoaded, setLoaded] = useState(false);
    const { _id } = useParams();
    const { t } = useTranslation();

    const user = useSelector(infoAboutUser);
    const isLogged = useSelector(selectIsLogged);
    const isDoctor = isLogged && user.roles === 'doctor';
    const isManager = isLogged && user.roles === 'manager';

    const [appointmentList, setAppointmentList] = useState([]);

    useEffect(() => {
        getAppointmentByDoctor({
            doctor_id: _id
        })
            .then((resp) => {
                setLoaded(true);
                setAppointmentList(resp.data.data);
            })
            .catch((err) => {
                console.error(err);
                alert(err.response.message || "Something went wrong");
            })
    }, [])

    const sendSummary = (e, id) => {
        e.preventDefault();
        sendAppointmentSummary({
            appointmentId: id
        })
            .then((resp) => {
                alert(resp.data.message);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const downloadPdf = async (e, id) => {
        e.preventDefault();

        downloadAppointmentSummary(id)
            .then((resp) => {
                const file = new Blob([resp.data], {
                    type: 'application/pdf',
                });

                const link = document.createElement('a');

                link.href = window.URL.createObjectURL(file);

                link.download = `appointment-${id}-summary.pdf`;

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
            })
            .catch((err) => console.error(err.response));
    }

    const setCancelStatus = async (e, id) => {
        e.preventDefault();

        cancelAppointment({
            appointmentId: id
        })
            .then((resp) => {
                alert(resp.data.message);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const deleteAppointment = async (e, id) => {
        e.preventDefault();

        destroyAppointment
            .then((resp) => {
                alert(resp.data.message);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    return (
        <>
            <Header />
            <div className={AppointmentStyles.root}>
                <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '25px' }}>Ваші зустрічі</h1>

                {isLoaded && appointmentList.length > 0 ? (
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Doctor</th>
                                <th>Service</th>
                                <th>Patient</th>
                                <th>Start Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointmentList.map((item) => (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>
                                        {item.doctor.name} {item.doctor.surname} ({item.doctor.email})
                                    </td>
                                    <td>
                                        [{item.service.id}] {item.service.name}
                                    </td>
                                    <td>
                                        {item.patient.name} {item.patient.surname} ({item.patient.email} | {item.patient.phone})
                                    </td>
                                    <td>
                                        {format(new Date(item.service.start_time), 'dd.MM.yyyy HH:mm')}
                                    </td>

                                    <td>
                                        <Badge bg={item.status === 'scheduled' ? 'info' : item.status === 'canceled' ? 'danger' : 'success'}>
                                            <span style={{ textTransform: 'uppercase' }}>{item.status}</span>
                                        </Badge>
                                    </td>
                                    <td className='d-flex'>
                                        {isManager && (
                                            <>
                                                <LinkContainer style={{ color: 'black' }} to={`/adminpanel/appointment/${item.id}/edit`}>
                                                    <Button className='btn btn-warning'><i className="fa-solid fa-pen"></i></Button>
                                                </LinkContainer>
                                                <Button onClick={(e) => deleteAppointment(e, item.id)} style={{ color: 'black', marginLeft: '10px' }} className='btn btn-danger'><i className="fa-solid fa-trash"></i></Button>
                                            </>
                                        )}
                                        <LinkContainer style={{ color: 'black', marginLeft: '10px' }} to={`/adminpanel/appointmentlist/${item.id}/appointment`}>
                                            <Button className='btn btn-info'><i className="fa-solid fa-up-right-from-square"></i></Button>
                                        </LinkContainer>
                                        <Button
                                            title={'Send email summary to user'}
                                            style={{ color: 'white', marginLeft: '10px' }}
                                            className='btn btn-primary'
                                            onClick={(e) => sendSummary(e, item.id)}
                                        >
                                            <i className="fa-solid fa-paper-plane"></i>
                                        </Button>

                                        <Button style={{ color: 'white', marginLeft: '10px' }}
                                            title={'download'}
                                            className='btn btn-secondary'
                                            onClick={(e) => downloadPdf(e, item.id)}
                                        >
                                            <i className="fa-solid fa-file-pdf"></i>
                                        </Button>

                                        {item.status !== 'completed' && (
                                            <>
                                                <Button
                                                    title="Cancel"
                                                    style={{ color: 'white', marginLeft: '10px' }}
                                                    className='btn btn-danger'
                                                    onClick={(e) => setCancelStatus(e, item.id)}
                                                >
                                                    <i className="fa-solid fa-ban"></i>
                                                </Button>
                                            </>
                                        )}


                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    'У вас немає запланованих зустрічей'
                )}

            </div>
        </>
    )
}
