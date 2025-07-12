"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";

interface UserData {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  reputation: number;
  joinedAt: string;
  lastActive: string;
  role: string;
}

interface UserStats {
  questionCount: number;
  answerCount: number;
  acceptedAnswers: number;
  reputation: number;
}

interface RecentQuestion {
  _id: string;
  title: string;
  createdAt: string;
  views: number;
}

interface RecentAnswer {
  _id: string;
  createdAt: string;
  isAccepted: boolean;
  question: {
    _id: string;
    title: string;
  };
}

interface AccountPageProps {
  userData: UserData;
  userStats: UserStats;
  recentQuestions: RecentQuestion[];
  recentAnswers: RecentAnswer[];
  isOwnProfile?: boolean;
  isEditing?: boolean;
}

interface FormData {
  username: string;
  email: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  general?: string;
}

export default function AccountPage({
  userData,
  userStats,
  recentQuestions,
  recentAnswers,
  isOwnProfile = false,
  isEditing: initialEditing = false,
}: AccountPageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: userData.username,
    email: userData.email,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    } else if (formData.username.trim().length > 40) {
      newErrors.username = "Username must be less than 40 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Profile updated successfully:", data);
        setIsEditing(false);
        router.refresh();
      } else {
        setErrors({
          general: data.error || "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({
        general: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: userData.username,
      email: userData.email,
    });
    setErrors({});
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
      return "Today";
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm sm:text-base cursor-pointer"
        >
          <span className="mr-2">←</span>
          Back
        </button>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 sm:px-8 py-6 sm:py-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="flex-shrink-0">
                <Image
                  src={userData.avatar || "/user_placeholder.svg"}
                  alt={userData.username}
                  width={120}
                  height={120}
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full border-2 border-gray-200"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-medium text-gray-900">
                      {userData.username}
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Member since {formatDate(userData.joinedAt)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Last active {formatRelativeDate(userData.lastActive)}
                    </p>
                    {userData.role === "admin" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                        Admin
                      </span>
                    )}
                  </div>

                  {isOwnProfile && (
                    <div className="flex gap-3">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 text-sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 text-sm"
                          >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 text-sm"
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {userStats.questionCount}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Questions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {userStats.answerCount}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Answers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {userStats.acceptedAnswers}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Accepted
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {userStats.reputation}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Reputation
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Profile Information
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Username
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className={`w-full px-0 py-3 text-base bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors ${
                            errors.username
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-gray-900"
                          }`}
                        />
                        {errors.username && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.username}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 py-3 border-b-2 border-transparent">
                        {userData.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Email
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className={`w-full px-0 py-3 text-base bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors ${
                            errors.email
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-gray-900"
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 py-3 border-b-2 border-transparent">
                        {userData.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h2>

                  {recentQuestions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Recent Questions
                      </h3>
                      <div className="space-y-2">
                        {recentQuestions.slice(0, 3).map((question) => (
                          <div
                            key={question._id}
                            className="border-l-2 border-gray-200 pl-3"
                          >
                            <p className="text-sm text-gray-900 font-medium line-clamp-2">
                              {question.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatRelativeDate(question.createdAt)} •{" "}
                              {question.views} views
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recentAnswers.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Recent Answers
                      </h3>
                      <div className="space-y-2">
                        {recentAnswers.slice(0, 3).map((answer) => (
                          <div
                            key={answer._id}
                            className="border-l-2 border-gray-200 pl-3"
                          >
                            <p className="text-sm text-gray-900 font-medium line-clamp-2">
                              {answer.question.title}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-500">
                                {formatRelativeDate(answer.createdAt)}
                              </p>
                              {answer.isAccepted && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Accepted
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recentQuestions.length === 0 &&
                    recentAnswers.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No recent activity</p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
