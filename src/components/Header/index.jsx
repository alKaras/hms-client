import React, {useState} from 'react';
import {Button, Dropdown, Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import headerStyles from './Header.module.scss';
import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {infoAboutUser, selectIsLogged} from "../../redux/slices/authSlice";

export default function Header(props) {
    const location = useLocation();
    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const isAdminPanel = location.pathname === '/adminpanel';

    const [userRole, setUserRole] = useState("user");
    const isManager = userRole === "manager";
    const isUser = userRole === "user";
    const isAdmin = userRole === "admin";
    const isDoctor = userRole === "doctor";

    return (
        <Navbar expand="md" className={`${headerStyles.root} d-flex justify-content-between fixed-top`}>
            <LinkContainer to={'/'}>
                <Navbar.Brand className='d-flex align-items-center'>
                    <img
                        src="/assets/logo/logo.svg"
                        alt="logo"
                        width={50}
                        height={50}
                        className='align-middle'/>
                    <p className={headerStyles['brand-text']}>HMS</p>
                </Navbar.Brand>
            </LinkContainer>
            <Nav>
                {isLogged ? (
                    <>

                        {isAdminPanel && isManager ? (
                            <>
                                <div className={headerStyles['menu-header']}>
                                    <LinkContainer to={'/adminpanel/doctors'}>
                                        <Button className={headerStyles['btn-header']}>Лікарі</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/services'}>
                                        <Button className={headerStyles['btn-header']}>Послуги</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/users'}>
                                        <Button className={headerStyles['btn-header']}>Пацієнти</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/reports'}>
                                        <Button className={headerStyles['btn-header']}>Звіти</Button>
                                    </LinkContainer>
                                    <Dropdown>
                                        <Dropdown.Toggle className={headerStyles.btnDrop} variant="success"
                                                         id="dropdown-basic">
                                            Налаштування
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item href="/adminpanel/settings/hospital">Лікарня</Dropdown.Item>
                                            <Dropdown.Item
                                                href="/adminpanel/settings/departments">Відділи</Dropdown.Item>
                                            <Dropdown.Item href="/adminpanel/order-history">Історія
                                                замовлень</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </>
                        ) : isAdminPanel && isDoctor ? (
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
                            </>
                        ) : isAdminPanel && isAdmin ? (
                            <>
                                <div className={headerStyles['menu-header']}>
                                    <LinkContainer to={'/adminpanel/hospitals'}>
                                        <Button className={headerStyles['btn-header']}>Лікарні</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/users'}>
                                        <Button className={headerStyles['btn-header']}>Пацієнти</Button>
                                    </LinkContainer>
                                    <LinkContainer to={'/adminpanel/order-history'}>
                                        <Button className={headerStyles['btn-header']}>Історія замовлень</Button>
                                    </LinkContainer>
                                </div>
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
                                        <LinkContainer to={'/user/profile'}>
                                            <Button className={headerStyles.profileBadge}>
                                                <div className={headerStyles.title}>Oleksandr Karas</div>
                                                <div className={headerStyles.image}>
                                                    <img src="/assets/profile.jpg" alt="profile"/>
                                                </div>
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
