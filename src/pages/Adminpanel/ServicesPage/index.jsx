import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header';
import ServicesPageStyles from './ServicesPage.module.scss';
import { Button, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../redux/slices/authSlice';
import { fetchHospitalServices, fetchServicesByDoctorId } from '../../../api/httpApiClient';
import { LinkContainer } from 'react-router-bootstrap';

const ServicesPage = ({ byDoctor, byHospital }) => {

    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const doctorId = isLogged && byDoctor && user.data.doctor.id;
    const hospitalId = isLogged && byHospital && user.hospitalId;

    const [isLoaded, setLoaded] = useState(false);
    const [serviceCollection, setServiceCollection] = useState([]);

    useEffect(() => {
        if (byDoctor) {
            fetchServicesByDoctorId({
                doctor_id: doctorId,
            })
                .then((resp) => {
                    setServiceCollection(resp.data.data);
                    setLoaded(true);
                })
                .catch((err) => {
                    console.error(err);
                })
        } else if (byHospital) {
            fetchHospitalServices({
                hospital_id: hospitalId,
            })
                .then((resp) => {
                    // console.log();
                    setServiceCollection(resp.data.services);
                    setLoaded(true);
                })
                .catch((err) => {
                    console.error(err.response.message);
                })
        }

    }, [doctorId, byDoctor, byHospital, hospitalId]);

    return (
        <>
            <Header />
            <div className={ServicesPageStyles.root}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Ваші послуги</h2>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Department</th>
                            <th>TimeSlots</th>
                        </tr>
                    </thead>
                    <tbody>

                        {isLoaded && serviceCollection.map((item) => (
                            <tr>
                                <td>{item.id}</td>
                                <td>{item.service_name}</td>
                                <td>{item.department}</td>
                                <td style={{ width: '100px', textAlign: 'center' }}>
                                    <LinkContainer to={byDoctor ? `/hospital/service/${item.id}/timeslots` : `/adminpanel/hospital/service/${item.id}/slots`}>
                                        <button className='btn btn-secondary'><i class="fa-solid fa-clock"></i></button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div >
        </>
    )
}

export default ServicesPage;
