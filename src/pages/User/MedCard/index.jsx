import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import MedcardStyles from './MedCard.module.scss'
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../redux/slices/authSlice';
import { fetchUserMedCard } from '../../../api/httpApiClient.js';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export const MedCard = () => {
    const [loaded, setLoaded] = useState(false);

    const [medcardData, setMedcardData] = useState(null);
    const user = useSelector(infoAboutUser);
    const isLogged = useSelector(selectIsLogged);
    const userId = isLogged && user.id;
    const [noRecord, setNoRecord] = useState(false);

    useEffect(() => {
        fetchUserMedCard({
            user_id: userId,
        })
            .then((resp) => {
                console.log(resp.data.data);
            })
            .catch((err) => {
                console.error(err);
                if (err.response.status === 404) {
                    setNoRecord(true);
                }
            })
    }, [userId])


    return (
        <>
            <Header />
            {noRecord && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', overflow: 'hidden', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>На жаль ваша медична картка не створена або не заповнена</h2>
                            <LinkContainer to={'/user/medcard/create'} style={{ color: 'white' }}>
                                <Button className='btn btn-secondary'>Заповнити</Button>
                            </LinkContainer>
                        </div>
                    </div>
                </>
            )}
            <div className={MedcardStyles.root}>

            </div>
        </>
    )
}
