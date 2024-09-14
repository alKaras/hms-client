import React from 'react';
import { Button } from 'react-bootstrap';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div>
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}>
                Next
            </Button>
        </div>
    );
}