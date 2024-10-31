import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import ReferralStyle from './Referrals.module.scss';
import { Button, Modal, Spinner, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchReferralById, fetchUserReferrals } from '../../../redux/slices/userReferrals';
import Moment from 'react-moment';
import { fetchReferralById, fetchUserReferrals } from '../../../api/httpApiClient';
import { useTranslation } from 'react-i18next';

export default function Referrals() {
    const dispatch = useDispatch();

    const [isLoaded, setLoaded] = useState(false);
    const [userReferrals, setReferrals] = useState([]);
    const [referral, setReferral] = useState(null);
    const [referralId, setReferralId] = useState(null);
    const [isRefLoaded, setIsRefLoaded] = useState(false);

    useEffect(() => {
        fetchUserReferrals()
            .then((resp) => {
                setLoaded(true);
                setReferrals(resp.data.data);
            })
            .catch((err) => {
                setLoaded(false);
                console.log(err);
            });
    }, []);

    // const fetchById = async (referral_id) => {
    //     dispatch(fetchReferralById(referral_id));
    // }

    useEffect(() => {
        if (referralId !== null) {
            fetchReferralById(referralId).then((resp) => {
                setIsRefLoaded(true);
                setReferral(resp.data.data);
            }).catch((err) => setIsRefLoaded(false));
        }
    }, [referralId]);


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
    const { t } = useTranslation();
    return (
        <>
            <Header />
            <div className={ReferralStyle.root}>
                {isLoaded ? (
                    <Table bordered style={{ verticalAlign: 'middle' }}>
                        <thead>
                            <tr>
                                <th>{t('referralNum')}</th>
                                <th>{t('expdate')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userReferrals.map((referral) => (
                                <tr>
                                    <td>{referral.referral_code}</td>
                                    <td><Moment format="DD/MM/YYYY HH:mm:ss">{referral.expired_at}</Moment></td>
                                    <td>
                                        <Button className='btn btn-primary' onClick={() => handleShow(referral.referral_id)}>{t('seeMore')}</Button>
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
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>{t('services')}:</div>
                                {(referralData.decoded_data.services).map((obj, index) => (
                                    <div style={{ fontSize: '14px', padding: '5px', marginBottom: '5px' }} key={index}>
                                        {obj.name} [{obj.department}]
                                    </div>
                                ))}

                                {/* <div>Направлення призначене {referralData.decoded_data.user.name} {referralData.decoded_data.user.surname}</div> */}
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>{t('assignedTo')}: <span style={{ fontWeight: 'normal' }}>{referralData.decoded_data.user.name} {referralData.decoded_data.user.surname}</span></div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>{t('expdate')}: <span style={{ fontWeight: 'normal' }}><Moment format="DD/MM/YYYY HH:mm:ss">{referral.expired_at}</Moment></span></div>
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