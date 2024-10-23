import React, { useEffect, useState } from 'react';
import ContentStyles from './Content.module.scss';
import SearchStyle from './Search.module.scss';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Hospital from "../Hospital";
// import { fetchHospitals } from '../../redux/slices/hospitalSlice';
import { fetchHospitals } from '../../api/httpApiClient';

export default function Content(props) {
    // const { isLoaded, hospitals, error } = useSelector(state => state.hospital);
    const [isLoaded, setLoaded] = useState(false);
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        fetchHospitals()
            .then((res) => {
                setLoaded(true);
                setHospitals(res.data.data);
            })
            .catch((err) => {
                setLoaded(false);
            })
    }, []);
    return (
        <>
            <div className={`${ContentStyles.bgImage}`}>
                <img src="/assets/blur-hospital.jpg" className={`${ContentStyles.image}`} alt="back" />
            </div>
            {/* Search */}
            {/* <div className={`${SearchStyle.root} shadow-lg mb-5 bg-white`}>
                <div className={`${SearchStyle.search}`}>
                    <Form inline>
                        <Form.Control
                            type="text"
                            placeholder="Пошук"
                        />
                    </Form>
                    <Button className={`${SearchStyle['search-btn']}`}>Знайти</Button>
                </div>
            </div> */}
            <div className={ContentStyles.root}>
                {isLoaded ? (
                    <Row>
                        {hospitals.map((obj, index) => (
                            <Col lg={4} xs={4} md={4}>
                                <Hospital
                                    _id={obj.id}
                                    title={obj.content.title}
                                    description={obj.content.description}
                                    rating={5}
                                />
                            </Col>
                        )
                        )}
                    </Row>
                ) : (
                    <div className={"d-flex justify-content-center align-items-center"}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

            </div>
        </>
    );
}
