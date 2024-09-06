import React, {useState} from 'react';
import {Button, Dropdown, Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import headerStyles from './Header.module.scss';
import {Link, useLocation} from "react-router-dom";

export default function Header(props) {
    const location = useLocation();
    const isAdminPanel = location.pathname === '/adminpanel';
    const [userRole, setUserRole] = useState("manager");
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
                {isAdminPanel && isManager ? (
                    <>
                        <div className={headerStyles['menu-header']}>
                            <LinkContainer to={'/doctors'}>
                                <Button className={headerStyles['btn-header']}>Лікарі</Button>
                            </LinkContainer>
                            <LinkContainer to={'/services'}>
                                <Button className={headerStyles['btn-header']}>Послуги</Button>
                            </LinkContainer>
                            <LinkContainer to={'/users'}>
                                <Button className={headerStyles['btn-header']}>Пацієнти</Button>
                            </LinkContainer>
                            <LinkContainer to={'/reports'}>
                                <Button className={headerStyles['btn-header']}>Звіти</Button>
                            </LinkContainer>
                            <Dropdown>
                                <Dropdown.Toggle className={headerStyles.btnDrop} variant="success" id="dropdown-basic">
                                    Налаштування
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="/settings/hospital">Лікарня</Dropdown.Item>
                                    <Dropdown.Item href="/settings/departments">Відділи</Dropdown.Item>
                                    <Dropdown.Item href="/order-history">Історія замовлень</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </>
                ) : isAdminPanel && isDoctor ? (
                    <>
                        <div className={headerStyles['menu-header']}>
                            <LinkContainer to={'/services'}>
                                <Button className={headerStyles['btn-header']}>Послуги</Button>
                            </LinkContainer>
                            <LinkContainer to={'/users'}>
                                <Button className={headerStyles['btn-header']}>Пацієнти</Button>
                            </LinkContainer>
                            <LinkContainer to={'/reports'}>
                                <Button className={headerStyles['btn-header']}>Звіти</Button>
                            </LinkContainer>
                            <LinkContainer to={'/order-history'}>
                                <Button className={headerStyles['btn-header']}>Історія замовлень</Button>
                            </LinkContainer>
                        </div>
                    </>
                ) : isAdminPanel && isAdmin ? (
                    <>
                        <div className={headerStyles['menu-header']}>
                            <LinkContainer to={'/hospitals'}>
                                <Button className={headerStyles['btn-header']}>Лікарні</Button>
                            </LinkContainer>
                            <LinkContainer to={'/users'}>
                                <Button className={headerStyles['btn-header']}>Пацієнти</Button>
                            </LinkContainer>
                            <LinkContainer to={'/order-history'}>
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
                            <LinkContainer to={'/user/profile'}>
                                <Button className={headerStyles['btn-header']}>Налаштування</Button>
                            </LinkContainer>
                        </div>

                    </>
                ) : (<></>)
                }
                <LinkContainer to={'/sign-in'}>
                    <Button className={headerStyles['btn-join']}>Увійти</Button>
                </LinkContainer>
            </Nav>
        </Navbar>
    );
}
