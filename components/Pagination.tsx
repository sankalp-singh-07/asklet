import React from "react";
import Image from "next/image";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  leftArrowIcon?: string;
  rightArrowIcon?: string;
  ellipsisIcon?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  leftArrowIcon = "/left_arrow.svg",
  rightArrowIcon = "/right_arrow.svg",
  ellipsisIcon = "/ellipsis.svg",
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 cursor-pointer"
      >
        <Image src={leftArrowIcon} alt="Previous page" width={16} height={16} />
      </button>

      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <div className="flex items-center justify-center w-10 h-10">
              <Image
                src={ellipsisIcon}
                alt="More pages"
                width={16}
                height={16}
                className="text-gray-400"
              />
            </div>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`
                flex cursor-pointer items-center justify-center w-10 h-10 font-medium text-sm transition-colors duration-300 
                ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 cursor-pointer"
      >
        <Image src={rightArrowIcon} alt="Next page" width={16} height={16} />
      </button>
    </div>
  );
};

export default Pagination;
