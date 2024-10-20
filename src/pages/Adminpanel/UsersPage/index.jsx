import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { Button, Spinner, Table } from 'react-bootstrap';
import usersPageStyles from './PatientsPage.module.scss';
// import { getUsers } from '../../../redux/slices/userSlice';
import { getUsers } from '../../../api/httpApiClient';
import Pagination from '../../../components/Pagination';
import { LinkContainer } from 'react-router-bootstrap';

export default function UsersPage({
    isDoctor
}) {
    const [users, setUsers] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    console.log(users);
    console.log(isLoading);
    useEffect(() => {
        // dispatch(getUsers({ page: currentPage, perPage: 10 }));
        fetchUsers(currentPage)
    }, [currentPage]);

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
    return (
        <>
            <Header />
            {isLoading ? (
                <>
                    <div className={usersPageStyles.root}>
                        {!isDoctor && (
                            <div className={usersPageStyles.header}>
                                <LinkContainer style={{ color: "white" }} to={'/adminpanel/user/create'}><Button className='btn btn-secondary'>Create User</Button></LinkContainer>
                            </div>
                        )}

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
                                            <td>{obj.email_verified === 'verified' ? <><i style={{ color: "green" }} className="fa-solid fa-check"></i></> : <></>}</td>
                                            <td style={{ textAlign: 'start' }}>{(obj.roles).map((role) => (
                                                <>
                                                    <span className={usersPageStyles.roleBadge}>{role}</span>
                                                </>
                                            ))}
                                            </td>
                                            <td>
                                                {!isDoctor ? (
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
