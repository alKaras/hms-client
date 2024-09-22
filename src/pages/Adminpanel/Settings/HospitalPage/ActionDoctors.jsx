import React, { useEffect, useState } from 'react'
import Header from '../../../../components/Header'
import ActionHospitalStyles from './HospitalPage.module.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createDoctor, editDoctor, fetchHospitalDepartments, fetchSingleDoctor } from '../../../../api/httpApiClient';
import { Button, Form, FormControl, Spinner } from 'react-bootstrap';

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

    useEffect(() => {
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
                        specialization: doctor.specialization,
                        name: doctor.name,
                        surname: doctor.surname,
                        email: doctor.email,
                        phone: doctor.phone
                    });
                    setSelectedDepartments(doctor.departments.map(dep => dep.name));
                })
                .catch((err) => {
                    setError("Failed to load doctor data");
                })
        }
    }, [isEdit, _id, hospitalId])

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
                });
            } else {
                createDoctor({
                    ...formData,
                    departments: selectedDepartments,
                }).then((resp) => {
                    setSuccess('Doctor created successfully');
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
    return (
        <>
            <Header />
            <div className={`${ActionHospitalStyles.actionRoot} d-flex align-items-center justify-content-center`}>
                <Form className={`${ActionHospitalStyles['login-form']}`} onSubmit={handleSubmit}>
                    <div className={`${ActionHospitalStyles['auth-form-content']}`}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '25px', textAlign: 'center' }}>
                            {isEdit ? "Відредагувати лікаря" : "Додати лікаря"}
                        </h3>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label>Спеціалізація</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.specialization}
                                onChange={handleChange}
                                placeholder='Введіть спеціалізацію'
                            />
                        </Form.Group>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label>Ім'я</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введіть ім'я"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label>Прізвище</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введіть прізвище"
                                value={formData.surname}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label>Пошта лікаря</Form.Label>
                            <Form.Control
                                type="email"
                                value={formData.email}
                                placeholder={"Введіть пошту лікаря"}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label>Телефон лікаря</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.phone}
                                placeholder={"Введіть телефон лікаря"}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="d-flex flex-column">
                            <Form.Label>Відділи</Form.Label>
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
                                {isEdit ? 'Оновити інформацію' : 'Додати лікаря'}
                            </Button>
                        )}
                    </div>
                </Form>
            </div>
        </>
    )
}
