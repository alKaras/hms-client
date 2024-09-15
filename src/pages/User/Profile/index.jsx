import React, { useEffect, useState } from 'react';
import Header from "../../../components/Header";
import UserProfileStyles from './UserProfile.module.scss';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getMe, infoAboutUser, selectIsLogged, selectStatus } from "../../../redux/slices/authSlice";
import axios from '../../../utils/axios';
import Moment from "react-moment";
import { LinkContainer } from 'react-router-bootstrap';
import { fetchFirstThreeReferrals } from '../../../redux/slices/userReferrals';


export default function UserProfile() {
    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const status = useSelector(selectStatus);
    const mainRole = isLogged && user.roles;
    const userEmail = isLogged && user.data.email;
    const isVerified = isLogged && user.data.email_verified_at !== null;
    const dispatch = useDispatch();
    const [isButtonDisabled, setIsDisabled] = useState(false);

    const { isLoading, firstThreeReferrals } = useSelector(state => state.referral);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isLogged && user.data) {
            setName(user.data.name || '');
            setSurname(user.data.surname || '');
        }
    }, [isLogged]);

    useEffect(() => {
        dispatch(fetchFirstThreeReferrals());
    }, [dispatch])


    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = user.id;
        let params;
        if (password !== '') {
            params = { name, surname, password }
        } else {
            params = { name, surname }
        }

        console.log(userId);
        console.log(params);

        await axios.put(`/user/edit/${userId}`, params)
            .then((data) => {
                alert("User data successfully changed!")
                window.location.reload();
            })
            .catch((err) => {
                alert(err.message)
            });
    }

    const resendVerification = async () => {
        setIsDisabled(true);
        await axios.post('/auth/email-resend-verification', { email: userEmail })
            .then((response) => {
                alert(response.data.message || 'Лист підтвердження надіслано');

                setTimeout(() => {
                    setIsDisabled(false);
                }, 60000);
            })
            .catch((error) => {
                alert(error.data.message || 'Сталася помилка');
                setIsDisabled(false);
            })
    }

    return (
        <>
            <Header />
            {isLogged && user?.data && status !== 'loading' ? (
                <div className={UserProfileStyles.root}>
                    <Row>
                        <Col lg={6} md={6} xs={6} className={UserProfileStyles.leftSide}>
                            <div className={UserProfileStyles.nestedContent}>
                                <div className={UserProfileStyles.userFrstContent}>
                                    <div className={UserProfileStyles.image}>
                                        <img src="/assets/profile.jpg" alt="profile" />
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
                                <form onSubmit={handleSubmit}>
                                    <div className={UserProfileStyles.userSndContent}>
                                        <div className={"d-flex justify-content-between align-items-center"}>
                                            <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                                <label>Ім'я</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}

                                                />
                                            </div>
                                            <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                                <label>Прізвище</label>
                                                <input type="text" value={surname}
                                                    onChange={(e) => setSurname(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className={"d-flex justify-content-between align-items-center"}>
                                            <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                                <label>Пошта</label>
                                                <input type="text" disabled={true} value={user.data.email} />
                                            </div>
                                            <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                                <label>Телефон</label>
                                                <input type="text" disabled={true} value={user.data.phone} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                        <label>Пароль</label>
                                        <input className={UserProfileStyles.pwdInp} type="text" value={password}
                                            onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <button className={'btn btn-primary'} type="submit">Зберегти</button>
                                </form>
                            </div>

                            {!isVerified ? (
                                <>
                                    <hr />
                                    <div className={UserProfileStyles.verificationBlock}>
                                        <div className={UserProfileStyles.vTitle}>Верифікація</div>
                                        <p>Для підтвердження акаунту та доступу до всіх можливостей сайту потрібно
                                            підтвердити пошту. Ми надіслали вам лист на пошту (перевірте папку спам)
                                            Якщо листа все-таки немає - надішлемо його знову
                                        </p>
                                        <Button disabled={isButtonDisabled} onClick={resendVerification}>Надіслати</Button>

                                    </div>
                                </>
                            ) : (
                                <>
                                </>
                            )}

                        </Col>
                        <Col lg={6} md={6} xs={6} className={UserProfileStyles.rightSide}>
                            <div className={UserProfileStyles.servicesBlock}>
                                <div className={UserProfileStyles.servicesContent}>
                                    <div className={UserProfileStyles.rsTitle}>Мої послуги</div>
                                    <ul className={UserProfileStyles.rsList}>
                                        {[...Array(3)].map((obj, index) => (
                                            <li className={UserProfileStyles.rsItem}>1</li>
                                        ))}
                                    </ul>
                                </div>
                                <LinkContainer style={{ color: 'white' }} to={'/user/services'}>
                                    <Button className='btn btn-primary'>Переглянути детальніше</Button>
                                </LinkContainer>
                            </div>
                            <div className={UserProfileStyles.referralsBlock}>
                                <div className={UserProfileStyles.referralsContent}>
                                    <div className={UserProfileStyles.rsTitle}>Мої направлення</div>
                                    <ul className={UserProfileStyles.rsList}>
                                        {isLoading === 'loaded' ? (
                                            <>
                                                {
                                                    firstThreeReferrals.map((obj, index) => (
                                                        <li key={index} className={UserProfileStyles.rsItem}>
                                                            {obj.referral_code}
                                                        </li>
                                                    ))
                                                }
                                            </>

                                        ) : (
                                            <div className={"d-flex justify-content-center align-items-center"}>
                                                <Spinner animation="border" variant="primary" />
                                            </div>
                                        )}
                                        {/* {[...Array(3)].map((obj, index) => (
                                            <li className={UserProfileStyles.rsItem}>2</li>
                                        ))} */}
                                    </ul>
                                </div>
                                <LinkContainer style={{ color: 'white' }} to={'/user/referrals'}>
                                    <Button className='btn btn-primary'>Переглянути детальніше</Button>
                                </LinkContainer>
                            </div>
                        </Col >
                    </Row >
                </div >
            ) : (
                <>
                    <div className={"d-flex justify-content-center align-items-center"} style={{ minHeight: '100vh' }}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                </>
            )
            }

        </>
    );
}
