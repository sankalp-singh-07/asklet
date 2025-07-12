"use client";

import Button from "@/components/Button";
import Image from "next/image";
import down_arrow from "@/public/down_arrow.svg";
import left_arrow from "@/public/left_arrow.svg";
import right_arrow from "@/public/right_arrow.svg";
import ellipsis from "@/public/ellipsis.svg";
import SearchBar from "@/components/SearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import QuestionBlock from "@/components/QuestionBlock";
import Pagination from "@/components/Pagination";

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState("Newest Unanswered");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <section className="flex flex-col md:flex-row lg:flex-row items-start sm:items-center lg:items-center gap-3 sm:gap-4">
          <Button className="w-full md:w-auto text-sm sm:text-base">
            Ask New Question
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex justify-center md:justify-between w-full md:w-auto min-w-[200px] text-sm sm:text-base">
                <span className="mr-2 truncate">{selectedFilter}</span>
                <Image
                  src={down_arrow}
                  alt=""
                  width={16}
                  height={16}
                  className="transition-transform duration-200 group-data-[state=open]:rotate-180 flex-shrink-0"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="!min-w-[84vw] sm:!min-w-[87vw] md:!min-w-[250px] bg-white border border-gray-200 shadow-lg rounded-lg p-1"
              align="start"
            >
              <DropdownMenuLabel className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />

              <DropdownMenuItem
                className="px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 rounded-md transition-colors focus:bg-gray-100"
                onClick={() => handleFilterChange("Newest Unanswered")}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Newest Unanswered</span>
                  <span className="text-xs text-gray-500">
                    Most recent questions without answers
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 rounded-md transition-colors focus:bg-gray-100"
                onClick={() => handleFilterChange("Most Votes")}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Most Votes</span>
                  <span className="text-xs text-gray-500">
                    Questions with highest vote count
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 rounded-md transition-colors focus:bg-gray-100"
                onClick={() => handleFilterChange("Most Answers")}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Most Answers</span>
                  <span className="text-xs text-gray-500">
                    Questions with most responses
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 rounded-md transition-colors focus:bg-gray-100"
                onClick={() => handleFilterChange("Recently Active")}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Recently Active</span>
                  <span className="text-xs text-gray-500">
                    Questions with recent activity
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-gray-100" />

              <DropdownMenuItem
                className="px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 rounded-md transition-colors focus:bg-gray-100"
                onClick={() => handleFilterChange("Oldest Unanswered")}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Oldest Unanswered</span>
                  <span className="text-xs text-gray-500">
                    Questions needing attention
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 rounded-md transition-colors focus:bg-gray-100"
                onClick={() => handleFilterChange("My Questions")}
              >
                <div className="flex flex-col">
                  <span className="font-medium">My Questions</span>
                  <span className="text-xs text-gray-500">
                    Questions you've asked
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <SearchBar
            placeholder="Search questions, topics, or keywords..."
            onSearch={handleSearch}
            className="w-full sm:flex-1 lg:max-w-2xl"
          />
        </section>

        <section className="space-y-4 sm:space-y-6">
          <QuestionBlock
            title="How to join 2 columns inside a new and pretty good person"
            description="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. "
            tags={["React", "JavaScript", "CSS"]}
            author="John Doe"
            image="/user_placeholder.svg"
            reply_num={5}
          />
        </section>

        <section className="flex justify-center py-6 sm:py-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            leftArrowIcon={left_arrow}
            rightArrowIcon={right_arrow}
            ellipsisIcon={ellipsis}
          />
        </section>
      </div>
    </div>
  );
}
