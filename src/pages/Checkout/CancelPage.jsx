import React, { useEffect } from 'react'
import Header from '../../components/Header'
import { cancelCheckout } from '../../api/httpApiClient'
import { Link, useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import CancelPageStyles from './Checkout.module.scss';
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation();
    return (
        <>
            <div className={CancelPageStyles.root}>
                <div className={CancelPageStyles.contentBlock}>
                    <div style={{ fontSize: '20px', textTransform: 'uppercase', fontWeight: '600' }}>
                        {t('canceled')} <i class="fa-regular fa-face-frown"></i>
                    </div>
                    <div>
                        <p style={{ lineHeight: '150%', marginBottom: '10px' }}>{t('msg1')}</p>
                        <p>{t('msg2')}</p>
                        <p>{t('msg3')}</p>
                        <p>{t('msg4')}</p>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div>
                            <Link className='d-flex justify-content-between align-items-center' to={'/'}>
                                <img
                                    src="/assets/logo/logo.svg"
                                    alt="logo"
                                    width={40}
                                    height={40}
                                    className='align-middle' />

                                <p style={{ marginLeft: '15px', fontWeight: 'bold', fontSize: '18px' }}>HMS</p>
                            </Link>
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
