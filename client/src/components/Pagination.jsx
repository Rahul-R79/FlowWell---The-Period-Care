//pagination button
import { Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";

const PaginationButton = ({
    currentPage,
    totalPages,
    onPageChange,
    maxButtons = 4,
}) => {
    if (totalPages <= 1) return null;

    const [startPage, setStartPage] = useState(1);

    const visiblePages = Array.from(
        { length: Math.min(maxButtons, totalPages - startPage + 1) },
        (_, i) => startPage + i
    );

    const handleNextChunk = () => {
        const nextStart = startPage + maxButtons;
        if (nextStart <= totalPages) {
            setStartPage(nextStart);
            onPageChange(nextStart);
        }
    };

    const handlePrevChunk = () => {
        const prevStart = startPage - maxButtons;
        if (prevStart >= 1) {
            setStartPage(prevStart);
            onPageChange(prevStart);
        }
    };

    useEffect(() => {
        if (currentPage < startPage) setStartPage(currentPage);
        else if (currentPage > startPage + maxButtons - 1) {
            setStartPage(currentPage);
        }
    }, [currentPage, startPage, maxButtons]);

    return (
        <Pagination className='justify-content-center'>
            <Pagination.Prev
                onClick={handlePrevChunk}
                disabled={startPage === 1}
            />

            {visiblePages.map((page) => (
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => onPageChange(page)}>
                    {page}
                </Pagination.Item>
            ))}

            <Pagination.Next
                onClick={handleNextChunk}
                disabled={startPage + maxButtons - 1 >= totalPages}
            />
        </Pagination>
    );
};

export default PaginationButton;
