import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import AppointmentStyles from './Appointment.module.scss';
import { Badge, Button, Spinner, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cancelAppointment, destroyAppointment, downloadAppointmentSummary, getAppointmentByDoctor, getAppointmentByUser, sendAppointmentSummary } from '../../../api/httpApiClient';
import { format } from 'date-fns';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../redux/slices/authSlice';
import { Snackbar, Alert } from '@mui/material';

export const AppointmentList = ({ forUser }) => {
    const [isLoaded, setLoaded] = useState(false);
    const { _id } = useParams();
    const { userId } = useParams();
    const { t } = useTranslation();

    const user = useSelector(infoAboutUser);
    const isLogged = useSelector(selectIsLogged);
    const isDoctor = isLogged && user.roles === 'doctor';
    const isManager = isLogged && user.roles === 'manager';
    const [isChanged, setIsChanged] = useState(false);

    const [appointmentList, setAppointmentList] = useState([]);

    const getAppointmentList = async (id) => {

        if (forUser) {
            getAppointmentByUser({
                user_id: id
            })
                .then((resp) => {
                    setLoaded(true);
                    setAppointmentList(resp.data.data);
                })
                .catch((err) => {
                    console.error(err);
                    alert(err.response.message || "Something went wrong");
                })
        } else {
            getAppointmentByDoctor({
                doctor_id: id
            })
                .then((resp) => {
                    setLoaded(true);
                    setAppointmentList(resp.data.data);
                })
                .catch((err) => {
                    console.error(err);
                    alert(err.response.message || "Something went wrong");
                })
        }

    }

    const { i18n } = useTranslation();
    const navigate = useNavigate();


    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        if (isLogged) {
            if ((user.roles === 'user' && Number(user.id) !== Number(userId))) {
                navigate('/404');
            }
            getAppointmentList(userId);

        }
        if (isChanged) {
            getAppointmentList(_id);
        }

    }, [isLogged])

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
                setIsChanged(true);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const deleteAppointment = async (e, id) => {
        e.preventDefault();

        destroyAppointment({
            appointmentId: id,
        })
            .then((resp) => {
                alert(resp.data.message);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const [copyStatus, setCopyStatus] = useState("");

    const copyLinkToClipBoard = async (e, link) => {
        e.preventDefault();

        try {
            await navigator.clipboard.writeText(link);
            setCopyStatus('Link copied to clipboard');
        } catch (err) {
            setCopyStatus('Failed to copy the link.');
        }
    }

    const handleClose = () => {
        setCopyStatus(null);
    }

    return (
        <>
            <Header />
            <div className={AppointmentStyles.root}>
                <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '25px' }}>{t('urAppointments')}</h1>

                {!isLoaded ? (
                    <div className={"d-flex justify-content-center align-items-center"}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : isLoaded && appointmentList.length > 0 ? (
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('doctor')}</th>
                                <th>{t('service')}</th>
                                <th>{t('patient')}</th>
                                <th>{t('startTime')}</th>
                                <th>{t('status')}</th>
                                <th>{t('actions')}</th>
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
                                            <span style={{ textTransform: 'uppercase' }}>
                                                <span style={{ textTransform: 'uppercase' }}>{item.status === 'scheduled' ? t('scheduled') : item.status === 'completed' ? t('completed') : t('canceledAppointment')}</span>
                                            </span>
                                        </Badge>
                                    </td>
                                    <td className='d-flex'>
                                        {isManager && !forUser && (
                                            <>
                                                <LinkContainer style={{ color: 'black' }} to={`/adminpanel/appointment/${item.id}/edit`}>
                                                    <Button className='btn btn-warning'><i className="fa-solid fa-pen"></i></Button>
                                                </LinkContainer>
                                                <Button onClick={(e) => deleteAppointment(e, item.id)} style={{ color: 'black', marginLeft: '10px' }} className='btn btn-danger'><i className="fa-solid fa-trash"></i></Button>
                                            </>
                                        )}
                                        <LinkContainer
                                            style={{ color: 'black', marginLeft: '10px' }}
                                            to={`${forUser ? '/user' : '/adminpanel'}/appointments/${item.id}/appointment`}
                                        >
                                            <Button className='btn btn-info'><i className="fa-solid fa-up-right-from-square"></i></Button>
                                        </LinkContainer>

                                        {(item.status === 'scheduled' && item.service.isOnline) ? (
                                            <Button
                                                style={{ marginLeft: '10px' }}
                                                className='btn btn-secondary'
                                                onClick={(e) => copyLinkToClipBoard(e, item.meetLink)}
                                            >
                                                <i class="fa-regular fa-copy"></i>
                                            </Button>
                                        ) : (
                                            <>
                                            </>
                                        )}


                                        {item.status === "completed" && !forUser && (
                                            <>
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
                                            </>
                                        )}


                                        {item.status !== 'completed' && !forUser && (
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

                                        {(isManager || !forUser) && (
                                            <>
                                                <LinkContainer style={{ color: 'white', marginLeft: '10px' }} to={`/adminpanel/user/${item.patient.id}/referral`}>
                                                    <Button title={'create referral'} className='btn btn-primary'><i class="fa-solid fa-file-contract"></i></Button>
                                                </LinkContainer>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    t('emptyAppointments')
                )}

                <Snackbar open={!!copyStatus} autoHideDuration={6000} onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >

                    <Alert onClose={handleClose} severity={'info'} sx={{ width: '100%' }}>
                        {copyStatus}
                    </Alert>
                </Snackbar>

            </div >

        </>
    )
}
