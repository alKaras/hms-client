import React from 'react';
import { Button } from 'react-bootstrap';
import PaginationStyles from './Pagination.module.scss';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className={PaginationStyles.root}>
            <Button className={PaginationStyles.button}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <i style={currentPage === 1 ? { color: 'gray' } : { color: 'black' }} class="fa-solid fa-chevron-left"></i>
            </Button>

            <span style={{ margin: '0 15px' }} >Page {currentPage} of {totalPages}</span>

            <Button className={PaginationStyles.button}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}>
                <i style={currentPage === 1 ? { color: 'gray' } : { color: 'black' }} class="fa-solid fa-chevron-right"></i>
            </Button>
        </div>
    );
}