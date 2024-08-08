import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center">
        <button onClick={() => onPageChange(1)}>&lt;&lt;</button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 disabled:bg-gray-300 rounded-md bg-gray-500 ml-2"
        >
          Previous
        </button>
      </div>
      <span>
        {currentPage} of {totalPages}
      </span>
      <div className="flex items-center">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 disabled:bg-gray-300 rounded-md bg-gray-500"
        >
          Next
        </button>
        <button onClick={() => onPageChange(totalPages)} className="ml-2">
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
