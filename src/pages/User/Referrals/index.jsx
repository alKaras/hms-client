import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import ReferralStyle from './Referrals.module.scss';
import { Button, Modal, Spinner, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReferralById, fetchUserReferrals } from '../../../redux/slices/userReferrals';
import Moment from 'react-moment';

export default function Referrals() {
    const dispatch = useDispatch();
    const { isLoading, userReferrals, referral } = useSelector(state => state.referral);
    const [referralId, setReferralId] = useState(null);
    const [isRefLoaded, setIsRefLoaded] = useState(false);

    useEffect(() => {
        dispatch(fetchUserReferrals());
    }, [dispatch]);

    // const fetchById = async (referral_id) => {
    //     dispatch(fetchReferralById(referral_id));
    // }

    useEffect(() => {
        if (referralId !== null) {
            dispatch(fetchReferralById(referralId)).then(() => setIsRefLoaded(true));
        }
    }, [referralId, dispatch]);


    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setIsRefLoaded(false);
        setReferralId(null);
    };
    const handleShow = async (referral_id) => {
        setReferralId(referral_id);
        setShow(true);
    };
    const referralData = referralId && referral ? referral : null;
    return (
        <>
            <Header />
            <div className={ReferralStyle.root}>
                {isLoading === 'loaded' ? (
                    <Table bordered style={{ verticalAlign: 'middle' }}>
                        <thead>
                            <tr>
                                <th>Referral code</th>
                                <th>Expiration date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userReferrals.map((referral) => (
                                <tr>
                                    <td>{referral.referral_code}</td>
                                    <td><Moment format="DD/MM/YYYY HH:mm:ss">{referral.expired_at}</Moment></td>
                                    <td>
                                        <Button className='btn btn-primary' onClick={() => handleShow(referral.referral_id)}>Show Details</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <div className={"d-flex justify-content-center align-items-center"} style={{ minHeight: '100vh' }}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{isRefLoaded && referralData && referral.referral_code}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {isRefLoaded && referralData ? (
                            <>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Послуги:</div>
                                {(referralData.decoded_data.services).map((obj, index) => (
                                    <div style={{ fontSize: '14px', padding: '5px', marginBottom: '5px' }} key={index}>
                                        {obj.name} [{obj.department}]
                                    </div>
                                ))}

                                {/* <div>Направлення призначене {referralData.decoded_data.user.name} {referralData.decoded_data.user.surname}</div> */}
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Призначено: <span style={{ fontWeight: 'normal' }}>{referralData.decoded_data.user.name} {referralData.decoded_data.user.surname}</span></div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Срок придатності: <span style={{ fontWeight: 'normal' }}><Moment format="DD/MM/YYYY HH:mm:ss">{referral.expired_at}</Moment></span></div>
                            </>
                        ) : (
                            <Spinner animation="border" variant="primary" />
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
}