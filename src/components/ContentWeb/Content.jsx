import React from 'react';
import ContentStyles from './Content.module.scss';
import SearchStyle from './Search.module.scss';
import {Button, Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Hospital from "../Hospital";

export default function Content(props) {
    return (
        <>
            <div className={`${ContentStyles.bgImage}`}>
                <img src="/assets/blur-hospital.jpg" className={`${ContentStyles.image}`} alt="back"/>
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
                <Row>
                    {([...Array(6)]).map((obj, index) => (
                            <Col lg={4} xs={4} md={4}>
                                <Hospital
                                    _id={index}
                                    title={"Example"}
                                    description={"Lorem"}
                                    imageUrl={""}
                                    rating={5}
                                />
                            </Col>
                        )
                    )}
                </Row>
            </div>
        </>
    );
}
