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
import { useState, useEffect } from "react";
import QuestionBlock from "@/components/QuestionBlock";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    username: string;
    reputation: number;
    avatar?: string;
  };
  answerCount: number;
  voteScore: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  acceptedAnswer?: string;
}

interface PaginationData {
  current: number;
  pages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface QuestionsResponse {
  questions: Question[];
  pagination: PaginationData;
}

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilter, setSelectedFilter] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const filterOptions = [
    { key: "newest", label: "Newest", desc: "Most recent questions" },
    { key: "oldest", label: "Oldest", desc: "Oldest questions first" },
    {
      key: "votes",
      label: "Most Votes",
      desc: "Questions with highest vote count",
    },
    { key: "views", label: "Most Views", desc: "Questions with most views" },
  ];

  useEffect(() => {
    const filter = searchParams.get("sort") || "newest";
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const page = parseInt(searchParams.get("page") || "1");

    setSelectedFilter(filter);
    setSearchQuery(search || tag);
    setCurrentPage(page);
  }, [searchParams]);

  const updateURL = (filter: string, search: string, page: number) => {
    const params = new URLSearchParams();
    if (filter !== "newest") params.set("sort", filter);
    if (search) params.set("search", search);
    if (page !== 1) params.set("page", page.toString());

    const newURL = params.toString() ? `/?${params.toString()}` : "/";
    window.history.replaceState({}, "", newURL);
  };

  const fetchQuestions = async (
    filter: string,
    search: string,
    page: number
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sort: filter,
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(`/api/questions?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: QuestionsResponse = await response.json();

      setQuestions(data.questions);
      setPagination(data.pagination);
      updateURL(filter, search, page);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions. Please try again.");
      setQuestions([]);
      setPagination({
        current: 1,
        pages: 1,
        total: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(selectedFilter, searchQuery, currentPage);
  }, [selectedFilter, currentPage]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (currentPage === 1) {
        fetchQuestions(selectedFilter, searchQuery, 1);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getResultsSummary = () => {
    if (isLoading) return "";

    const start = (pagination.current - 1) * 10 + 1;
    const end = Math.min(pagination.current * 10, pagination.total);

    let summary = `Showing ${start}-${end} of ${pagination.total} questions`;

    if (searchQuery) {
      summary += ` for "${searchQuery}"`;
    }

    return summary;
  };

  const getSelectedFilterLabel = () => {
    const filter = filterOptions.find((f) => f.key === selectedFilter);
    return filter ? filter.label : "Newest";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      return "just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <section className="flex flex-col md:flex-row lg:flex-row items-start sm:items-center lg:items-center gap-3 sm:gap-4">
          <Link href="/post-question">
            <Button className="w-full md:w-auto text-sm sm:text-base">
              Ask New Question
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex justify-center md:justify-between w-full md:w-auto min-w-[200px] text-sm sm:text-base">
                <span className="mr-2 truncate">
                  {getSelectedFilterLabel()}
                </span>
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

              {filterOptions.map((filter) => (
                <DropdownMenuItem
                  key={filter.key}
                  className="px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 rounded-md transition-colors focus:bg-gray-100"
                  onClick={() => handleFilterChange(filter.key)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{filter.label}</span>
                    <span className="text-xs text-gray-500">{filter.desc}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <SearchBar
            placeholder="Search questions, topics, or keywords..."
            onSearch={handleSearch}
            className="w-full sm:flex-1 lg:max-w-2xl"
          />
        </section>

        {!isLoading && !error && (
          <div className="flex justify-between items-center text-sm text-gray-600 border-b border-gray-200 pb-4">
            <span>{getResultsSummary()}</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-900 hover:text-gray-600 underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() =>
                fetchQuestions(selectedFilter, searchQuery, currentPage)
              }
              className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        )}

        <section className="space-y-4 sm:space-y-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : questions.length > 0 ? (
            questions.map((question) => (
              <QuestionBlock
                key={question._id}
                id={question._id}
                title={question.title}
                description={question.description}
                tags={question.tags}
                author={question.author.username}
                image={question.author.avatar || "/user_placeholder.svg"}
                reply_num={question.answerCount}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33l-.147-.15a.857.857 0 011.214-1.207l.147.15A6.115 6.115 0 0012 13.5c1.847 0 3.577-.81 4.866-2.207l.147-.15a.857.857 0 111.214 1.207l-.147.15z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No questions found
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? `No questions match "${searchQuery}". Try adjusting your search terms.`
                  : "No questions available yet. Be the first to ask a question!"}
              </p>
              <Link href="/post-question">
                <Button className="mt-4">Ask the First Question</Button>
              </Link>
            </div>
          )}
        </section>

        {!isLoading && !error && pagination.pages > 1 && (
          <section className="flex justify-center py-6 sm:py-8">
            <Pagination
              currentPage={pagination.current}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
              leftArrowIcon={left_arrow}
              rightArrowIcon={right_arrow}
              ellipsisIcon={ellipsis}
            />
          </section>
        )}
      </div>
    </div>
  );
}
