import React, { useEffect } from 'react';
import Header from '../../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner, Table } from 'react-bootstrap';
import usersPageStyles from './PatientsPage.module.scss';
import { getUsers } from '../../../redux/slices/userSlice';
import Pagination from '../../../components/Pagination';
import { LinkContainer } from 'react-router-bootstrap';

export default function UsersPage() {
    const dispatch = useDispatch();
    const { users, currentPage, totalPages, isLoading, error } = useSelector(state => state.user);
    console.log(users);
    console.log(isLoading);
    useEffect(() => {
        dispatch(getUsers({ page: currentPage, perPage: 10 }));
    }, []);

    const handlePageChange = (page) => {
        dispatch(getUsers({ page, perPage: 10 }));
    }
    return (
        <>
            <Header />
            {isLoading === 'loaded' ? (
                <>
                    <div className={usersPageStyles.root}>
                        <div className={usersPageStyles.header}>
                            <LinkContainer style={{ color: "white" }} to={'/adminpanel/user/create'}><Button className='btn btn-secondary'>Create User</Button></LinkContainer>
                        </div>
                        <Table bordered className={usersPageStyles.table}>
                            <thead>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Verified</th>
                                <th>Roles</th>
                                <th>Actions</th>
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
                                            <td>{obj.email_verified === 'verified' ? <><i style={{ color: "green" }} class="fa-solid fa-check"></i></> : <></>}</td>
                                            <td style={{ textAlign: 'start' }}>{(obj.roles).map((role) => (
                                                <>
                                                    <span className={usersPageStyles.roleBadge}>{role}</span>
                                                </>
                                            ))}</td>
                                            <td>
                                                <LinkContainer style={{ color: 'black' }} to={`/adminpanel/user/${obj.id}/edit`}>
                                                    <button className='btn btn-warning'><i class="fa-solid fa-pen"></i></button>
                                                </LinkContainer>
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
