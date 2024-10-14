import React, { useState } from 'react';
import CardCheckboxStyles from './CardCheckbox.module.scss'; // Import custom styles

export const CardCheckbox = ({ isSelected, service, toggleSelection }) => {
    return (
        <div
            className={`${CardCheckboxStyles['card-checkbox-container']} ${isSelected ? CardCheckboxStyles.checked : ''}`} onClick={() => toggleSelection(service.id)}
        >
            <div className={`${CardCheckboxStyles['card-content']}`}>
                <div className={`${CardCheckboxStyles['card-details']}`}>
                    <h4>[{service.id}] {service.service_name}</h4>
                    <p style={{ color: 'gray' }}>{service.department}</p>
                </div>
            </div>
        </div>
    );
};