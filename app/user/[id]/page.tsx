"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AccountPage from "@/components/AccountPage";

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

interface ProfileData {
  user: UserData;
  stats: UserStats;
  recentQuestions: RecentQuestion[];
  recentAnswers: RecentAnswer[];
}

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-white py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user to check if viewing own profile
        const currentUserResponse = await fetch("/api/user/me");
        let currentUserData = null;

        if (currentUserResponse.ok) {
          const userData = await currentUserResponse.json();
          currentUserData = userData.user;
          setCurrentUser(currentUserData);
        }

        // Fetch the profile data for the requested username
        const profileResponse = await fetch(`/api/users/${username}`);

        if (!profileResponse.ok) {
          if (profileResponse.status === 404) {
            setError("User not found");
          } else {
            setError("Failed to load user profile");
          }
          return;
        }

        const profileData = await profileResponse.json();
        setProfileData(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
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
              {error === "User not found"
                ? "User not found"
                : "Error loading profile"}
            </h3>
            <p className="text-gray-600 mb-4">
              {error === "User not found"
                ? "The user you're looking for doesn't exist or may have been deleted."
                : error}
            </p>
            {error !== "User not found" && (
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

  if (!profileData) {
    return (
      <div className="min-h-screen bg-white py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Profile not found
            </h3>
            <p className="text-gray-600">
              Unable to load the requested profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if viewing own profile
  const isOwnProfile =
    currentUser && currentUser.username === profileData.user.username;

  return (
    <AccountPage
      userData={profileData.user}
      userStats={profileData.stats}
      recentQuestions={profileData.recentQuestions}
      recentAnswers={profileData.recentAnswers}
      isOwnProfile={isOwnProfile || false}
    />
  );
}
