import React, { useEffect, useState } from 'react';
import { Badge, Button, Dropdown, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import headerStyles from './Header.module.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { infoAboutUser, logout, selectIsLogged, selectStatus } from "../../redux/slices/authSlice";

export default function Header() {
    const location = useLocation();
    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const hospitalId = isLogged && user.hospitalId;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAdminPanel = location.pathname === '/adminpanel';
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
            <LinkContainer to={isUser ? '/' : '/adminpanel'}>
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
                                        <Button className={headerStyles['btn-header']}>Пацієнти</Button>
                                    </LinkContainer>
                                    {/* <LinkContainer to={'/adminpanel/reports'}>
                                        <Button className={headerStyles['btn-header']}>Звіти</Button>
                                    </LinkContainer> */}
                                    <Dropdown>
                                        <Dropdown.Toggle className={headerStyles.btnDrop} variant="success"
                                            id="dropdown-basic">
                                            Налаштування
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item href={`/adminpanel/settings/${hospitalId}/hospital`}>Лікарня</Dropdown.Item>
                                            <Dropdown.Item href="/adminpanel/hospital/order-history">Історія
                                                замовлень</Dropdown.Item>
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
                                                <Dropdown.Item id={'headerDropItem'} className={`${headerStyles['drop-link']}`}>Профіль</Dropdown.Item>
                                            </LinkContainer>
                                            <Dropdown.Item onClick={logOutHandler} className={`${headerStyles['drop-link']}`}>Вийти</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </>
                        ) : isDoctor ? (
                            <>
                                <div className={headerStyles['menu-header']}>
                                    <LinkContainer to={'/adminpanel/services'}>
                                        <Button className={headerStyles['btn-header']}>Послуги</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/users'}>
                                        <Button className={headerStyles['btn-header']}>Пацієнти</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/reports'}>
                                        <Button className={headerStyles['btn-header']}>Звіти</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/order-history'}>
                                        <Button className={headerStyles['btn-header']}>Історія замовлень</Button>
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
                                            <Dropdown.Item id={'headerDropItem'} className={`${headerStyles['drop-link']}`}>Профіль</Dropdown.Item>
                                        </LinkContainer>
                                        <Dropdown.Item onClick={logOutHandler} className={`${headerStyles['drop-link']}`}>Вийти</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        ) : isAdminPanel || isAdmin ? (
                            <>
                                <div className={headerStyles['menu-header']}>
                                    <LinkContainer to={'/adminpanel/hospitals'}>
                                        <Button className={headerStyles['btn-header']}>Лікарні</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/users'}>
                                        <Button className={`${headerStyles['btn-header']} ${location.pathname === '/adminpanel/users' ? headerStyles['visited'] : ''}`}>
                                            Пацієнти
                                        </Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/order-history'}>
                                        <Button className={headerStyles['btn-header']}>Історія замовлень</Button>
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
                                            <Dropdown.Item id={'headerDropItem'} className={`${headerStyles['drop-link']}`}>Профіль</Dropdown.Item>
                                        </LinkContainer>
                                        <Dropdown.Item onClick={logOutHandler} className={`${headerStyles['drop-link']}`}>Вийти</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        ) : !isAdminPanel && isUser ? (
                            <>
                                <div className={headerStyles['menu-header']}>
                                    <LinkContainer to={'/'}>
                                        <Button className={headerStyles['btn-header']}>Головна</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/user/services'}>
                                        <Button className={headerStyles['btn-header']}>Мої послуги</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/user/referrals'}>
                                        <Button className={headerStyles['btn-header']}>Мої направлення</Button>
                                    </LinkContainer>
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
                                                <Dropdown.Item className={`${headerStyles['drop-link']}`}>Профіль</Dropdown.Item>
                                            </LinkContainer>
                                            <Dropdown.Item onClick={logOutHandler} className={`${headerStyles['drop-link']}`}>Вийти</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className={headerStyles.cartContent}>
                                    <LinkContainer to={'/shoppingcart'} >
                                        <Button className={headerStyles.cart}>
                                            <i class="fa-solid fa-cart-shopping"></i>
                                        </Button>
                                    </LinkContainer>
                                </div>
                            </>
                        ) : (<></>)
                        }
                    </>
                ) : (
                    <>
                        <LinkContainer to={'/sign-in'}>
                            <Button className={headerStyles['btn-join']}>Увійти</Button>
                        </LinkContainer>
                    </>
                )}
            </Nav>
        </Navbar>
    )
}
