import React, { useEffect, useState } from 'react';
import Header from "../../../components/Header";
import UserProfileStyles from './UserProfile.module.scss';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { infoAboutUser, selectIsLogged, selectStatus } from "../../../redux/slices/authSlice";
import Moment from "react-moment";
import { LinkContainer } from 'react-router-bootstrap';
import { editUser, fetchFirstThreeReferrals, getOrderByFilter, resendVerification } from '../../../api/httpApiClient';
import { OrderFiltersEnum } from '../../../utils/enums/OrderFiltersEnum';
import { useTranslation } from 'react-i18next'

export default function UserProfile() {
    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const status = useSelector(selectStatus);
    const mainRole = isLogged && user.roles;
    const userEmail = isLogged && user.data.email;

    const userId = isLogged && user.id;
    const isVerified = isLogged && user.data.email_verified_at !== null;
    const [isButtonDisabled, setIsDisabled] = useState(false);

    const [isLoaded, setLoaded] = useState(false);
    const [firstThreeReferrals, setReferrals] = useState([]);

    // const { isLoaded, firstThreeReferrals } = useSelector(state => state.referral);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');

    const [firstThreeOrders, setFirstThreeOrders] = useState([]);
    const [ordersLoaded, setOrdersLoaded] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        if (isLogged && user.data) {
            setName(user.data.name || '');
            setSurname(user.data.surname || '');
        }
    }, [isLogged]);

    useEffect(() => {
        fetchFirstThreeReferrals()
            .then((res) => {
                setReferrals(res.data.data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(err);
            });

        getOrderByFilter({
            filter: OrderFiltersEnum.ORDERS_BY_USER,
            limit: 3,
            user_id: userId
        })
            .then((resp) => {
                console.log(resp.data);
                setOrdersLoaded(true);
                setFirstThreeOrders(resp.data.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [userId])


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

        editUser(userId, params)
            .then((data) => {
                alert("User data successfully changed!")
                window.location.reload();
            })
            .catch((err) => {
                alert(err.message)
            });
    }

    const resendMailVerification = async () => {
        setIsDisabled(true);
        resendVerification(userEmail)
            .then((response) => {
                alert(response.data.message || `${t('verificationEmail')}`);

                setTimeout(() => {
                    setIsDisabled(false);
                }, 60000);
            })
            .catch((error) => {
                alert(`${t('error')}`);
                setIsDisabled(false);
            })
    }

    return (
        <>
            <Header />
            {isLogged && user?.data && status !== 'loading' ? (
                <div className={UserProfileStyles.root}>
                    <Row style={mainRole !== 'user' ? { display: 'flex', justifyContent: 'center' } : {}}>
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
                                        {user.data.email_verified_at === null ? "Unverified" : (<> {t('verifiedAt')} <Moment format="DD/MM/YYYY HH:mm:ss">{user.data.email_verified_at}</Moment> </>)}
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className={UserProfileStyles.userSndContent}>
                                        <div className={"d-flex justify-content-between align-items-center"}>
                                            <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                                <label>{t('firstname')}</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}

                                                />
                                            </div>
                                            <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                                <label>{t('lastname')}</label>
                                                <input type="text" value={surname}
                                                    onChange={(e) => setSurname(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className={"d-flex justify-content-between align-items-center"}>
                                            <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                                <label>{t('email')}</label>
                                                <input type="text" disabled={true} value={user.data.email} />
                                            </div>
                                            <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                                <label>{t('phone')}</label>
                                                <input type="text" disabled={true} value={user.data.phone} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                        <label>{t('password')}</label>
                                        <input className={UserProfileStyles.pwdInp} type="text" value={password}
                                            onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <button className={'btn btn-primary'} type="submit">{t('save')}</button>
                                </form>
                            </div>

                            {!isVerified ? (
                                <>
                                    <hr />
                                    <div className={UserProfileStyles.verificationBlock}>
                                        <div className={UserProfileStyles.vTitle}>Верифікація</div>
                                        <p>{t('sendVerificationMsg')}</p>
                                        <Button disabled={isButtonDisabled} onClick={resendMailVerification}>{t('sendSth')}</Button>

                                    </div>
                                </>
                            ) : (
                                <>
                                </>
                            )}

                        </Col>
                        {mainRole === 'user' && (<Col lg={6} md={6} xs={6} className={UserProfileStyles.rightSide}>
                            <div className={UserProfileStyles.servicesBlock}>
                                <div className={UserProfileStyles.servicesContent}>
                                    <div className={UserProfileStyles.rsTitle}>{t('userServices')}</div>
                                    <ul className={UserProfileStyles.rsList}>
                                        {ordersLoaded ? firstThreeOrders.map((item) => (
                                            <li className={`${UserProfileStyles.rsItem} d-flex justify-content-between align-items-center`}>
                                                <div>
                                                    <p>{t('order')}:</p>
                                                    {item.order.id}
                                                </div>
                                                <div>{t('numofservices')}: {item.services.length}</div>
                                            </li>
                                        )) : (
                                            <div className={"d-flex justify-content-center align-items-center"}>
                                                <Spinner animation="border" variant="primary" />
                                            </div>
                                        )}
                                    </ul>
                                </div>
                                <LinkContainer style={{ color: 'white' }} to={`/user/${isLogged ? userId : 0}/services`}>
                                    <Button className='btn btn-primary'>{t('seeMore')}</Button>
                                </LinkContainer>
                            </div>
                            <div className={UserProfileStyles.referralsBlock}>
                                <div className={UserProfileStyles.referralsContent}>
                                    <div className={UserProfileStyles.rsTitle}>{t('userReferrals')}</div>
                                    <ul className={UserProfileStyles.rsList}>
                                        {isLoaded ? (
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
                                    <Button className='btn btn-primary'>{t('seeMore')}</Button>
                                </LinkContainer>
                            </div>
                        </Col >)}
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
