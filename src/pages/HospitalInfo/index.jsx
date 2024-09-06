import React, {useEffect, useState} from 'react';
import Header from "../../components/Header";
import Hospital from "../../components/Hospital";
import {useParams} from "react-router-dom";
import {Button, Col, Row, Tab, Table, Tabs} from "react-bootstrap";
import HospitalInfoStyles from './HospitalInfo.module.scss';
import DoctorCard from "../../components/DoctorCard";
import Form from "react-bootstrap/Form";
import SearchStyles from '../../components/ContentWeb/Search.module.scss';
import ReviewCard from "../../components/ReviewCard";

export default function HospitalInfo() {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [doctorsCollections, setDoctorsCollections] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewBody, setReviewBody] = useState("");

    const services = [
        {id: 1, name: 'Service 1', price: '123'},
        {id: 2, name: 'Service 2', price: '123'},
        {id: 3, name: 'Service 3', price: '123'},
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
        // Simulate fetching departments from an API
        const fetchDepartments = async () => {
            // Example data structure
            const data = [
                {alias: 'dept1', content: 'Department 1'},
                {alias: 'dept2', content: 'Department 2'},
                // Add more departments here
            ];
            setDepartments(data);
        };

        fetchDepartments();
        fetchReviews();
    }, []);
    const {_id} = useParams();
    const handleDepartmentChange = (event) => {
        const selectedAlias = event.target.value;
        setSelectedDepartment(selectedAlias);
    };

    const fetchDoctorsBySelectedDep = async () => {
        if (selectedDepartment) {
            // Simulate fetching data for the selected department
            const data = await fetch(``)
                .then((response) => response.json())
                .catch((error) => console.error('Error fetching department data:', error));

            setDoctorsCollections(data);
        }
    }
    return (
        <>
            <Header/>
            <Hospital
                _id={_id}
                title={"Example"}
                image={""}
                rating={5}
                isFullContent={true}
            >
                <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi aut dignissimos dolorem doloribus
                    expedita fugit impedit labore, magni, molestias natus odit officia quas tempora tempore unde veniam
                    veritatis voluptas voluptatum?
                    Asperiores assumenda autem corporis culpa doloribus excepturi, exercitationem facilis fuga ipsum
                    itaque officiis quasi repellat, saepe similique totam voluptate voluptatum. A delectus ex explicabo,
                    itaque molestias pariatur vitae voluptate voluptatum.
                    Accusantium aliquam asperiores fugiat inventore magni mollitia non, numquam quas repudiandae. Atque
                    corporis delectus deleniti, doloribus in labore, laudantium magni mollitia odio placeat porro
                    quibusdam quidem quisquam repudiandae sed sit.
                    Aliquam aut, blanditiis consequuntur delectus deserunt dolorem est ex illum inventore ipsa itaque,
                    labore minima nam obcaecati odit placeat quibusdam quis quisquam quod ratione recusandae suscipit
                    vero voluptate voluptatem voluptatibus.
                    Aliquam impedit quis vero. Alias aperiam explicabo ipsam? Autem cupiditate eos facere id illo ipsum
                    iusto, nesciunt, odio optio quis reprehenderit similique vel velit veniam voluptates. Aliquid magnam
                    odit officia.
                </div>
                <Tabs defaultActiveKey={"doctors"} id={"uncontrolled-tab"} className={`${HospitalInfoStyles.root}`}>
                    <Tab eventKey={'doctors'} title={"Лікарі"} className={`${HospitalInfoStyles.doctors}`}>
                        <div className={HospitalInfoStyles.search}>
                            <Form.Group controlId="departmentSelect">
                                <Form.Control style={{maxWidth: "600px"}} as="select" onChange={handleDepartmentChange}>
                                    {departments.map((department, index) => (
                                        <option key={index} value={department.alias}>
                                            {department.content}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Button className={SearchStyles.searchBtn} type={"submit"}
                                    onClick={fetchDoctorsBySelectedDep}>Знайти</Button>
                        </div>
                        <div>
                            <Row className={HospitalInfoStyles.doctorsList}>
                                {[...Array(6)].map((item, index) => (
                                    <Col lg={6} md={6} xs={6}>
                                        <DoctorCard title={"Sample Doctor"}
                                                    description={"Lorem ipsum dolor sit amet, consectetur adipisicing elit.odit quidem, tempora ut. Cum eum exercitationem nihil."}
                                                    active={true} specialization={"Cardiolog"}/>
                                    </Col>
                                ))}

                            </Row>
                        </div>


                    </Tab>
                    <Tab eventKey={'services'} title={'Послуги'}>
                        <Table striped bordered hover style={{marginTop: '25px'}}>
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
                                                        createdAt={obj.createdAt}/>
                                        </>
                                    ))}
                                </div>

                            </Col>
                            <Col lg={6} md={6} xs={6} className={HospitalInfoStyles.addReview}>
                                <p style={{fontWeight: 'bold', fontSize: "16px"}}>Напишіть власний відгук</p>
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
        </>
    );
}
