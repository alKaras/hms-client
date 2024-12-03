import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CountdownTimer = ({ cartCreatedAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(calculateRemainingTime(cartCreatedAt));
    const { i18n } = useTranslation();
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
    }, []);

    useEffect(() => {

        const updateTimeLeft = () => {
            const remainingTime = calculateRemainingTime(cartCreatedAt);
            setTimeLeft(remainingTime);

            if (remainingTime <= 0) {
                onExpire();
            }
        };
        updateTimeLeft();

        const timer = setInterval(updateTimeLeft, 1000);
        return () => clearInterval(timer);

    }, [cartCreatedAt, onExpire]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const { t } = useTranslation();
    return (
        <div>
            <span style={{ margin: '0', marginLeft: '15px' }}>{t('processTime')}</span><span>{formatTime(timeLeft)}</span>
        </div>
    );
};

const calculateRemainingTime = (cartCreatedAt) => {
    const expirationTime = 15 * 60;
    const createdAt = Date.parse(cartCreatedAt);

    if (isNaN(createdAt)) return 0;

    const timeElapsed = Math.floor((Date.now() - createdAt) / 1000);
    return Math.max(expirationTime - timeElapsed, 0);
};

export default CountdownTimer;
