"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";

interface UserData {
  id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  avatar: string;
  questionsCount: number;
  answersCount: number;
  reputation: number;
}

interface AccountPageProps {
  userData: UserData;
  isOwnProfile?: boolean;
  isEditing?: boolean;
}

interface FormData {
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export default function AccountPage({
  userData,
  isOwnProfile = false,
  isEditing: initialEditing = false,
}: AccountPageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: userData.name,
    email: userData.email,
    bio: userData.bio,
    location: userData.location,
    website: userData.website,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website =
        "Website must be a valid URL (include http:// or https://)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Profile updated:", formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      bio: userData.bio,
      location: userData.location,
      website: userData.website,
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
        >
          <span className="mr-2">←</span>
          Back
        </button>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="flex-shrink-0">
                <Image
                  src={userData.avatar}
                  alt={userData.name}
                  width={120}
                  height={120}
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full border-2 border-gray-200"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-medium text-gray-900">
                      {userData.name}
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Member since {userData.joinDate}
                    </p>
                  </div>

                  {isOwnProfile && (
                    <div className="flex gap-3">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={handleCancel}
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

                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {userData.questionsCount}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Questions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {userData.answersCount}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Answers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      {userData.reputation}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Full Name
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-0 py-3 text-base bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors ${
                            errors.name
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-gray-900"
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 py-3 border-b-2 border-transparent">
                        {userData.name}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Location
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Your location"
                          className={`w-full px-0 py-3 text-base bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors ${
                            errors.location
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-gray-900"
                          }`}
                        />
                        {errors.location && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.location}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 py-3 border-b-2 border-transparent">
                        {userData.location || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Website
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://yourwebsite.com"
                          className={`w-full px-0 py-3 text-base bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors ${
                            errors.website
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-gray-900"
                          }`}
                        />
                        {errors.website && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.website}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 py-3 border-b-2 border-transparent">
                        {userData.website ? (
                          <a
                            href={userData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 hover:text-gray-600 underline"
                          >
                            {userData.website}
                          </a>
                        ) : (
                          "Not specified"
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Bio
                    </label>
                    {isEditing ? (
                      <div>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Tell us about yourself..."
                          className={`w-full px-0 py-3 text-base bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors resize-none ${
                            errors.bio
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-gray-900"
                          }`}
                        />
                        {errors.bio && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.bio}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                          {formData.bio.length}/500 characters
                        </p>
                      </div>
                    ) : (
                      <div className="py-3 border-b-2 border-transparent">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {userData.bio || "No bio available"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
