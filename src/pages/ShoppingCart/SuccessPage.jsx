import React, { useEffect } from 'react'
import Header from '../../components/Header'
import { getOrderByFilter } from '../../api/httpApiClient';
import { useLocation } from 'react-router-dom';

export const SuccessPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id') ?? null;
    const orderId = queryParams.get('order_id') ?? null;
    useEffect(() => {
        let params = {};
        if (sessionId) params.session_id = sessionId
        if (orderId) params.order_id = orderId
        getOrderByFilter(params)
            .then((resp) => {
                console.log(resp.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [])
    return (
        <>
            <Header />
            <div>
                1
            </div>

        </>
    )
}
