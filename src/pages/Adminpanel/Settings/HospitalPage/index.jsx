import React, { useEffect, useState } from 'react';
import Header from '../../../../components/Header';
import HospitalPageStyles from './HospitalPage.module.scss';
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { fetchHospital, fetchHospitalDepartments, fetchHospitalDoctors, fetchHospitals, fetchHospitalServices, importDepartment, importDoctors, importServices } from '../../../../api/httpApiClient';
import { Link, useParams } from 'react-router-dom';

export default function HospitalPage({
    specific
}) {
    const [isCollectionLoaded, setCollectionLoaded] = useState(false);
    const [isSingleLoaded, setSingleLoaded] = useState(false);

    const [isDepsLoaded, setDepsLoaded] = useState(false);
    const [isDepChosen, setDepChosen] = useState(false);
    const [isDoctorsLoaded, setDoctorsLoaded] = useState(false);

    const [hospital, setHospital] = useState(null);
    const [hospitalDeps, setDepartments] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [doctorsCollections, setDoctorsCollections] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const { _id } = useParams();

    const [isCollectionServiceLoaded, setCollectionServiceLoaded] = useState(false);
    const [ServiceCollection, setServiceCollection] = useState([]);

    const refreshDoctorsCollection = (e) => {
        e.preventDefault();
        setSelectedDepartment('');
        setDepChosen(false);
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

    const refreshServices = (e) => {
        e.preventDefault();
        setCollectionServiceLoaded(false);
        setServiceCollection([]);

        fetchHospitalServices(
            {
                hospital_id: _id
            }
        )
            .then((resp) => {
                setCollectionServiceLoaded(true);
                setServiceCollection(resp.data.services);
            })
            .catch((err) => {
                setCollectionServiceLoaded(false);
                console.log(err);
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
        setDepChosen(true);
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
            fetchHospitalServices(
                {
                    hospital_id: _id
                }
            )
                .then((resp) => {
                    setCollectionServiceLoaded(true);
                    setServiceCollection(resp.data.services);
                })
                .catch((err) => {
                    setCollectionServiceLoaded(false);
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

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleBtnDoctImportCtrl = async () => {
        document.getElementById('fileDoctInput').click();
    }

    const handleImportDoctorSubmit = async (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);

            const formData = new FormData();
            formData.append('file', selectedFile);

            importDoctors(formData)
                .then((resp) => {
                    setMessage(resp.data.message);
                    alert(resp.data.message);
                })
                .catch((err) => {
                    alert(err.response.data.errors.file);
                });
        } else {
            alert("Please select a file");
        }
    }

    const handleBtnServiceImportCtrl = async () => {
        document.getElementById('fileServInput').click();
    }

    const handleImportServiceSubmit = async (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);

            const formData = new FormData();
            formData.append('file', selectedFile);

            importServices(formData)
                .then((resp) => {
                    setMessage(resp.data.message);
                    alert(resp.data.message);
                })
                .catch((err) => {
                    alert(err.response.data.errors.file);
                });
        } else {
            alert("Please select a file");
        }
    }

    const handleBtnDepImportCtrl = async () => {
        document.getElementById('fileDepInput').click();
    }

    const handleImportDepSubmit = async (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);

            const formData = new FormData();
            formData.append('file', selectedFile);

            importDepartment(formData)
                .then((resp) => {
                    setMessage(resp.data.message);
                    alert(resp.data.message);
                })
                .catch((err) => {
                    alert(err.response.data.errors.file);
                });
        } else {
            alert("Please select a file");
        }
    }

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
                                            <div><span>Назва: </span>{hospital.content.title} [id: {hospital.id}]</div>
                                            <div><span>Адреса: </span>{hospital.content.address}</div>
                                            <div><p>Опис:</p>{hospital.content.description}</div>
                                            <div><span>Телефон: </span>{hospital.hospital_phone}</div>
                                            <div><span>Пошта: </span>{hospital.hospital_email}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '20px', fontWeight: 'bold' }} className='d-flex align-items-center justify-content-between'>
                                            <h2>Відділи</h2>
                                            <div>
                                                <button className='btn' onClick={(e) => refreshDepartments(e)}><i class="fa-solid fa-arrows-rotate"></i></button>
                                                <input type="file" id="fileDepInput" accept='.xlsx' onChange={handleImportDepSubmit} style={{ display: 'none' }} />
                                                <button className='btn btn-secondary' style={{ marginLeft: '15px' }} onClick={handleBtnDepImportCtrl}>Import <i class="fa-solid fa-file-arrow-down"></i></button>
                                                <LinkContainer style={{ marginLeft: '15px', color: 'white' }} to={{
                                                    pathname: `/adminpanel/hospital/department/create`,
                                                    search: `?hospital=${_id}`
                                                }}>
                                                    <Button className='btn btn-secondary' >Create new</Button>
                                                </LinkContainer>
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
                                                                    <LinkContainer to={`/adminpanel/hospital/department/${dep.id}/edit`}>
                                                                        <Button style={{ textAlign: 'center' }} className='btn btn-warning'>
                                                                            <i class="fa-solid fa-pen"></i>
                                                                        </Button>
                                                                    </LinkContainer>
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
                                                <input type="file" id="fileDoctInput" accept='.xlsx' onChange={handleImportDoctorSubmit} style={{ display: 'none' }} />
                                                <button className='btn btn-secondary' style={{ marginLeft: '15px' }} onClick={handleBtnDoctImportCtrl}>Import <i class="fa-solid fa-file-arrow-down"></i></button>
                                                <LinkContainer style={{ marginLeft: '15px', color: 'white' }} to={{
                                                    pathname: `/adminpanel/hospital/doctor/create`,
                                                    search: `?hospital=${_id}`
                                                }}>
                                                    <Button className='btn btn-secondary' >Create new</Button>
                                                </LinkContainer>
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
                                                            {!isDepChosen ? (
                                                                <>
                                                                    <th>Відділи</th>
                                                                    <th>Сервіси</th>
                                                                </>
                                                            ) : <></>}
                                                            <th>Дії</th>
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
                                                                {!isDepChosen ? (<td>{doctor.departments?.map((data, index) => (
                                                                    <><span className={HospitalPageStyles.badge}>{data}</span></>
                                                                ))}</td>) : <></>}

                                                                {!isDepChosen ? (
                                                                    <td>{doctor.services?.map((data, ind) => (
                                                                        <><span key={ind}>{data}{doctor.services.length > 1 && ind < doctor.services.length - 1 ? <>, </> : <></>} </span></>
                                                                    ))}</td>
                                                                ) : <></>}


                                                                <td>
                                                                    <LinkContainer to={{
                                                                        pathname: `/adminpanel/hospital/doctor/${doctor.id}/edit`,
                                                                        search: `?hospital=${_id}`
                                                                    }}>
                                                                        <Button style={{ textAlign: 'center' }} className='btn btn-warning'>
                                                                            <i class="fa-solid fa-pen"></i>
                                                                        </Button>
                                                                    </LinkContainer>
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
                                    <div style={{ marginTop: '50px' }}>
                                        <div style={{ fontSize: '20px', fontWeight: 'bold' }} className='d-flex justify-content-between align-items-center'>
                                            <h2>Послуги</h2>
                                            <div>
                                                <button className='btn' onClick={(e) => refreshServices(e)}><i class="fa-solid fa-arrows-rotate"></i></button>
                                                <input type="file" id="fileServInput" accept='.xlsx' onChange={handleImportServiceSubmit} style={{ display: 'none' }} />
                                                <button className='btn btn-secondary' style={{ marginLeft: '15px' }} onClick={handleBtnServiceImportCtrl}>Import <i class="fa-solid fa-file-arrow-down"></i></button><LinkContainer style={{ marginLeft: '15px', color: 'white' }} to={{
                                                    pathname: `/adminpanel/hospital/service/create`,
                                                    search: `?hospital=${_id}`
                                                }}>
                                                    <Button className='btn btn-secondary' >Create new</Button>
                                                </LinkContainer>
                                            </div>
                                        </div>
                                        {isCollectionServiceLoaded ? (
                                            <>
                                                <Table style={{ marginTop: '25px' }} bordered>
                                                    <thead>
                                                        <tr>
                                                            <th>#ID</th>
                                                            <th>Послуга</th>
                                                            <th>Відділення</th>
                                                            <th>Лікарі</th>
                                                            <th>Дії</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {ServiceCollection.map((obj, index) => (
                                                            <>
                                                                <tr>
                                                                    <td>{obj.id}</td>
                                                                    <td>{obj.service_name}</td>
                                                                    <td>{obj.department}</td>
                                                                    <td style={{ width: '300px' }}>
                                                                        {obj.doctorInfo?.length > 0 ? (
                                                                            <>
                                                                                <ul style={{ padding: 0, width: '300px' }}>
                                                                                    {obj.doctorInfo.map((doctor, ind) => (
                                                                                        <>
                                                                                            <li key={ind} style={{ lineHeight: '150%' }}>
                                                                                                <span>[ID: {doctor.doctor_id}]</span> {doctor.name} <br /> {doctor.email}
                                                                                            </li>
                                                                                            <hr />
                                                                                        </>
                                                                                    ))}
                                                                                </ul>
                                                                            </>
                                                                        ) : (<></>)}
                                                                    </td>
                                                                    <td>
                                                                        <LinkContainer to={{
                                                                            pathname: `/adminpanel/hospital/service/${obj.id}/edit`,
                                                                            search: `?hospital=${_id}`
                                                                        }}>
                                                                            <Button style={{ textAlign: 'center' }} className='btn btn-warning'>
                                                                                <i class="fa-solid fa-pen"></i>
                                                                            </Button>
                                                                        </LinkContainer>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </>

                                        ) : (
                                            <>
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
