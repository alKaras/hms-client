import React, { useState } from 'react'
import CartItemStyles from './ShoppingCartItem.module.scss';
import Moment from 'react-moment';
import { getShoppingCart, removeItemFromCart } from '../../api/httpApiClient';

export const ShoppingCartItem = ({
    service_id,
    service_name,
    start_time,
    department,
    price,
    key,
    canRemove
}) => {
    const [removed, setRemoved] = useState(false);
    const removeItem = async (e, id) => {
        e.preventDefault();

        removeItemFromCart(id)
            .then((resp) => {
                alert(resp.data.message);
                setRemoved(true);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    return (
        <>
            <li className={CartItemStyles.root}>
                <div className='d-flex justify-content-between align-items-center'>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>[{service_id}] {service_name}</div>
                    <div style={{ color: 'gray' }}><Moment format='DD.MM.YYYY HH:mm'>{start_time}</Moment></div>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <div style={{ fontSize: '15px' }}>{department}</div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>{price} UAH</div>
                </div>
                {canRemove ? (<button onClick={(e) => removeItem(e, key)}>Видалити</button>) : (<></>)}
            </li>
        </>
    )
}
