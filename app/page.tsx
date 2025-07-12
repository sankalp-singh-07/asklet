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
import { useState, useEffect, useMemo } from "react";
import QuestionBlock from "@/components/QuestionBlock";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  image: string;
  reply_num: number;
  vote_count: number;
  created_at: string;
  last_active: string;
  is_answered: boolean;
}

const generateMockQuestions = (): Question[] => {
  const authors = [
    "John Doe",
    "Jane Smith",
    "Bob Johnson",
    "Alice Brown",
    "Charlie Wilson",
    "Diana Prince",
    "Frank Miller",
    "Grace Davis",
  ];
  const tags = [
    ["React", "JavaScript", "TypeScript"],
    ["Node.js", "Express", "MongoDB"],
    ["Python", "Django", "PostgreSQL"],
    ["Next.js", "React", "CSS"],
    ["Vue.js", "Nuxt.js", "JavaScript"],
    ["Angular", "TypeScript", "RxJS"],
    ["Laravel", "PHP", "MySQL"],
    ["Ruby", "Rails", "SQLite"],
  ];

  const titleTemplates = [
    "How to implement authentication in",
    "Best practices for handling state in",
    "Performance optimization techniques for",
    "How to set up testing in",
    "Debugging memory leaks in",
    "How to deploy applications with",
    "Database design patterns for",
    "API integration strategies in",
    "Error handling best practices in",
    "How to scale applications built with",
  ];

  const questions: Question[] = [];

  for (let i = 1; i <= 157; i++) {
    const randomTags = tags[Math.floor(Math.random() * tags.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    const randomTemplate =
      titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
    const mainTech = randomTags[0];

    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const createdAt = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000
    );
    const lastActiveOffset = Math.floor(
      Math.random() * daysAgo * 24 * 60 * 60 * 1000
    );
    const lastActive = new Date(createdAt.getTime() + lastActiveOffset);

    questions.push({
      id: `question-${i}`,
      title: `${randomTemplate} ${mainTech}`,
      description: `I'm working on a project using ${randomTags.join(
        ", "
      )} and I'm facing some challenges. I've tried various approaches but can't seem to get the desired results. Any help would be appreciated. Here are the specific details of what I'm trying to achieve and the issues I'm encountering.`,
      tags: randomTags,
      author: randomAuthor,
      image: "/user_placeholder.svg",
      reply_num: Math.floor(Math.random() * 25),
      vote_count: Math.floor(Math.random() * 50) - 10,
      created_at: createdAt.toISOString(),
      last_active: lastActive.toISOString(),
      is_answered: Math.random() > 0.3,
    });
  }

  return questions;
};

const mockAPI = {
  async getQuestions(
    page: number,
    filter: string,
    search: string
  ): Promise<{
    questions: Question[];
    totalCount: number;
    totalPages: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const allQuestions = generateMockQuestions();
    let filteredQuestions = [...allQuestions];

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredQuestions = filteredQuestions.filter(
        (q) =>
          q.title.toLowerCase().includes(searchLower) ||
          q.description.toLowerCase().includes(searchLower)
      );
    }

    switch (filter) {
      case "Newest Unanswered":
        filteredQuestions = filteredQuestions
          .filter((q) => !q.is_answered)
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        break;
      case "Most Votes":
        filteredQuestions = filteredQuestions.sort(
          (a, b) => b.vote_count - a.vote_count
        );
        break;
      case "Most Answers":
        filteredQuestions = filteredQuestions.sort(
          (a, b) => b.reply_num - a.reply_num
        );
        break;
      case "Recently Active":
        filteredQuestions = filteredQuestions.sort(
          (a, b) =>
            new Date(b.last_active).getTime() -
            new Date(a.last_active).getTime()
        );
        break;
      case "Oldest Unanswered":
        filteredQuestions = filteredQuestions
          .filter((q) => !q.is_answered)
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        break;
      case "My Questions":
        filteredQuestions = filteredQuestions
          .filter((q) => q.author === "John Doe")
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        break;
      default:
        filteredQuestions = filteredQuestions.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    const questionsPerPage = 20;
    const totalCount = filteredQuestions.length;
    const totalPages = Math.ceil(totalCount / questionsPerPage);
    const startIndex = (page - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

    return {
      questions: paginatedQuestions,
      totalCount,
      totalPages,
    };
  },
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 bg-gray-900 rounded-full animate-bounce"></div>
      <div
        className="w-4 h-4 bg-gray-900 rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-4 h-4 bg-gray-900 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  </div>
);

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

  const [selectedFilter, setSelectedFilter] = useState("Newest Unanswered");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const filter = searchParams.get("filter") || "Newest Unanswered";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");

    setSelectedFilter(filter);
    setSearchQuery(search);
    setCurrentPage(page);
  }, [searchParams]);

  const updateURL = (filter: string, search: string, page: number) => {
    const params = new URLSearchParams();
    if (filter !== "Newest Unanswered") params.set("filter", filter);
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
    try {
      const result = await mockAPI.getQuestions(page, filter, search);
      setQuestions(result.questions);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
      updateURL(filter, search, page);
    } catch (error) {
      console.error("Error fetching questions:", error);
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

    const start = (currentPage - 1) * 20 + 1;
    const end = Math.min(currentPage * 20, totalCount);

    let summary = `Showing ${start}-${end} of ${totalCount} questions`;

    if (searchQuery) {
      summary += ` for "${searchQuery}"`;
    }

    return summary;
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

              {[
                {
                  key: "Newest Unanswered",
                  desc: "Most recent questions without answers",
                },
                {
                  key: "Most Votes",
                  desc: "Questions with highest vote count",
                },
                { key: "Most Answers", desc: "Questions with most responses" },
                {
                  key: "Recently Active",
                  desc: "Questions with recent activity",
                },
                {
                  key: "Oldest Unanswered",
                  desc: "Questions needing attention",
                },
                { key: "My Questions", desc: "Questions you've asked" },
              ].map((filter, index) => (
                <div key={filter.key}>
                  {index === 4 && (
                    <DropdownMenuSeparator className="my-1 bg-gray-100" />
                  )}
                  <DropdownMenuItem
                    className="px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 rounded-md transition-colors focus:bg-gray-100"
                    onClick={() => handleFilterChange(filter.key)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{filter.key}</span>
                      <span className="text-xs text-gray-500">
                        {filter.desc}
                      </span>
                    </div>
                  </DropdownMenuItem>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <SearchBar
            placeholder="Search questions, topics, or keywords..."
            onSearch={handleSearch}
            className="w-full sm:flex-1 lg:max-w-2xl"
          />
        </section>

        {!isLoading && (
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

        <section className="space-y-4 sm:space-y-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : questions.length > 0 ? (
            questions.map((question) => (
              <QuestionBlock
                key={question.id}
                title={question.title}
                description={question.description}
                tags={question.tags}
                author={question.author}
                image={question.image}
                reply_num={question.reply_num}
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
                  : "No questions match the current filter. Try selecting a different filter."}
              </p>
            </div>
          )}
        </section>

        {!isLoading && totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
}
