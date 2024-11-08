import React, { useEffect, useState } from 'react'
import Header from '../../../../components/Header'
import chooseExistDepStyles from './HospitalPage.module.scss';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { attachExistedDepartments, fetchDepartments, fetchHospitalDepartments, fetchUnassignedDepartments } from '../../../../api/httpApiClient';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ChooseExistDepartment = () => {
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [depLoaded, setDepLoaded] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const hospitalId = queryParams.get('hospital');

    useEffect(() => {
        fetchUnassignedDepartments({ hospital_id: hospitalId })
            .then((resp) => {
                setDepLoaded(true);
                setDepartments(resp.data.data);
            })
    }, []);

    const handleDepartmentsChange = (e) => {
        const departmentId = Number(e.target.value);
        setSelectedDepartments((prev) =>
            prev.includes(departmentId)
                ? prev.filter(depId => depId !== departmentId)
                : [...prev, departmentId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedDepartments.length === 0) {
            alert('Please select at least one department to attach.');
            return;
        }


        attachExistedDepartments({
            hospital_id: hospitalId,
            department_ids: selectedDepartments
        })
            .then((resp) => {
                alert(resp.data.message);
            })
            .catch((err) => {
                console.error(err);
                alert('Something went wrong. Please try again.');
            });
    };

    const { t } = useTranslation();
    return (
        <>
            <Header />
            <div className={`${chooseExistDepStyles.actionRoot}`} style={{ margin: '100px auto', maxWidth: '1280px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '50px' }}>
                    Тут можна додати відділення, які ще відсутні
                </h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="d-flex flex-column">
                        <Row>
                            {depLoaded && departments.length > 0 ? departments.map((department) => (
                                <Col lg={5} key={department.id}>
                                    <Form.Check
                                        type="checkbox"
                                        label={department.content.title || department.alias}
                                        value={department.id}
                                        checked={selectedDepartments.includes(department.id)}
                                        onChange={handleDepartmentsChange}
                                    />
                                </Col>
                            )) : (
                                <>
                                    <p>Наразі у вас додані всі відділення, які є в системі</p>
                                </>
                            )}
                        </Row>
                    </Form.Group>
                    <Button disabled={!depLoaded || departments.length <= 0} type="submit" className="btn btn-secondary">
                        {t('attachDepartments')}
                    </Button>
                </Form>
            </div>
        </>
    );
};
