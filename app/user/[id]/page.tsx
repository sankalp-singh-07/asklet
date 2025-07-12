"use client";

import AccountPage from "@/components/AccountPage";

export default function OtherUserAccountPage() {
  const otherUserData = {
    id: "other-user-456",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    bio: "Senior Software Engineer with 8+ years of experience. Specialized in backend development and system architecture.",
    location: "New York, NY",
    website: "https://janesmith.tech",
    joinDate: "March 2022",
    avatar: "/user_placeholder.svg",
    questionsCount: 67,
    answersCount: 234,
    reputation: 2891,
  };

  return <AccountPage userData={otherUserData} isOwnProfile={false} />;
}
