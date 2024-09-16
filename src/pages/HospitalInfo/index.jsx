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
import { useDispatch, useSelector } from 'react-redux';
import { fetchHospital } from '../../redux/slices/hospitalSlice';
import axios from '../../utils/axios';

export default function HospitalInfo() {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [doctorsCollections, setDoctorsCollections] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewBody, setReviewBody] = useState("");

    const { id } = useParams();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDoctorLoaded, setDoctorLoaded] = useState(false);
    const [hospitalContent, setHospitalContent] = useState(null);

    useEffect(() => {
        dispatch(fetchHospital(id)).then((data) => {
            setHospitalContent(data.payload);
            setIsLoaded(true);
        })
            .catch((err) => setIsLoaded(false));
    }, [id, dispatch]);

    const services = [
        { id: 1, name: 'Service 1', price: '123' },
        { id: 2, name: 'Service 2', price: '123' },
        { id: 3, name: 'Service 3', price: '123' },
    ];

    const fetchReviews = async () => {
        const data = [
            {
                author: 'Author of review',
                content: "Some content for review",
                createdAt: "2024-08-09 13:00:00",
                rating: 4
            },
            {
                author: 'Author of review',
                content: "Some content for review",
                createdAt: "2024-08-09 13:00:00",
                rating: 4
            },
            {
                author: 'Author of review',
                content: "Some content for review",
                createdAt: "2024-08-09 13:00:00",
                rating: 4
            },
            {
                author: 'Author of review',
                content: "Some content for review",
                createdAt: "2024-08-09 13:00:00",
                rating: 4
            },
        ];
        setReviews(data);
    }


    useEffect(() => {
        axios.get(`hospital/fetch/${id}/departments`)
            .then((resp) => { setDepartments(resp.data.data); console.log(resp.data.data) })
            .catch((err) => console.log(err))
        fetchReviews();
    }, [id]);

    const handleDepartmentChange = (event) => {
        const selectedAlias = event.target.value;
        setSelectedDepartment(selectedAlias);
    };

    const fetchDoctorsBySelectedDep = async (e) => {
        e.preventDefault();
        if (selectedDepartment) {
            console.log(selectedDepartment);
            await axios.post('hospital/fetch/doctors', {
                "hospital_id": id,
                "dep_alias": selectedDepartment
            })
                .then((resp) => {
                    setDoctorsCollections(resp.data.doctors);
                    setDoctorLoaded(true);
                })
                .catch((err) => {
                    console.log(err);
                    setDoctorLoaded(false);
                });
        }
    }

    const handleSubmit = (e) => {
        fetchDoctorsBySelectedDep(e);
    }
    console.log(isDoctorLoaded);

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
                        <div>Адреса: {hospitalContent.content.address}</div>
                        <div>Пошта: {hospitalContent.hospital_email}</div>
                        <div>Телефон: {hospitalContent.hospital_phone}</div>
                    </div>
                    <Tabs defaultActiveKey={"doctors"} id={"uncontrolled-tab"} className={`${HospitalInfoStyles.root}`}>
                        <Tab eventKey={'doctors'} title={"Лікарі"} className={`${HospitalInfoStyles.doctors}`}>
                            <div style={{ marginBottom: '25px' }}>
                                <Form className={'d-flex align-content-center justify-content-between'} onSubmit={(e) => handleSubmit(e)}>
                                    <Form.Group controlId="departmentSelect">
                                        <Form.Control style={{ maxWidth: "600px" }} as="select" onChange={handleDepartmentChange} value={"" || selectedDepartment}>
                                            <option value="" disabled>Виберіть відділення</option>
                                            {departments.map((department, index) => (
                                                <option key={department.id} value={department.alias}>
                                                    <span>{department.id}</span> <span>{department.content.title}</span>
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <button className={`${SearchStyles.searchBtn} btn btn-primary`} style={{ marginLeft: 'auto' }} type={"submit"}>Знайти</button>
                                </Form>
                            </div>
                            <div>
                                <Row className={HospitalInfoStyles.doctorsList}>
                                    {isDoctorLoaded ? doctorsCollections.map((item, index) => (
                                        <Col lg={6} md={6} xs={6}>
                                            <DoctorCard title={item.name + ' ' + item.surname}
                                                email={item.email}
                                                active={item.hidden === 0} specialization={item.specialization} />
                                        </Col>
                                    )) : (
                                        <>
                                        </>
                                    )}

                                </Row>
                            </div>


                        </Tab>
                        <Tab eventKey={'services'} title={'Послуги'}>
                            <Table striped bordered hover style={{ marginTop: '25px' }}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Service</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map((service) => (
                                        <tr key={service.id}>
                                            <td>{service.id}</td>
                                            <td>{service.name}</td>
                                            <td>{service.price}</td>
                                            <td>
                                                <button className={"btn btn-secondary"}><i
                                                    className="fa-solid fa-cart-plus"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey={'reviews'} title={'Відгуки'} className={HospitalInfoStyles.reviews}>
                            <p className={HospitalInfoStyles.reviewsBadge}>"count(*)" review for hospital "name"</p>
                            <Row className={HospitalInfoStyles.reviewList}>
                                <Col lg={6} md={6} xs={6}>
                                    <div className={HospitalInfoStyles.reviewCollection}>
                                        {reviews.map((obj, index) => (
                                            <>
                                                <ReviewCard author={obj.author} content={obj.content} rating={obj.rating}
                                                    createdAt={obj.createdAt} />
                                            </>
                                        ))}
                                    </div>

                                </Col>
                                <Col lg={6} md={6} xs={6} className={HospitalInfoStyles.addReview}>
                                    <p style={{ fontWeight: 'bold', fontSize: "16px" }}>Напишіть власний відгук</p>
                                    <Form>
                                        <Form.Group controlId="formRating">
                                            <Form.Label>Rating (1-5)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                max="5"
                                                placeholder="Enter your rating"
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formReviewBody">
                                            <Form.Label>Review</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Write your review here"
                                                value={reviewBody}
                                                onChange={(e) => setReviewBody(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Button variant="primary" type="submit">
                                            Submit
                                        </Button>
                                    </Form>
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
