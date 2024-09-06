import React from 'react';
import ReviewCardStyles from './ReviewCard.module.scss';

export default function ReviewCard({author, content, createdAt, rating}) {
    const stars = Array(rating).fill(0);
    return (
        <div className={ReviewCardStyles.root}>
            <div className={ReviewCardStyles.headingContent}>
                <div className={ReviewCardStyles.heading}>{author}</div>
                <ul className={ReviewCardStyles.starsContainer}>
                    {stars.map((_, index) => (
                        <li key={index}><i className="fa-solid fa-star"></i></li>
                    ))}
                </ul>
            </div>
            <div className={ReviewCardStyles.body}>
                {content}
            </div>
            <div className={ReviewCardStyles.footer}>
                {createdAt}
            </div>
        </div>
    );
}
