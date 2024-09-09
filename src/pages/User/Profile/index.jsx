import React from 'react';
import Header from "../../../components/Header";
import UserProfileStyles from './UserProfile.module.scss';
import {Button, Col, Row, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {infoAboutUser, selectIsLogged} from "../../../redux/slices/authSlice";
import axios from '../../../utils/axios';
import Moment from "react-moment";

export default function UserProfile() {
    const user = useSelector(infoAboutUser);
    const isLogged = useSelector(selectIsLogged);
    const mainRole = isLogged && user.roles;
    const userEmail = isLogged && user.data.email;
    console.log(userEmail);
    const isVerified = isLogged && user.data.email_verified_at !== null;

    const resendVerification = async () => {
        await axios.post('/auth/email-resend-verification', {email: userEmail})
            .then((response) => {
                // alert(response.data.message);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const onClickResend = async () => {
        await resendVerification();
    }

    return (
        <>
            <Header/>
            {isLogged ? (
                <div className={UserProfileStyles.root}>
                    <Row>
                        <Col lg={6} md={6} xs={6} className={UserProfileStyles.leftSide}>
                            <div className={UserProfileStyles.nestedContent}>
                                <div className={UserProfileStyles.userFrstContent}>
                                    <div className={UserProfileStyles.image}>
                                        <img src="/assets/profile.jpg" alt="profile"/>
                                    </div>
                                    <div className={UserProfileStyles.titles}>
                                        <div
                                            className={UserProfileStyles.title}
                                        >
                                            {user.data.name} {user.data.surname}
                                        </div>
                                        <ul>
                                            <li className={UserProfileStyles.roleBadge}>
                                                {mainRole}
                                            </li>
                                        </ul>

                                    </div>
                                    <div className={UserProfileStyles.verificationStatus}>
                                        {user.data.email_verified_at === null ? "Unverified" : (<> Verified at  <Moment format="DD/MM/YYYY HH:mm:ss">{user.data.email_verified_at}</Moment> </>)}
                                    </div>
                                </div>
                                <div className={UserProfileStyles.userSndContent}>
                                    <div className={"d-flex justify-content-between align-items-center"}>
                                        <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                            <label>Ім'я</label>
                                            <input type="text" value={user.data.name}/>
                                        </div>
                                        <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                            <label>Прізвище</label>
                                            <input type="text" value={user.data.surname}/>
                                        </div>
                                    </div>
                                    <div className={"d-flex justify-content-between align-items-center"}>
                                        <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                            <label>Пошта</label>
                                            <input type="text" disabled={true} value={user.data.email}/>
                                        </div>
                                        <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                            <label>Телефон</label>
                                            <input type="text" disabled={true} value={user.data.phone}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                    <label>Пароль</label>
                                    <input className={UserProfileStyles.pwdInp} type="text"/>
                                </div>
                                <Button type={"submit"}>Зберегти</Button>
                            </div>

                            {!isVerified ? (
                                <>
                                    <hr/>
                                    <div className={UserProfileStyles.verificationBlock}>
                                        <div className={UserProfileStyles.vTitle}>Верифікація</div>
                                        <p>Для підтвердження акаунту та доступу до всіх можливостей сайту потрібно
                                            підтвердити пошту. Ми надіслали вам лист на пошту (перевірте папку спам)
                                            Якщо листа все-таки немає - надішлемо його знову
                                        </p>
                                        <Button onClick={onClickResend}>Надіслати</Button>

                                    </div>
                                </>
                            ) : (
                                <>
                                </>
                            )}

                        </Col>
                        <Col lg={6} md={6} xs={6} className={UserProfileStyles.rightSide}>
                            2nd block: services and referrals
                        </Col>
                    </Row>
                    <div className={UserProfileStyles.userServices}>

                    </div>
                    {/*<Row className={UserProfileStyles.content}>*/}
                    {/*    <Col className={UserProfileStyles.leftSide} lg={9} md={9} xs={9}>*/}
                    {/*        <div className={UserProfileStyles.image}>*/}
                    {/*            <img src="/assets/profile.jpg" alt="profile"/>*/}
                    {/*        </div>*/}
                    {/*        <ul>*/}
                    {/*            <li className={UserProfileStyles.roleBadge}>*/}
                    {/*                {mainRole}*/}
                    {/*            </li>*/}
                    {/*        </ul>*/}
                    {/*    </Col>*/}
                    {/*    <Col className={UserProfileStyles.rightSide} lg={3} md={3} xs={3}>*/}

                    {/*        <div className={UserProfileStyles.title}>{user.data.name} {user.data.surname}</div>*/}
                    {/*        <div className="d-flex flex-column">*/}
                    {/*            <label>Пошта</label>*/}
                    {/*            <input*/}
                    {/*                type="text"*/}
                    {/*                value={user.data.email}*/}
                    {/*                disabled={true}*/}
                    {/*                // className={`${errors.email ? RegisterStyles['error-input'] : ''}`}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*        <div className="d-flex flex-column">*/}
                    {/*            <label>Телефон</label>*/}
                    {/*            <input type="text" value={user.data.phone}/>*/}
                    {/*        </div>*/}
                    {/*        <div style={{marginTop: '10px'}} className="d-flex flex-column">*/}
                    {/*            <label>Новий пароль</label>*/}
                    {/*            <input*/}
                    {/*                type={"password"}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*        <Button type={"submit"}>Зберегти</Button>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}
                </div>
            ) : (
                <>
                    <div className={"d-flex justify-content-center align-items-center"} style={{minHeight: '100vh'}}>
                        <Spinner animation="border" variant="primary"/>
                    </div>
                </>
            )}

</>
)
;
}
