import React from 'react';
import { Button } from 'react-bootstrap';
import PaginationStyles from './Pagination.module.scss';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className={PaginationStyles.root}>
            {/* First page button */}
            <Button
                className={PaginationStyles.button}
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                style={{ marginRight: '10px' }}
            >
                <i className="fa-solid fa-angles-left" style={currentPage === 1 ? { color: 'gray' } : { color: 'black' }}></i>
            </Button>
            <Button className={PaginationStyles.button}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <i style={currentPage === 1 ? { color: 'gray' } : { color: 'black' }} class="fa-solid fa-chevron-left"></i>
            </Button>

            <span style={{ margin: '0 15px' }} >{currentPage} / {totalPages}</span>

            <Button className={PaginationStyles.button}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}>
                <i style={currentPage === 1 ? { color: 'gray' } : { color: 'black' }} class="fa-solid fa-chevron-right"></i>
            </Button>
            {/* Last page button */}
            <Button
                className={PaginationStyles.button}
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                style={{ marginLeft: '10px' }}
            >
                <i className="fa-solid fa-angles-right" style={currentPage === totalPages ? { color: 'gray' } : { color: 'black' }}></i>
            </Button>
        </div>
    );
}