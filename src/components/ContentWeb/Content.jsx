import React, { useEffect } from 'react';
import ContentStyles from './Content.module.scss';
import SearchStyle from './Search.module.scss';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Hospital from "../Hospital";
import { useDispatch, useSelector } from 'react-redux';
import { fetchHospitals } from '../../redux/slices/hospitalSlice';

export default function Content(props) {
    const dispatch = useDispatch();
    const { isLoading, hospitals, error } = useSelector(state => state.hospital);

    useEffect(() => {
        dispatch(fetchHospitals());
    }, [dispatch]);
    return (
        <>
            <div className={`${ContentStyles.bgImage}`}>
                <img src="/assets/blur-hospital.jpg" className={`${ContentStyles.image}`} alt="back" />
            </div>
            {/* Search */}
            <div className={`${SearchStyle.root} shadow-lg mb-5 bg-white`}>
                <div className={`${SearchStyle.search}`}>
                    <Form inline>
                        <Form.Control
                            type="text"
                            placeholder="Пошук"
                        />
                    </Form>
                    {/*<Button style={{background: 'none'}}><i className="fa-solid fa-x"></i></Button>*/}
                    <Button className={`${SearchStyle['search-btn']}`}>Знайти</Button>
                </div>
            </div>
            <div className={ContentStyles.root}>
                {isLoading === 'loaded' ? (
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
