import React, { useEffect } from 'react'
import Header from '../../components/Header'
import { cancelCheckout } from '../../api/httpApiClient'
import { useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import CancelPageStyles from './Checkout.module.scss';
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
            <div className={CancelPageStyles.root}>
                <div className={CancelPageStyles.contentBlock}>
                    <div style={{ fontSize: '20px', textTransform: 'uppercase', fontWeight: '600' }}>
                        Оплата скасована <i class="fa-regular fa-face-frown"></i>
                    </div>
                    <div className={CancelPageStyles.orderContent}>

                    </div>
                    <div>
                        <p style={{ lineHeight: '150%', marginBottom: '10px' }}>На жаль, вашу оплату не вдалося завершити. Будь ласка, перевірте дані платіжної картки або спробуйте ще раз пізніше.</p>
                        <p>Якщо проблема не вирішується, зверніться до нашої служби підтримки, і ми допоможемо вам з вирішенням питання.</p>
                        <p>Ваше здоров'я для нас важливе, і ми сподіваємось, що ви зможете швидко завершити бронювання.</p>
                        <p>Дякуємо за розуміння. Ми завжди готові допомогти вам!</p>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <img
                                src="/assets/logo/logo.svg"
                                alt="logo"
                                width={40}
                                height={40}
                                className='align-middle' />
                            <p style={{ marginLeft: '15px', fontWeight: 'bold', fontSize: '18px' }}>HMS</p>
                        </div>
                        <div className='d-flex justify-content-between align-items-center gap-5'>
                            <a href='mailto:al.karas.pr@gmail.com'>info@hms.ua</a>
                            <a href='tel:+380500415840'>0800123456</a>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
