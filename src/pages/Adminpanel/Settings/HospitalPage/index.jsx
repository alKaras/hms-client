import React, { useEffect, useState } from 'react';
import Header from '../../../../components/Header';
import HospitalPageStyles from './HospitalPage.module.scss';
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { fetchHospital, fetchHospitalDepartments, fetchHospitalDoctors, fetchHospitals } from '../../../../api/httpApiClient';
import { useParams } from 'react-router-dom';

export default function HospitalPage({
    specific
}) {
    const [isCollectionLoaded, setCollectionLoaded] = useState(false);
    const [isSingleLoaded, setSingleLoaded] = useState(false);
    const [isDepsLoaded, setDepsLoaded] = useState(false);
    const [isDoctorsLoaded, setDoctorsLoaded] = useState(false);
    const [hospital, setHospital] = useState(null);
    const [hospitalDeps, setDepartments] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [doctorsCollections, setDoctorsCollections] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const { _id } = useParams();

    const refreshDoctorsCollection = (e) => {
        e.preventDefault();
        setSelectedDepartment('');
        fetchHospitalDoctors({
            hospital_id: _id
        })
            .then((resp) => {
                setDoctorsCollections(resp.data.doctors);
                setDoctorsLoaded(true);
                console.log(resp.data.doctors);
            })
            .catch((err) => {
                console.log(err);
                setDoctorsLoaded(false);
            })
    }

    const refreshDepartments = (e) => {
        e.preventDefault();
        setDepsLoaded(false);
        setDepartments([]);

        fetchHospitalDepartments(_id)
            .then((resp) => {
                setDepsLoaded(true);
                setDepartments(resp.data.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const fetchDoctorsBySelectedDep = async (e) => {
        e.preventDefault();
        setDoctorsLoaded(false);
        if (selectedDepartment) {
            const params = {
                hospital_id: _id,
                dep_alias: selectedDepartment
            }
            fetchHospitalDoctors(params)
                .then((resp) => {
                    setDoctorsCollections(resp.data.doctors);
                    setDoctorsLoaded(true);
                    console.log(resp.data.doctors);
                })
                .catch((err) => {
                    console.log(err);
                    setDoctorsLoaded(false);
                })
        }
    }

    const handleDepartmentChange = (event) => {
        const selectedAlias = event.target.value;
        setSelectedDepartment(selectedAlias);
    };

    const handleSubmit = (e) => {
        fetchDoctorsBySelectedDep(e);
    }


    useEffect(() => {
        if (specific) {
            setDoctorsLoaded(false);
            fetchHospital(_id)
                .then((resp) => {
                    setSingleLoaded(true);
                    setHospital(resp.data);
                })
                .catch((err) => {
                    alert("something went wrong Err: " + err);
                    setSingleLoaded(false);
                });
            fetchHospitalDepartments(_id)
                .then((resp) => {
                    setDepsLoaded(true);
                    setDepartments(resp.data.data);
                })
                .catch((err) => {
                    console.log(err);
                })


        } else {
            fetchHospitals()
                .then((resp) => {
                    setCollectionLoaded(true);
                    setHospitals(resp.data.data);
                })
                .catch((err) => {
                    setCollectionLoaded(false);
                    alert("Can't fetch hospitals");
                });
        }
    }, [_id, specific]);

    return (
        <>
            <Header />
            <div className={HospitalPageStyles.root}>
                {specific ?
                    <>
                        {isSingleLoaded ? (
                            <>
                                <div className={HospitalPageStyles.contentSingle}>
                                    <div className={HospitalPageStyles.mainInfo}>
                                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Основна інформація</div>
                                        <div className={HospitalPageStyles.innerContent}>
                                            <div><span>Назва: </span>{hospital.content.title}</div>
                                            <div><span>Адреса: </span>{hospital.content.address}</div>
                                            <div><p>Опис:</p>{hospital.content.description}</div>
                                            <div><span>Телефон: </span>{hospital.hospital_phone}</div>
                                            <div><span>Пошта: </span>{hospital.hospital_phone}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '20px', fontWeight: 'bold' }} className='d-flex align-items-center justify-content-between'>
                                            <h2>Відділи</h2>
                                            <div>
                                                <button className='btn' onClick={(e) => refreshDepartments(e)}><i class="fa-solid fa-arrows-rotate"></i></button>
                                                <button className='btn btn-secondary' style={{ marginLeft: '15px' }}>Import <i class="fa-solid fa-file-arrow-down"></i></button>
                                                <button className='btn btn-secondary' style={{ marginLeft: '15px' }}>Create new</button>
                                            </div>
                                        </div>
                                        {isDepsLoaded ? (
                                            <>
                                                <Table style={{ margin: '15px 0' }} bordered>
                                                    <thead>
                                                        <tr>
                                                            <th>#ID</th>
                                                            <th>Назва</th>
                                                            <th>Пошта</th>
                                                            <th>Публічний телефон</th>
                                                            <th>Дії</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {hospitalDeps.map((dep, index) => (
                                                            <tr>
                                                                <td>{dep.id}</td>
                                                                <td>{dep.content.title}</td>
                                                                <td>{dep.email}</td>
                                                                <td>{dep.phone}</td>
                                                                <td>
                                                                    <Button style={{ textAlign: 'center' }} className='btn btn-warning'>
                                                                        <i class="fa-solid fa-pen"></i>
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </>
                                        ) : (
                                            <>
                                                Loading...
                                            </>
                                        )}

                                    </div>
                                    <div>
                                        <div style={{ fontSize: '20px', fontWeight: 'bold' }} className='d-flex justify-content-between align-items-center'>
                                            <h2>Лікарі</h2>
                                            <div>
                                                <button className='btn' onClick={(e) => refreshDoctorsCollection(e)}><i class="fa-solid fa-arrows-rotate"></i></button>
                                                <button className='btn btn-secondary' style={{ marginLeft: '15px' }}>Import <i class="fa-solid fa-file-arrow-down"></i></button>
                                                <button className='btn btn-secondary' style={{ marginLeft: '15px' }}>Create new</button>
                                            </div>
                                        </div>
                                        <Form style={{ marginTop: '15px' }} className={'d-flex align-content-center justify-content-between'} onSubmit={(e) => handleSubmit(e)}>
                                            <Form.Group controlId="departmentSelect">
                                                <Form.Control style={{ maxWidth: "600px" }} as="select" onChange={handleDepartmentChange} value={"" || selectedDepartment}>
                                                    <option value="" disabled>Виберіть відділення</option>
                                                    {hospitalDeps.map((department, index) => (
                                                        <option key={department.id} value={department.alias}>
                                                            <span>{department.id}</span> <span>{department.content.title}</span>
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <button className={`btn btn-primary`} style={{ marginLeft: 'auto' }} type={"submit"}>Знайти</button>
                                        </Form>
                                        {isDoctorsLoaded ? (
                                            <>
                                                <Table style={{ marginTop: '15px' }} bordered>
                                                    <thead>
                                                        <tr>
                                                            <th>#ID</th>
                                                            <th>Ім'я</th>
                                                            <th>Прізвище</th>
                                                            <th>Спеціалізація</th>
                                                            <th>Пошта</th>
                                                            <th>Робочий статус</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {doctorsCollections.map((doctor, index) => (
                                                            <tr>
                                                                <td>{doctor.id}</td>
                                                                <td>{doctor.name}</td>
                                                                <td>{doctor.surname}</td>
                                                                <td>{doctor.specialization}</td>
                                                                <td>{doctor.email}</td>
                                                                <td style={{ textAlign: 'center' }}>{doctor.hidden === 0 ? <><i className="fa-solid fa-user-check"></i></> : <><i className="fa-solid fa-user-large-slash"></i></>}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </>
                                        ) : (
                                            <>
                                                Loading...
                                            </>
                                        )}

                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={"d-flex justify-content-center align-items-center"} style={{ maxHeight: '100vh' }}>
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}

                    </> :
                    <>
                        {isCollectionLoaded ? (
                            <div className={HospitalPageStyles.contentMany}>
                                <div className='d-flex align-items-center justify-content-end'>
                                    <LinkContainer style={{ color: 'white' }} to={'/adminpanel/hospital/create'}>
                                        <Button className='btn btn-secondary'>Add new hospital</Button>
                                    </LinkContainer>
                                </div>
                                <Table style={{ marginTop: '15px' }} bordered>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Alias</th>
                                            <th>Title</th>
                                            <th>Address</th>
                                            <th>Hospital Phone</th>
                                            <th>Hospital Email</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hospitals.map((hospital) => (
                                            <tr>
                                                <td>{hospital.id}</td>
                                                <td>{hospital.alias}</td>
                                                <td>{hospital.content.title ?? ""}</td>
                                                <td>{hospital.content.address}</td>
                                                <td>{hospital.hospital_phone ?? ""}</td>
                                                <td>{hospital.hospital_email ?? ""}</td>
                                                <td>
                                                    <LinkContainer style={{ marginRight: '15px' }} to={`/adminpanel/hospital/${hospital.id}/edit`}><Button className='btn btn-warning'><i class="fa-solid fa-pen"></i></Button></LinkContainer>
                                                    <LinkContainer to={`/adminpanel/settings/${hospital.id}/hospital`}><Button className='btn btn-primary'><i style={{ color: 'white' }} class="fa-solid fa-up-right-from-square"></i></Button></LinkContainer>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className={"d-flex justify-content-center align-items-center"} style={{ maxHeight: '100vh' }}>
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}

                    </>
                }
            </div >
        </>
    );
}
