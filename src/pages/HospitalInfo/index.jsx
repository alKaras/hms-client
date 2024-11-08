import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import Hospital from "../../components/Hospital";
import { useParams } from "react-router-dom";
import { Button, Col, Row, Spinner, Tab, Table, Tabs } from "react-bootstrap";
import HospitalInfoStyles from './HospitalInfo.module.scss';
import DoctorCard from "../../components/DoctorCard";
import Form from "react-bootstrap/Form";
import SearchStyles from '../../components/ContentWeb/Search.module.scss';
import ReviewCard from "../../components/ReviewCard";
// import { fetchHospital } from '../../redux/slices/hospitalSlice';
import { createHospitalReviews, fetchHospital, fetchHospitalDepartments, fetchHospitalDoctors, fetchHospitalServices, getCountOfHospitalReviews, getHospitalReviews } from '../../api/httpApiClient';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../redux/slices/authSlice';
import { useTranslation } from 'react-i18next';

export default function HospitalInfo() {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [doctorsCollections, setDoctorsCollections] = useState(null);

    const [rating, setRating] = useState(0);
    const [reviewBody, setReviewBody] = useState("");
    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);

    const { id } = useParams();

    const [isLoaded, setIsLoaded] = useState(false);
    const [isDoctorLoaded, setDoctorLoaded] = useState(false);
    const [hospitalContent, setHospitalContent] = useState(null);

    const [isServiceLoaded, setServiceLoaded] = useState(false);
    const [serviceCollection, setServiceCollection] = useState([]);

    const [isReviewsLoaded, setReviewsLoaded] = useState(false);
    const [ReviewsCollection, setReviewCollection] = useState([]);
    // const [reviewsCounter, setReviewsCounter] = useState(0);
    const [isCreated, setIsCreated] = useState(false);
    const [isDisabled, setDisabled] = useState(false);

    useEffect(() => {
        fetchHospital(id)
            .then((data) => {
                setHospitalContent(data.data);
                setIsLoaded(true);
            })
            .catch((err) => setIsLoaded(false));
        fetchHospitalServices({
            hospital_id: id
        })
            .then((resp) => {
                setServiceLoaded(true);
                setServiceCollection(resp.data.services)
            })
            .catch((err) => {
                console.error(err);
            })

        fetchReviews(id);

    }, [id]);

    const fetchReviews = async (id) => {
        getHospitalReviews({
            hospital_id: id,
            limit: 6,
        })
            .then((resp) => {
                setReviewsLoaded(true);
                setReviewCollection(resp.data.data);
            })
            .catch((err) => {
                console.error(err.response.message);
            })
    }


    useEffect(() => {
        fetchHospitalDepartments(id)
            .then((resp) => {
                setDepartments(resp.data.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [id]);

    const handleDepartmentChange = (event) => {
        const selectedAlias = event.target.value;
        setSelectedDepartment(selectedAlias);
    };

    const fetchDoctorsBySelectedDep = (e) => {
        e.preventDefault();
        if (selectedDepartment) {

            fetchHospitalDoctors({
                hospital_id: id,
                dep_alias: selectedDepartment
            })
                .then((resp) => {
                    setDoctorsCollections(resp.data.doctors);
                    setDoctorLoaded(true);
                })
                .catch((err) => {
                    console.log(err);
                    setDoctorLoaded(false);
                })
        }
    }

    const handleSubmit = (e) => {
        fetchDoctorsBySelectedDep(e);
    }

    const handleSubmitReviews = (e) => {
        e.preventDefault();
        let params = { hospital_id: id, body: reviewBody };
        if (rating !== 0) params.rating = rating;
        setDisabled(true);

        createHospitalReviews(params)
            .then((resp) => {
                console.log(resp.data);
                setIsCreated(true);
                fetchReviews(id);
                setRating(0);
                setReviewBody('');
                setTimeout(() => setDisabled(false), 5000);
            })
            .catch((err) => {
                console.error(err.response.message);
                setIsCreated(false);
                setDisabled(false);
            })
    }

    const { t } = useTranslation();

    return (
        <>
            <Header />
            {isLoaded ? (
                <Hospital
                    _id={id}
                    title={hospitalContent.content.title}
                    rating={5}
                    isFullContent={true}
                >
                    <div>{hospitalContent.content.description}
                    </div>
                    <div style={{ margin: '15px' }} className={"d-flex justify-content-between align-items-center"}>
                        <div>{t('address')}: {hospitalContent.content.address}</div>
                        <div>{t('email')}: {hospitalContent.hospital_email}</div>
                        <div>{t('phone')}: {hospitalContent.hospital_phone}</div>
                    </div>
                    <Tabs defaultActiveKey={"doctors"} id={"uncontrolled-tab"} className={`${HospitalInfoStyles.root}`}>
                        <Tab eventKey={'doctors'} title={`${t('doctors')}`} className={`${HospitalInfoStyles.doctors}`}>
                            <div style={{ marginBottom: '25px' }}>
                                <Form className={'d-flex align-content-center justify-content-between'} onSubmit={(e) => handleSubmit(e)}>
                                    <Form.Group controlId="departmentSelect">
                                        <Form.Control style={{ maxWidth: "600px" }} as="select" onChange={handleDepartmentChange} value={"" || selectedDepartment}>
                                            <option value="" disabled>{t('chdep')}</option>
                                            {departments.map((department, index) => (
                                                <option key={department.id} value={department.alias}>
                                                    <span>{department.id}</span> <span>{department.content.title}</span>
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <button className={`${SearchStyles.searchBtn} btn btn-primary`} style={{ marginLeft: 'auto' }} type={"submit"}>{t('search')}</button>
                                </Form>
                            </div>
                            <div>
                                <Row className={HospitalInfoStyles.doctorsList}>
                                    {isDoctorLoaded ? doctorsCollections.map((item, index) => (
                                        <Col lg={6} md={6} xs={6}>
                                            <DoctorCard title={item.name + ' ' + item.surname}
                                                email={item.email}
                                                active={item.hidden === 0} specialization={item.specialization} hospital_id={id} doctor_id={item.id} />
                                        </Col>
                                    )) : (
                                        <>
                                        </>
                                    )}

                                </Row>
                            </div>


                        </Tab>
                        <Tab eventKey={'services'} title={`${t('services')}`}>
                            <Table striped bordered hover style={{ marginTop: '25px' }}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>{t('service')}</th>
                                        <th>{t('department')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isServiceLoaded && serviceCollection.map((service) => (
                                        <tr key={service.id}>
                                            <td>{service.id}</td>
                                            <td>{service.service_name}</td>
                                            <td>{service.department}</td>
                                            {isLogged && user.data.email_verified_at && (<td>
                                                <LinkContainer to={`/hospital/${id}/service/${service.id}/timeslots`}>
                                                    <button className={"btn btn-secondary"}><i className="fa-solid fa-circle-plus"></i></button>
                                                </LinkContainer>
                                            </td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey={'reviews'} title={`${t('reviews')}`} className={HospitalInfoStyles.reviews}>
                            {/* <p className={HospitalInfoStyles.reviewsBadge}></p> */}
                            <Row className={HospitalInfoStyles.reviewList}>
                                <Col lg={6} md={6} xs={6}>
                                    <div className={HospitalInfoStyles.reviewCollection}>
                                        {ReviewsCollection.map((obj, index) => (
                                            <>
                                                <ReviewCard author={obj.user.firstname + " " + obj.user.surname} content={obj.body} rating={obj.rating}
                                                    createdAt={obj.created_at} />
                                            </>
                                        ))}
                                    </div>

                                </Col>
                                <Col lg={6} md={6} xs={6} className={HospitalInfoStyles.addReview}>
                                    {isLogged && user.data.email_verified_at && (
                                        <>
                                            <p style={{ fontWeight: 'bold', fontSize: "16px" }}>{t('addReviews')}</p>
                                            <Form onSubmit={(e) => handleSubmitReviews(e)}>
                                                <Form.Group controlId="formRating">
                                                    <Form.Label>{t('rating')} (1-5)</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        min="1"
                                                        max="5"
                                                        placeholder={t('rating')}
                                                        value={rating}
                                                        onChange={(e) => setRating(e.target.value)}
                                                    />
                                                </Form.Group>

                                                <Form.Group controlId="formReviewBody">
                                                    <Form.Label>{t('review')}</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        placeholder={t('addReviews')}
                                                        value={reviewBody}
                                                        onChange={(e) => setReviewBody(e.target.value)}
                                                    />
                                                </Form.Group>

                                                <Button disabled={isDisabled} variant="primary" type="submit">
                                                    {isCreated && isDisabled ? (<i class="fa-solid fa-check"></i>) : (`${t('sendSth')}`)}
                                                </Button>
                                            </Form>
                                        </>
                                    )}

                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </Hospital>
            ) : (
                <div className={"d-flex justify-content-center align-items-center"} style={{ minHeight: '100vh' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

        </>
    );
}
