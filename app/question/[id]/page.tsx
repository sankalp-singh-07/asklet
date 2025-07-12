"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[150px] border border-gray-300 rounded-lg bg-gray-50 animate-pulse" />
  ),
});

interface Author {
  username: string;
  reputation: number;
  avatar?: string;
}

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  author: Author;
  views: number;
  createdAt: string;
  updatedAt: string;
  votes: {
    upvotes: string[];
    downvotes: string[];
  };
  voteScore: number;
  acceptedAnswer?: string;
}

interface Answer {
  _id: string;
  content: string;
  author: Author;
  question: string;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  votes: {
    upvotes: string[];
    downvotes: string[];
  };
  voteScore: number;
}

interface QuestionDetailData {
  question: Question;
  answers: Answer[];
}

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-6 bg-gray-200 rounded w-20 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function QuestionDetail() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;

  const [questionData, setQuestionData] = useState<QuestionDetailData | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch("/api/user/me");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData.user);
        }

        const questionResponse = await fetch(`/api/questions/${questionId}`);
        if (!questionResponse.ok) {
          if (questionResponse.status === 404) {
            setError("Question not found");
          } else {
            setError("Failed to load question");
          }
          return;
        }

        const data = await questionResponse.json();
        setQuestionData(data);
      } catch (error) {
        console.error("Error fetching question:", error);
        setError("Failed to load question. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (questionId) {
      fetchData();
    }
  }, [questionId]);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answerContent.trim()) {
      return;
    }

    if (!currentUser) {
      router.push(`/sign-in?redirect=/questions/${questionId}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: answerContent,
        }),
      });

      if (response.ok) {
        const newAnswer = await response.json();
        setQuestionData((prev) =>
          prev
            ? {
                ...prev,
                answers: [
                  ...prev.answers,
                  {
                    ...newAnswer,
                    voteScore: 0,
                  },
                ],
              }
            : null
        );
        setAnswerContent("");
      } else {
        const errorData = await response.json();
        console.error("Failed to submit answer:", errorData.error);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!currentUser) {
      router.push(`/sign-in?redirect=/questions/${questionId}`);
      return;
    }

    try {
      const response = await fetch(`/api/answers/${answerId}/accept`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        setQuestionData((prev) =>
          prev
            ? {
                ...prev,
                question: {
                  ...prev.question,
                  acceptedAnswer: result.isAccepted ? answerId : undefined,
                },
                answers: prev.answers.map((answer) => ({
                  ...answer,
                  isAccepted:
                    answer._id === answerId ? result.isAccepted : false,
                })),
              }
            : null
        );
      }
    } catch (error) {
      console.error("Error accepting answer:", error);
    }
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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-red-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error === "Question not found"
                ? "Question not found"
                : "Error loading question"}
            </h3>
            <p className="text-gray-600 mb-4">
              {error === "Question not found"
                ? "The question you're looking for doesn't exist or may have been deleted."
                : error}
            </p>
            {error !== "Question not found" && (
              <button
                onClick={() => window.location.reload()}
                className="text-gray-900 hover:text-gray-600 underline"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!questionData) {
    return null;
  }

  const { question, answers } = questionData;
  const isQuestionAuthor =
    currentUser && currentUser._id === question.author._id;

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors cursor-pointer"
        >
          <span className="mr-2">←</span>
          Back
        </button>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-medium text-gray-900 leading-tight flex-1">
              {question.title}
            </h1>
            <div className="text-sm text-gray-500 ml-4">
              {question.views} views
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Image
                src={question.author.avatar || "/user_placeholder.svg"}
                alt={question.author.username}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm text-gray-600">
                by {question.author.username}
              </span>
              <span className="text-sm text-gray-500">
                • {formatDate(question.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {question.voteScore} votes
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: question.description }} />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-900">
              {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
            </h2>
          </div>

          {answers.length > 0 ? (
            <div className="space-y-8">
              {answers
                .sort((a, b) => {
                  if (a.isAccepted && !b.isAccepted) return -1;
                  if (!a.isAccepted && b.isAccepted) return 1;
                  return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                  );
                })
                .map((answer) => (
                  <div
                    key={answer._id}
                    className={`border-b border-gray-100 last:border-b-0 pb-8 last:pb-0 ${
                      answer.isAccepted ? "bg-green-50 p-4 rounded-lg" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={answer.author.avatar || "/user_placeholder.svg"}
                          alt={answer.author.username}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">
                              {answer.author.username}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {answer.author.reputation} reputation
                            </span>
                            {answer.isAccepted && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                ✓ Accepted
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {answer.voteScore} votes
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(answer.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="prose max-w-none mb-4">
                          <div
                            dangerouslySetInnerHTML={{ __html: answer.content }}
                          />
                        </div>

                        {isQuestionAuthor && !answer.isAccepted && (
                          <button
                            onClick={() => handleAcceptAnswer(answer._id)}
                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                          >
                            Accept this answer
                          </button>
                        )}

                        {isQuestionAuthor && answer.isAccepted && (
                          <button
                            onClick={() => handleAcceptAnswer(answer._id)}
                            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                          >
                            Unaccept this answer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No answers yet. Be the first to answer!
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            Submit Your Answer
          </h2>

          {currentUser ? (
            <form onSubmit={handleAnswerSubmit}>
              <div className="mb-6">
                <div className="rounded-lg overflow-hidden">
                  <MDEditor
                    value={answerContent}
                    onChange={(value) => setAnswerContent(value || "")}
                    preview="edit"
                    hideToolbar={false}
                    data-color-mode="light"
                    textareaProps={{
                      placeholder: "Your Answer...",
                      style: {
                        fontSize: "1rem",
                        fontFamily: "inherit",
                        lineHeight: 1.5,
                        minHeight: "120px",
                        backgroundColor: "white",
                        color: "black",
                      },
                      disabled: isSubmitting,
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !answerContent.trim()}
                  className={`
                    px-8 py-2 text-base font-medium border border-gray-900 rounded-md transition-colors
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    ${
                      isSubmitting || !answerContent.trim()
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                        : "bg-white text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">
                You need to be signed in to answer this question.
              </p>
              <button
                onClick={() =>
                  router.push(`/sign-in?redirect=/questions/${questionId}`)
                }
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Sign In to Answer
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .w-md-editor {
          background-color: white !important;
          border: 1px solid #d1d5db !important;
        }
        .w-md-editor-text-container {
          background-color: white !important;
        }
        .w-md-editor-text {
          background-color: white !important;
          color: black !important;
        }
        .w-md-editor-text-area {
          background-color: white !important;
          color: black !important;
        }
        .w-md-editor.w-md-editor-focus {
          border-color: #3b82f6 !important;
        }
        .w-md-editor-toolbar {
          background-color: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
        }
      `}</style>
    </div>
  );
}
