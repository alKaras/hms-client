import React, { useEffect } from 'react'
import Header from '../../components/Header'
import { cancelCheckout } from '../../api/httpApiClient'
import { useLocation } from 'react-router-dom';

export const CancelPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    useEffect(() => {
        cancelCheckout({
            session_id: sessionId
        })
            .then((resp) => {
                alert(resp.data.message);
            })
            .catch((err) => {
                console.error(err);
            })
    }, []);
    return (
        <>
            <Header />


        </>
    )
}
