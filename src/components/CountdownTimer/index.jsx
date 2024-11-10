import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ cartCreatedAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(calculateRemainingTime(cartCreatedAt));

    useEffect(() => {
        if (timeLeft <= 0) {
            onExpire();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(calculateRemainingTime(cartCreatedAt));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, cartCreatedAt, onExpire]);

    // Helper function to format the remaining time as minutes and seconds
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div>
            <span style={{ margin: '0', marginLeft: '15px' }}>Час на оформлення:</span> <span>{formatTime(timeLeft)}</span>
        </div>
    );
};

// Helper function to calculate remaining time
const calculateRemainingTime = (cartCreatedAt) => {
    const expirationTime = 15 * 60; // 15 minutes in seconds
    const createdAt = Date.parse(cartCreatedAt);

    if (isNaN(createdAt)) return 0;

    const timeElapsed = Math.floor((Date.now() - createdAt) / 1000);
    return Math.max(expirationTime - timeElapsed, 0);
};

export default CountdownTimer;
