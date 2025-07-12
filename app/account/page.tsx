"use client";

import AccountPage from "@/components/AccountPage";

export default function MyAccountPage() {
  const currentUserData = {
    id: "current-user-123",
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Full-stack developer passionate about creating amazing user experiences. Love working with React, TypeScript, and Node.js.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    joinDate: "January 2023",
    avatar: "/user_placeholder.svg",
    questionsCount: 42,
    answersCount: 128,
    reputation: 1547,
  };

  return <AccountPage userData={currentUserData} isOwnProfile={true} />;
}
