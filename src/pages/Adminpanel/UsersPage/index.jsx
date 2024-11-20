import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { Button, Spinner, Table } from 'react-bootstrap';
import usersPageStyles from './PatientsPage.module.scss';
// import { getUsers } from '../../../redux/slices/userSlice';
import { getUsers } from '../../../api/httpApiClient';
import Pagination from '../../../components/Pagination';
import { LinkContainer } from 'react-router-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged, selectRoles } from '../../../redux/slices/authSlice';

export default function UsersPage({
    isDoctor
}) {
    const [users, setUsers] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    console.log(users);
    console.log(isLoading);

    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        // dispatch(getUsers({ page: currentPage, perPage: 10 }));
        fetchUsers(currentPage)
    }, [currentPage]);

    const user = useSelector(infoAboutUser);
    const isLogged = useSelector(selectIsLogged);
    const roles = useSelector(selectRoles);
    const isManager = isLogged && user.roles === 'manager';

    const fetchUsers = async (page) => {
        setLoading(false);
        getUsers({ page, perPage: 10 })
            .then((resp) => {
                setLoading(true);
                setCurrentPage(resp.data.meta.current_page);
                setTotalPages(resp.data.meta.last_page);
                setUsers(resp.data.data);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            })

    }

    const handlePageChange = (page) => {
        // dispatch(getUsers({ page, perPage: 10 }));
        if (page !== currentPage) {
            setCurrentPage(page);
            console.log("CurrentPage: " + currentPage);
        }
        // getUsers({ page: page, perPage: 10 });
    }
    const { t } = useTranslation();
    return (
        <>
            <Header />
            {isLoading ? (
                <>
                    <div className={usersPageStyles.root}>
                        {!isDoctor && (
                            <div className={usersPageStyles.header}>
                                <LinkContainer style={{ color: "white" }} to={'/adminpanel/user/create'}><Button className='btn btn-secondary'>{t('create')}</Button></LinkContainer>
                            </div>
                        )}

                        <Table bordered className={usersPageStyles.table}>
                            <thead>
                                <th>ID</th>
                                <th>{t('firstname')}</th>
                                <th>{t('lastname')}</th>
                                <th>{t('email')}</th>
                                <th>{t('phone')}</th>
                                <th>{t('verifiedStatus')}</th>
                                <th>{t('roles')}</th>
                                <th>{t('actions')}</th>
                            </thead>
                            <tbody>
                                {users.map((obj, index) => (
                                    <>
                                        <tr>
                                            <td>{obj.id}</td>
                                            <td>{obj.name}</td>
                                            <td>{obj.surname}</td>
                                            <td>{obj.email}</td>
                                            <td>{obj.phone}</td>
                                            <td>{obj.email_verified === 'verified' ? <><i style={{ color: "green" }} className="fa-solid fa-check"></i></> : <></>}</td>
                                            <td style={{ textAlign: 'start' }}>{(obj.roles).map((role) => (
                                                <>
                                                    <span className={usersPageStyles.roleBadge}>{role}</span>
                                                </>
                                            ))}
                                            </td>
                                            <td>
                                                {isManager ? (<></>) : !isDoctor ? (
                                                    <LinkContainer style={{ color: 'black' }} to={`/adminpanel/user/${obj.id}/edit`}>
                                                        <button className='btn btn-warning'><i className="fa-solid fa-pen"></i></button>
                                                    </LinkContainer>
                                                ) : (
                                                    <>
                                                        {!obj.roles.includes('doctor', 'manager', 'admin') && (
                                                            <LinkContainer to={`/adminpanel/user/${obj.id}/referral`}>
                                                                <button className='btn btn-primary'><i class="fa-solid fa-file-contract"></i></button>
                                                            </LinkContainer>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr >
                                    </>
                                ))}
                            </tbody>
                        </Table>
                        <Pagination

                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}

                        />
                    </div>

                </>

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
