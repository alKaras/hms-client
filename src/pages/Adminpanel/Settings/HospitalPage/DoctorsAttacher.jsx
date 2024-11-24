import React, { useEffect, useState, useTransition } from 'react'
import Header from '../../../../components/Header'
import DoctorAttacherStyles from './HospitalPage.module.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { attachDoctors, fetchDoctorByService } from '../../../../api/httpApiClient';
import { Alert, Snackbar } from '@mui/material';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


export const DoctorsAttacher = () => {
    const [doctors, setDoctors] = useState([]);
    const [doctorsLoaded, setLoaded] = useState(false);
    const [selectedDoctors, setSelectedDoctors] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const hospitalId = queryParams.get('hospital');

    const { _id } = useParams();
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [success, setSuccess] = useState(null);

    const { t } = useTranslation();
    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        fetchDoctorByService({
            hospital_id: hospitalId,
            service_id: Number(_id),
            checkByServiceDepartment: 1,
        })
            .then((resp) => {
                setDoctors(resp.data.data);
                setLoaded(true);
            })
            .catch((err) => {
                setError(err.response.data.message || 'Something went wrong');
            })
    }, [])

    const handleDoctorsChange = (e) => {
        const doctorId = Number(e.target.value);

        setSelectedDoctors((prev) =>
            prev.includes(doctorId) ? prev.filter(docId => docId !== doctorId) : [...prev, doctorId]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedDoctors.length === 0) {
            setInfo('Please select at least one doctor to attach.');
            return;
        }

        attachDoctors({
            service_id: _id,
            doctors: selectedDoctors
        })
            .then((resp) => {
                setSuccess(resp.data.message);
                setTimeout(() => {
                    navigate(`/adminpanel/settings/${hospitalId}/hospital`);
                }, 2000);


            })
            .catch((err) => {
                setError(err.response.message || 'Something went wrong');
            })


    }

    const handleClose = () => {
        setError(null);
        setInfo(null);
        setSuccess(null);
    }

    console.log(selectedDoctors);
    console.log(doctors);





    return (
        <>
            <Header />
            <div className={`${DoctorAttacherStyles.actionRoot}`} style={{ margin: '100px auto', maxWidth: '1280px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '50px' }}>
                    {t('doctorAttacher')}
                </h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="d-flex flex-column">
                        <Row>
                            {doctorsLoaded && doctors.length > 0 ? doctors.map((doctor) => (
                                <Col lg={5} key={doctor.doctorId}>
                                    <Form.Check
                                        type="checkbox"
                                        label={doctor.name + ' ' + doctor.surname + ' | ' + doctor.email}
                                        value={doctor.doctorId}
                                        disabled={doctor.linkedToCurrentService}
                                        checked={doctor.linkedToCurrentService}
                                        onChange={handleDoctorsChange}
                                    />
                                </Col>
                            )) : (
                                <>
                                    <p>{t('emptyDoctors')}</p>
                                </>
                            )}
                        </Row>
                    </Form.Group>
                    <Button disabled={!doctorsLoaded || doctors.length <= 0} type="submit" className="btn btn-secondary">
                        {t('attach')}
                    </Button>
                </Form>
            </div>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={!!info} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity='info' sx={{ width: '100%' }}>
                    {info}
                </Alert>
            </Snackbar>

            <Snackbar open={!!success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </>
    )
}
