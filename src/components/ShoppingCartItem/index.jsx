import React, { useState } from 'react'
import CartItemStyles from './ShoppingCartItem.module.scss';
import Moment from 'react-moment';
import { downloadPdfTimeslot, getShoppingCart, removeItemFromCart } from '../../api/httpApiClient';
import { useTranslation } from 'react-i18next';

export const ShoppingCartItem = ({
    service_id,
    service_name,
    start_time,
    department,
    price,
    key,
    id,
    canRemove,
    canDownload
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

    const downloadItem = async (e, id) => {
        e.preventDefault();
        downloadPdfTimeslot(id)
            .then((resp) => {
                const file = new Blob([resp.data], {
                    type: 'application/pdf',
                });

                const link = document.createElement('a');

                link.href = window.URL.createObjectURL(file);

                link.download = `timeslot-${id}.pdf`;

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
            })
            .catch((err) => console.error(err.response));

    }

    const { t } = useTranslation();

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
                {canDownload ? (<button onClick={(e) => downloadItem(e, id)}><i class="fa-solid fa-download"></i></button>) : (<></>)}
                {canRemove ? (<button onClick={(e) => removeItem(e, key)}>{t('delete')}</button>) : (<></>)}
            </li>
        </>
    )
}
