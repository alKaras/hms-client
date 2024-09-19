import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import editUserStyles from './PatientsPage.module.scss';
import { Button, Col, Row, Spinner, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles, getUser } from '../../../api/httpApiClient';
import { useParams } from 'react-router-dom';
// import { getUser } from '../../../redux/slices/userSlice';
import axios from '../../../utils/axios';

export default function EditUser() {
    const dispatch = useDispatch();
    const { _id } = useParams();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    // const { user, isLoading, error } = useSelector(state => state.user);
    const [isLoading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [UserRoles, setUserRoles] = useState([]);
    const [AllRoles, setAllRoles] = useState([]);
    const [isChanged, setChanged] = useState(false);
    useEffect(() => {
        // dispatch(getUser(_id));
        getUser(_id).then((resp) => {
            setUser(resp.data.data);
            setLoading(true);
        }).catch((err) => {
            setLoading(false);
        });
        fetchRoles().then((resp) => {
            setAllRoles(resp.data);
        });
    }, [dispatch, _id]);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setSurname(user.surname);
            setEmail(user.email);
            setPhone(user.phone);
            setUserRoles(user.roles);
        }
    }, [user]);

    const detachRole = async (role) => {
        await axios.post(`/user/detach-role/${_id}`, { role: role })
            .then((resp) => {
                alert('Role Detached successfully');
                dispatch(getUser(_id));
                setChanged(prev => !prev);
            })
            .catch((err) => {
                alert('Something went wrong');
            })
    }

    const attachRole = async (role) => {
        await axios.post(`/user/attach-role/${_id}`, { role: role })
            .then((resp) => {
                alert('Role attached successfully');
                // setChanged(prev => !prev);
                dispatch(getUser(_id));
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let params;
        if (password !== '') {
            params = { name, surname, password }
        } else {
            params = { name, surname }
        }

        await axios.put(`/user/edit/${_id}`, params)
            .then((data) => {
                alert("User data successfully changed!")
                window.location.reload();
            })
            .catch((err) => {
                alert(err.message)
            });
    }

    return (
        <>

            <Header />
            <div className={editUserStyles.rootEdit}>
                {isLoading ? (
                    <Row>
                        <Col lg={6} md={6} sm={6} className={editUserStyles.left}>
                            <form onSubmit={handleSubmit}>
                                <div className={editUserStyles.content}>
                                    <h1 style={{ fontSize: '18px', marginBottom: '25px' }}> Змінити інформацію про користувача</h1>
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
                                    <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                        <label>Пошта</label>
                                        <input type="text" disabled={true} value={email} />
                                    </div>
                                    <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                        <label>Телефон</label>
                                        <input type="text" disabled={true} value={phone} />
                                    </div>
                                </div>
                                <div className={"d-flex flex-column justify-content-between align-items-start"}>
                                    <label>Пароль</label>
                                    <input className={editUserStyles.pwdInp} type="text" value={password}
                                        onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <button className={'btn btn-primary'} type="submit">Зберегти</button>
                            </form>
                        </Col>
                        <Col className={editUserStyles.right}>
                            <h2 style={{ fontSize: '18px', marginBottom: '25px' }}>Edit User Roles</h2>
                            <div className={editUserStyles.rightUserRoles}>
                                <div style={{ marginBottom: '25px', fontSize: '16px' }}>User Roles</div>
                                <Table style={{ marginBottom: '25px' }} bordered>
                                    <thead>
                                        <tr>
                                            <th>title</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {UserRoles.map((role) => (
                                            <tr>
                                                <td>{role}</td>
                                                <td>
                                                    {role === 'user' ? (<></>) : (
                                                        <Button onClick={() => detachRole(role)} className='btn btn-danger'><i class="fa-solid fa-minus"></i></Button>
                                                    )}

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div>
                                <div style={{ marginBottom: '25px', fontSize: '16px' }}>Suggested Roles</div>
                                <Table style={{ marginBottom: '25px' }} bordered>
                                    <thead>
                                        <tr>
                                            <th>title</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {AllRoles.map((role) => (
                                            <tr>
                                                <td>{role.title}</td>
                                                <td>
                                                    {role.title === 'user' ? (
                                                        <></>
                                                    ) : (<Button onClick={() => attachRole(role.title)} className='btn btn-primary'><i class="fa-solid fa-plus"></i></Button>)}

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row >
                ) : (
                    <div className={"d-flex justify-content-center align-items-center"} style={{ minHeight: '100vh' }}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                )
                }

            </div >
        </>
    );
}