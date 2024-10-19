import React from 'react'
import { useAccordionButton } from 'react-bootstrap';
import togglerStyle from './ServiceToggler.module.scss';

export const ServiceToggler = ({ children, eventKey, orderId, amountServices }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => (console.log('clicked')));
    return (
        <>
            <div className={togglerStyle.root}>
                <div className={togglerStyle.content}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Замовлення: {orderId}</div>
                    <div>К-сть послуг: {amountServices}</div>
                </div>
                <button className={togglerStyle['btn-toggler']} type="button"
                    onClick={decoratedOnClick}>
                    {children}
                </button>
            </div>
        </>
    )
}
