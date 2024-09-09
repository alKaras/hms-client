import React from 'react';
import Header from "../../../components/Header";
import UserProfileStyles from './UserProfile.module.scss';
import {Button, Col, Row} from "react-bootstrap";
import headerStyles from "../../../components/Header/Header.module.scss";
import Form from "react-bootstrap/Form";
import IntlTelInput from "intl-tel-input/reactWithUtils";
import {useSelector} from "react-redux";
import {infoAboutUser, selectIsLogged} from "../../../redux/slices/authSlice";

export default function UserProfile() {
    const user = useSelector(infoAboutUser);
    const isLogged = useSelector(selectIsLogged);
    const mainRole = isLogged && user.roles;
    return (
        <>
            <Header/>
            {isLogged ? (
                <div className={UserProfileStyles.root}>
                    <Row className={UserProfileStyles.content}>
                        <Col className={UserProfileStyles.leftSide} lg={9} md={9} xs={9}>
                            <div className={UserProfileStyles.image}>
                                <img src="/assets/profile.jpg" alt="profile"/>
                            </div>
                            <div className={UserProfileStyles.title}>{user.data.name} {user.data.surname}</div>
                            <div className="d-flex flex-column">
                                <label>Пошта</label>
                                <input
                                    type="text"
                                    value={user.data.email}
                                    disabled={true}
                                    // className={`${errors.email ? RegisterStyles['error-input'] : ''}`}
                                />
                            </div>
                            <div className="d-flex flex-column">
                                <label>Телефон</label>
                                <input type="text" value={user.data.phone}/>
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
                                    <li className={UserProfileStyles.roleBadge}>
                                        {mainRole}
                                    </li>
                            </ul>
                        </Col>
                    </Row>
                </div>
            ) : (
                <>
                    loading...
                </>
            )}

        </>
    );
}
