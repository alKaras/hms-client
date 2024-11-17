import React, { useEffect, useState } from 'react';
import { Badge, Button, Dropdown, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import headerStyles from './Header.module.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { infoAboutUser, logout, selectIsLogged, selectStatus } from "../../redux/slices/authSlice";
import { useTranslation } from 'react-i18next';
import { LangSwitcher } from '../LangSwitcher';

export default function Header() {
    const { t } = useTranslation();
    const location = useLocation();
    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const hospitalId = isLogged && user.hospitalId;
    const doctorId = (isLogged && user.doctor) ?? null;
    const userId = (isLogged && user.id) ?? null;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const isAdminPanel = location.pathname === '/adminpanel';
    const userRole = isLogged && user.roles;
    const isManager = userRole === "manager";
    const isUser = userRole === "user";
    const isAdmin = userRole === "admin";
    const isDoctor = userRole === "doctor";

    const logOutHandler = () => {
        dispatch(logout());
        window.localStorage.removeItem("token");
        navigate("/");

    }

    // useEffect(() => {
    //     if (isAdmin || isDoctor || isManager) {
    //         navigate('/adminpanel');
    //     }
    // }, [isAdmin, isDoctor, isManager, navigate]);

    return (
        <Navbar expand="md" className={`${headerStyles.root} d-flex align-content-center justify-content-between fixed-top`}>
            <LinkContainer to={
                isUser ? '/' :
                    isDoctor ? '/adminpanel/services' :
                        isManager ? '/adminpanel/users' : '/adminpanel/hospitals'}>
                <Navbar.Brand className='d-flex align-items-center'>
                    <img
                        src="/assets/logo/logo.svg"
                        alt="logo"
                        width={50}
                        height={50}
                        className='align-middle' />
                    <p className={headerStyles['brand-text']}>HMS</p>
                </Navbar.Brand>
            </LinkContainer>
            <Nav>
                {isLogged ? (
                    <>

                        {isManager ? (
                            <>
                                <div className={headerStyles['menu-header']}>
                                    {/* <LinkContainer to={'/adminpanel/doctors'}>
                                        <Button className={headerStyles['btn-header']}>Лікарі</Button>
                                    </LinkContainer> */}
                                    {/* <LinkContainer to={'/adminpanel/services'}>
                                        <Button className={headerStyles['btn-header']}>Послуги</Button>
                                    </LinkContainer> */}
                                    <LinkContainer to={'/adminpanel/users'}>
                                        <Button className={headerStyles['btn-header']}>{t('patients')}</Button>
                                    </LinkContainer>
                                    <LinkContainer to={`/adminpanel/hospital/${hospitalId}/operations`}>
                                        <Button className={headerStyles['btn-header']}>{t('operations')}</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/reports'}>
                                        <Button className={headerStyles['btn-header']}>{t('report')}</Button>
                                    </LinkContainer>
                                    <Dropdown>
                                        <Dropdown.Toggle className={headerStyles.btnDrop} variant="success"
                                            id="dropdown-basic">
                                            {t('settings')}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item href={`/adminpanel/settings/${hospitalId}/hospital`}>{t('hospital')}</Dropdown.Item>
                                            <Dropdown.Item href="/adminpanel/hospital/order-history">{t('orderHistory')}</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown align="end">
                                        <Dropdown.Toggle id={'headerToggle'} className={` ${headerStyles.profileBadge}`}>
                                            <div
                                                className={headerStyles.title}>{user.data.name} {user.data.surname}</div>
                                            <div className={headerStyles.image}>
                                                <img src="/assets/profile.jpg" alt="profile" />
                                            </div>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu id={'headerMenu'} className='mt-3 p-3'>
                                            <LinkContainer to={'/user/profile'}>
                                                <Dropdown.Item id={'headerDropItem'} className={`${headerStyles['drop-link']}`}>{t('profile')}</Dropdown.Item>
                                            </LinkContainer>
                                            <Dropdown.Item onClick={logOutHandler} className={`${headerStyles['drop-link']}`}>{t('exit')}</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <LangSwitcher />
                            </>
                        ) : isDoctor ? (
                            <>
                                <div className={headerStyles['menu-header']}>
                                    <LinkContainer to={'/adminpanel/services'}>
                                        <Button className={headerStyles['btn-header']}>{t('services')}</Button>
                                    </LinkContainer>
                                    <LinkContainer to={`/adminpanel/doctor/${doctorId}/appointments/list`}>
                                        <Button className={headerStyles['btn-header']}>{t('appointments')}</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/users'}>
                                        <Button className={headerStyles['btn-header']}>{t('patients')}</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/reports'}>
                                        <Button className={headerStyles['btn-header']}>{t('report')}</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/doctor/order-history'}>
                                        <Button className={headerStyles['btn-header']}>{t('orderHistory')}</Button>
                                    </LinkContainer>
                                </div>
                                <Dropdown align="end">
                                    <Dropdown.Toggle id={'headerToggle'} className={` ${headerStyles.profileBadge}`}>
                                        <div
                                            className={headerStyles.title}>{user.data.name} {user.data.surname}</div>
                                        <div className={headerStyles.image}>
                                            <img src="/assets/profile.jpg" alt="profile" />
                                        </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu id={'headerMenu'} className='mt-3 p-3'>
                                        <LinkContainer to={'/user/profile'}>
                                            <Dropdown.Item id={'headerDropItem'} className={`${headerStyles['drop-link']}`}>{t('profile')}</Dropdown.Item>
                                        </LinkContainer>
                                        <Dropdown.Item onClick={logOutHandler} className={`${headerStyles['drop-link']}`}>{t('exit')}</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <LangSwitcher />
                            </>
                        ) : isAdmin ? (
                            <>
                                <div className={headerStyles['menu-header']}>
                                    <LinkContainer to={'/adminpanel/hospitals'}>
                                        <Button className={headerStyles['btn-header']}>{t('hospitals')}</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/users'}>
                                        <Button className={`${headerStyles['btn-header']} ${location.pathname === '/adminpanel/users' ? headerStyles['visited'] : ''}`}>
                                            {t('patients')}
                                        </Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/operations'}>
                                        <Button className={headerStyles['btn-header']}>{t('operations')}</Button>
                                    </LinkContainer>
                                </div>
                                <Dropdown align="end">
                                    <Dropdown.Toggle id={'headerToggle'} className={` ${headerStyles.profileBadge}`}>
                                        <div
                                            className={headerStyles.title}>{user.data.name} {user.data.surname}</div>
                                        <div className={headerStyles.image}>
                                            <img src="/assets/profile.jpg" alt="profile" />
                                        </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu id={'headerMenu'} className='mt-3 p-3'>
                                        <LinkContainer to={'/user/profile'}>
                                            <Dropdown.Item id={'headerDropItem'} className={`${headerStyles['drop-link']}`}>{t('profile')}</Dropdown.Item>
                                        </LinkContainer>
                                        <Dropdown.Item onClick={logOutHandler} className={`${headerStyles['drop-link']}`}>{t('exit')}</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <LangSwitcher />
                            </>
                        ) : isUser ? (
                            <>
                                <div className={headerStyles['menu-header']}>
                                    <LinkContainer to={'/'}>
                                        <Button className={headerStyles['btn-header']}>{t('home')}</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/user/medcard'}>
                                        <Button className={headerStyles['btn-header']}>{t('medcard')}</Button>
                                    </LinkContainer>
                                    {/* <LinkContainer to={`/user/${userId}/appointments/list`}>
                                        <Button className={headerStyles['btn-header']}>{t('appointments')}</Button>
                                    </LinkContainer> */}
                                    <Dropdown>
                                        <Dropdown.Toggle className={headerStyles.btnDrop} variant="success"
                                            id="dropdown-basic">
                                            {t('medicalHub')}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item href={`/user/${userId}/appointments/list`}>{t('appointments')}</Dropdown.Item>
                                            <Dropdown.Item href={'/user/referrals'}>{t('userReferrals')}</Dropdown.Item>
                                            <Dropdown.Item href={`/user/${user.id}/services`}>{t('userServices')}</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div>
                                    <Dropdown>
                                        <Dropdown.Toggle className={` ${headerStyles.profileBadge} shadow-sm rounded d-flex align-items-center justify-content-center`}>
                                            <div
                                                className={headerStyles.title}>{user.data.name} {user.data.surname}</div>
                                            <div className={headerStyles.image}>
                                                <img src="/assets/profile.jpg" alt="profile" />
                                            </div>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className='mt-3 p-3'>
                                            <LinkContainer to='/user/profile' style={{ color: 'black' }}>
                                                <Dropdown.Item className={`${headerStyles['drop-link']}`}>{t('profile')}</Dropdown.Item>
                                            </LinkContainer>
                                            <Dropdown.Item onClick={logOutHandler} className={`${headerStyles['drop-link']}`}>{t('exit')}</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                {user.data.email_verified_at && (
                                    <div className={headerStyles.cartContent}>
                                        <LinkContainer to={'/shoppingcart'} >
                                            <Button className={headerStyles.cart}>
                                                <i class="fa-solid fa-cart-shopping"></i>
                                            </Button>
                                        </LinkContainer>
                                    </div>
                                )}
                                <LangSwitcher />
                            </>
                        ) : (<></>)
                        }
                    </>
                ) : (
                    <div style={{ display: "flex" }}>
                        <LinkContainer to={'/sign-in'}>
                            <Button className={headerStyles['btn-join']}>{t('login')}</Button>
                        </LinkContainer>
                        <LangSwitcher />
                    </div>
                )}
            </Nav>
        </Navbar>
    )
}
