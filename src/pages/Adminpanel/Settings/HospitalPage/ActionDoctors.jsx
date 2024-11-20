import React, { useEffect, useState } from 'react'
import Header from '../../../../components/Header'
import ActionHospitalStyles from './HospitalPage.module.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createDoctor, editDoctor, fetchHospitalDepartments, fetchSingleDoctor } from '../../../../api/httpApiClient';
import { Button, Form, FormControl, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const ActionDoctors = ({ isEdit }) => {
    const [currentDoctor, setDoctor] = useState(null);
    const [isDoctorLoaded, setDoctorLoaded] = useState(false);
    const [isDepLoaded, setDepLoaded] = useState(false);
    const navigate = useNavigate();

    const { _id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const hospitalId = queryParams.get('hospital');

    const [formData, setFormData] = useState({
        specialization: '',
        name: '',
        surname: '',
        email: '',
        phone: '',
    });

    const [departments, setDepartments] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        fetchHospitalDepartments(hospitalId)
            .then((resp) => {
                setDepartments(resp.data.data);
                setDepLoaded(true);
            })
            .catch((err) => {
                setError('Failed to load departments');
            });

        if (isEdit && _id) {
            fetchSingleDoctor(_id)
                .then((resp) => {
                    const doctor = resp.data.data;
                    setDoctorLoaded(true);
                    setFormData({
                        specialization: doctor.specialization || '',
                        name: doctor.name || '',
                        surname: doctor.surname || '',
                        email: doctor.email || '',
                        phone: doctor.phone || ''
                    });
                    setSelectedDepartments(doctor.departments?.map(dep => dep.name));
                })
                .catch((err) => {
                    setError("Failed to load doctor data");
                })
        }
    }, [_id, hospitalId, isEdit])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    };

    const handleDepartmentsChange = (e) => {
        const value = e.target.value;
        setSelectedDepartments((prev) =>
            prev.includes(value) ? prev.filter(dep => dep !== value) : [...prev, value]
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (isEdit) {
                editDoctor(_id, {
                    ...formData,
                    departments: selectedDepartments,
                }).then((resp) => {
                    setSuccess('Doctor updated successfully');
                    alert('Doctor updated successfully');
                    navigate(`/adminpanel/settings/${hospitalId}/hospital`)
                });
            } else {
                createDoctor({
                    ...formData,
                    departments: selectedDepartments,
                    hospital_id: hospitalId
                }).then((resp) => {
                    setSuccess('Doctor created successfully');
                    alert('Doctor created successfully');
                    navigate(`/adminpanel/settings/${hospitalId}/hospital`)
                })
            }
            setFormData({
                specialization: '',
                name: '',
                surname: '',
                email: '',
                phone: '',
            })
            setSelectedDepartments([]);
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred");
        } finally {
            setLoading(false);
        }

    }
    const { t } = useTranslation();
    return (
        <>
            <Header />
            <div className={`${ActionHospitalStyles.actionRoot} d-flex align-items-center justify-content-center`}>
                <Form className={`${ActionHospitalStyles['login-form']}`} onSubmit={handleSubmit}>
                    <div className={`${ActionHospitalStyles['auth-form-content']}`}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '25px', textAlign: 'center' }}>
                            {isEdit ? t('editDoc') : t('addDoc')}
                        </h3>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label>{t('specialization')}</Form.Label>
                            <Form.Control
                                type="text"
                                name='specialization'
                                value={formData.specialization}
                                onChange={(e) => handleChange(e)}
                                placeholder={t('specialization')}
                            />
                        </Form.Group>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label>{t('firstname')}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t('firstname')}
                                name='name'
                                value={formData.name}
                                onChange={(e) => handleChange(e)}
                                disabled={isEdit}
                            />
                        </Form.Group>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label>{t('lastname')}</Form.Label>
                            <Form.Control
                                type="text"
                                name='surname'
                                placeholder={t('lastname')}
                                value={formData.surname}
                                onChange={(e) => handleChange(e)}
                                disabled={isEdit}
                            />
                        </Form.Group>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label>{t('email')}</Form.Label>
                            <Form.Control
                                type="email"
                                name='email'
                                value={formData.email}
                                placeholder={t('email')}
                                onChange={(e) => handleChange(e)}
                                disabled={isEdit}
                            />
                        </Form.Group>
                        {!isEdit ? (
                            <>
                                <Form.Group className="d-flex flex-column">
                                    <Form.Label>{t('phone')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name='phone'
                                        value={formData.phone}
                                        placeholder={t('phone')}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Form.Group>
                            </>
                        ) : (<></>)}

                        <Form.Group className="d-flex flex-column">
                            <Form.Label>{t('departments')}</Form.Label>
                            {isDepLoaded && departments.map((department) => (
                                <Form.Check
                                    type='checkbox'
                                    key={department.id}
                                    label={department.content.title}
                                    value={department.content.title}
                                    checked={selectedDepartments.includes(department.content.title)}
                                    onChange={handleDepartmentsChange}
                                />
                            ))}
                        </Form.Group>

                        {isLoading ? (
                            <Button variant="primary" disabled>
                                <Spinner animation="border" size="sm" />
                                {' '}Submitting...
                            </Button>
                        ) : (
                            <Button variant="primary" type="submit">
                                {isEdit ? t('save') : t('addDoc')}
                            </Button>
                        )}
                    </div>
                </Form>
            </div>
        </>
    )
}
