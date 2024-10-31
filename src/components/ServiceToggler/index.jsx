import React from 'react'
import { useAccordionButton } from 'react-bootstrap';
import togglerStyle from './ServiceToggler.module.scss';
import { useTranslation } from 'react-i18next';

export const ServiceToggler = ({ children, eventKey, orderId, status, amountServices }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => (console.log('clicked')));
    const { t } = useTranslation();
    return (
        <>
            <div className={`${togglerStyle.root}`} style={status === 'СКАСОВАНО' ? { color: 'gray' } : {}}>
                <div className={togglerStyle.content}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('order')}: {orderId}</div>
                    <div>{t('numofservices')}: {amountServices}</div>
                </div>
                <div className={togglerStyle.content} style={{ marginBottom: 0 }}>
                    <div>
                        {status}
                    </div>
                    <button className={togglerStyle['btn-toggler']} type="button"
                        onClick={decoratedOnClick}>
                        {children}
                    </button>
                </div>

            </div>
        </>
    )
}
