import React from 'react';
import Header from "../../../components/Header";
import UserProfileStyles from './UserProfile.module.scss';
import {Button, Col, Row} from "react-bootstrap";
import headerStyles from "../../../components/Header/Header.module.scss";
import Form from "react-bootstrap/Form";
import IntlTelInput from "intl-tel-input/reactWithUtils";

export default function UserProfile() {
    return (
        <>
            <Header/>
            <div className={UserProfileStyles.root}>
                <Row className={UserProfileStyles.content}>
                    <Col className={UserProfileStyles.leftSide} lg={9} md={9} xs={9}>
                        <div className={UserProfileStyles.image}>
                            <img src="/assets/profile.jpg" alt="profile"/>
                        </div>
                        <div className={UserProfileStyles.title}>Oleksandr Karas</div>
                        <div className="d-flex flex-column">
                            <label>Пошта</label>
                            <input
                                type="text"
                                value={"al.karas.pr@gmail.com"}
                                disabled={true}
                                // className={`${errors.email ? RegisterStyles['error-input'] : ''}`}
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <label>Телефон</label>
                            <input type="text" value={"+380500000000"}/>
                        </div>
                        <div style={{marginTop: '10px'}} className="d-flex flex-column">
                            <label>Новий пароль</label>
                            <input
                                type={"password"}
                            />
                        </div>
                        <Button type={"submit"}>Зберегти</Button>
                    </Col>
                    <Col className={UserProfileStyles.rightSide} lg={3} md={3} xs={3}>
                        <ul>
                        {[...Array(3)].map((item, index) => (
                            <li className={UserProfileStyles.roleBadge}>
                                Role Name
                            </li>
                        ))}
                        </ul>
                    </Col>
                </Row>
            </div>
        </>
    );
}
