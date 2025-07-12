"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[150px] border border-gray-300 rounded-lg bg-gray-50 animate-pulse" />
  ),
});

interface Answer {
  id: string;
  author: string;
  avatar: string;
  content: string;
  votes: number;
  downvotes: number;
  timestamp: string;
}

export default function QuestionDetail() {
  const router = useRouter();
  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([
    {
      id: "1",
      author: "Siddhant Singh",
      avatar: "/user_placeholder.svg",
      content:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
      votes: 5,
      downvotes: 3,
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      author: "Siddhant Singh",
      avatar: "/user_placeholder.svg",
      content:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
      votes: 5,
      downvotes: 3,
      timestamp: "3 hours ago",
    },
    {
      id: "3",
      author: "Siddhant Singh",
      avatar: "/user_placeholder.svg",
      content:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
      votes: 5,
      downvotes: 3,
      timestamp: "1 day ago",
    },
  ]);

  const handleVote = (answerId: string, type: "up" | "down") => {
    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.id === answerId) {
          return {
            ...answer,
            votes: type === "up" ? answer.votes + 1 : answer.votes,
            downvotes:
              type === "down" ? answer.downvotes + 1 : answer.downvotes,
          };
        }
        return answer;
      })
    );
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answerContent.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newAnswer: Answer = {
        id: `answer_${answers.length + 1}`,
        author: "Your Name",
        avatar: "/user_placeholder.svg",
        content: answerContent,
        votes: 0,
        downvotes: 0,
        timestamp: "Just now",
      };

      setAnswers((prev) => [...prev, newAnswer]);
      setAnswerContent("");

      console.log("Answer submitted:", answerContent);
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-medium text-gray-900 mb-4 leading-tight">
            How to join 2 columns inside a new and pretty good person - An
            Extended Version
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white">
              Web Development
            </span>
            <span className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white">
              React
            </span>
            <span className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white">
              Javascript
            </span>
            <span className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white">
              MERN Stack
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed text-base">
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly
            believable. If you are going to use a passage of Lorem Ipsum, you
            need to be sure there isn't anything embarrassing hidden in the
            middle of text.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Answers</h2>

          <div className="space-y-8">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className="border-b border-gray-100 last:border-b-0 pb-8 last:pb-0"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={answer.avatar}
                      alt={answer.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">
                        {answer.author}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVote(answer.id, "up")}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors cursor-pointer"
                          >
                            <span>↑</span>
                            <span>{answer.votes}</span>
                          </button>
                          <button
                            onClick={() => handleVote(answer.id, "down")}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <span>↓</span>
                            <span>{answer.downvotes}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-base">
                      {answer.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            Submit Your Answer
          </h2>

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
