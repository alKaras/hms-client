import React, { useEffect } from 'react';
import Header from '../../../../components/Header';
import HospitalPageStyles from './HospitalPage.module.scss';
import { Button, Spinner, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHospitals } from '../../../../redux/slices/hospitalSlice';
import { LinkContainer } from 'react-router-bootstrap';

export default function HospitalPage({
    specific
}) {
    const dispatch = useDispatch();
    const { isLoading, hospitals, error } = useSelector(state => state.hospital);

    useEffect(() => {
        dispatch(fetchHospitals());
    }, [dispatch]);

    return (
        <>
            <Header />
            <div className={HospitalPageStyles.root}>
                {specific ?
                    <>
                        <div>1 Hospital</div>
                    </> :
                    <>
                        {isLoading === 'loaded' ? (
                            <div className={HospitalPageStyles.contentMany}>
                                <div className='d-flex align-items-center justify-content-end'>
                                    <LinkContainer style={{ color: 'white' }} to={'/adminpanel/hospital/create'}>
                                        <Button className='btn btn-secondary'>Add new hospital</Button>
                                    </LinkContainer>
                                </div>
                                <Table style={{ marginTop: '15px' }} bordered>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Alias</th>
                                            <th>Title</th>
                                            <th>Address</th>
                                            <th>Hospital Phone</th>
                                            <th>Hospital Email</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hospitals.map((hospital) => (
                                            <tr>
                                                <td>{hospital.id}</td>
                                                <td>{hospital.alias}</td>
                                                <td>{hospital.content.title ?? ""}</td>
                                                <td>{hospital.content.address}</td>
                                                <td>{hospital.hospital_phone ?? ""}</td>
                                                <td>{hospital.hospital_email ?? ""}</td>
                                                <td>
                                                    <LinkContainer to={`/adminpanel/hospital/${hospital.id}/edit`}><Button className='btn btn-warning'><i class="fa-solid fa-pen"></i></Button></LinkContainer>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className={"d-flex justify-content-center align-items-center"} style={{ maxHeight: '100vh' }}>
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}

                    </>
                }
            </div>
        </>
    );
}
