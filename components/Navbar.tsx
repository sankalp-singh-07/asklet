"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "./Button";
import notification from "@/public/notification.svg";

interface NavbarProps {
  isLoggedIn?: boolean;
  user?: {
    name: string;
    avatar: string;
    email: string;
  };
  notifications?: Notification[];
}

interface Notification {
  id: string;
  type: "answer" | "vote" | "comment" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
}

export default function Navbar({
  isLoggedIn = true,
  user = {
    name: "John Doe",
    avatar: "/user_placeholder.svg",
    email: "john.doe@example.com",
  },
  notifications = [
    {
      id: "1",
      type: "answer",
      title: "New answer to your question",
      message: "Someone answered 'How to join 2 columns in React?'",
      timestamp: "2 minutes ago",
      isRead: false,
      avatar: "/user_placeholder.svg",
    },
    {
      id: "2",
      type: "vote",
      title: "Your answer was upvoted",
      message: "Your answer received 5 upvotes",
      timestamp: "1 hour ago",
      isRead: false,
    },
    {
      id: "3",
      type: "comment",
      title: "New comment on your answer",
      message: "Jane Smith commented on your React solution",
      timestamp: "3 hours ago",
      isRead: true,
      avatar: "/user_placeholder.svg",
    },
    {
      id: "4",
      type: "system",
      title: "Welcome to Asklet!",
      message: "Complete your profile to get started",
      timestamp: "1 day ago",
      isRead: true,
    },
  ],
}: NavbarProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = () => {
    router.push("/");
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsNotificationDropdownOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsUserDropdownOpen(false);
  };

  const handleLogout = () => {
    console.log("User logged out");
    setIsUserDropdownOpen(false);
  };

  const handleMyAccount = () => {
    console.log("Navigate to My Account");
    setIsUserDropdownOpen(false);
  };

  const handleNotificationClick = (notificationId: string) => {
    console.log("Notification clicked:", notificationId);
  };

  const markAllAsRead = () => {
    console.log("Mark all notifications as read");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "answer":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "vote":
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "comment":
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "system":
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <nav className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 py-4 relative">
        <h1
          onClick={handleLogoClick}
          className="text-xl sm:text-2xl uppercase font-semibold cursor-pointer hover:text-gray-700 transition-colors"
        >
          Asklet
        </h1>

        <button
          onClick={toggleMenu}
          className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1 cursor-pointer z-20"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-7 h-0.5 bg-black transition-all rounded-2xl duration-300 ease-in-out ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-7 h-0.5 bg-black transition-all rounded-2xl duration-300 ease-in-out ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-7 h-0.5 bg-black transition-all rounded-2xl duration-300 ease-in-out ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        <div className="hidden sm:flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="relative">
                <button
                  onClick={toggleNotificationDropdown}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <Image
                    src={notification}
                    alt="Notifications"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() =>
                              handleNotificationClick(notification.id)
                            }
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${
                              !notification.isRead ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {notification.avatar ? (
                                <Image
                                  src={notification.avatar}
                                  alt="User"
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full border border-gray-300"
                                />
                              ) : (
                                getNotificationIcon(notification.type)
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p
                                    className={`text-sm font-medium ${
                                      !notification.isRead
                                        ? "text-gray-900"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {notification.timestamp}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <svg
                            className="w-12 h-12 mx-auto mb-4 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h5l-5-5V9a4 4 0 00-8 0v3l-5 5h5a4 4 0 008 0z"
                            />
                          </svg>
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="User menu"
                >
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300"
                  />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full border border-gray-300"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={handleMyAccount}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        My Account
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ul className="flex space-x-4 md:space-x-6 lg:space-x-8">
              <li>
                <Button>SIGNUP</Button>
              </li>
              <li>
                <Button>LOGIN</Button>
              </li>
            </ul>
          )}
        </div>

        <div
          className={`sm:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ease-in-out z-20 ${
            isMenuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-4 invisible"
          }`}
        >
          {isLoggedIn ? (
            <div className="py-4 px-4">
              <div className="flex items-center space-x-3 p-3 border-b border-gray-100 mb-3">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <ul className="space-y-2">
                <li>
                  <button
                    onClick={handleMyAccount}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    My Account
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <ul className="flex flex-col py-4 px-4 space-y-3">
              <li>
                <Button className="w-full">SIGNUP</Button>
              </li>
              <li>
                <Button className="w-full">LOGIN</Button>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {(isUserDropdownOpen || isMenuOpen || isNotificationDropdownOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsUserDropdownOpen(false);
            setIsMenuOpen(false);
            setIsNotificationDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
}
