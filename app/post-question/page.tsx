"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] border border-gray-300 rounded-lg bg-gray-50 animate-pulse" />
  ),
});

interface FormData {
  title: string;
  description: string;
  tags: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  tags?: string;
  general?: string;
}

export default function PostQuestion() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    tags: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 10) {
      newErrors.title = "Title must be at least 10 characters long";
    } else if (formData.title.trim().length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    const textContent = formData.description
      .replace(/[#*`_~\[\]()]/g, "")
      .trim();
    if (!textContent) {
      newErrors.description = "Description is required";
    } else if (textContent.length < 20) {
      newErrors.description = "Description must be at least 20 characters long";
    }

    if (!formData.tags.trim()) {
      newErrors.tags = "At least one tag is required";
    } else {
      const tagArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      if (tagArray.length === 0) {
        newErrors.tags = "At least one tag is required";
      } else if (tagArray.length > 5) {
        newErrors.tags = "Maximum 5 tags allowed";
      } else if (tagArray.some((tag) => tag.length > 20)) {
        newErrors.tags = "Each tag must be less than 20 characters";
      }
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

  const handleDescriptionChange = (value?: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value || "",
    }));

    if (errors.description) {
      setErrors((prev) => ({
        ...prev,
        description: undefined,
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
      const tagArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description,
          tags: tagArray,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Question submitted successfully:", data);
        router.push(`/questions/${data._id}`);
      } else {
        if (response.status === 401) {
          setErrors({
            general:
              "You must be logged in to post a question. Please sign in and try again.",
          });
        } else {
          setErrors({
            general:
              data.error || "Failed to submit question. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      setErrors({
        general: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-0 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg">
          <div className="px-6 py-8 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight">
                POST YOUR QUESTION ON ASKLET
              </h1>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-base font-medium text-gray-700 mb-4"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`
                    w-full px-0 py-3 text-base bg-transparent border-0 border-b-2 
                    focus:outline-none focus:ring-0 transition-colors
                    ${
                      errors.title
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }
                  `}
                  placeholder="Enter your question title..."
                  disabled={isSubmitting}
                  maxLength={200}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Be specific and concise (minimum 10 characters)
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-base font-medium text-gray-700 mb-4"
                >
                  Description
                </label>
                <div
                  className={`rounded-lg overflow-hidden ${
                    errors.description ? "ring-2 ring-red-500" : ""
                  }`}
                >
                  <MDEditor
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    preview="edit"
                    hideToolbar={false}
                    data-color-mode="light"
                    textareaProps={{
                      placeholder:
                        "Provide detailed information about your question...",
                      style: {
                        fontSize: "1rem",
                        fontFamily: "inherit",
                        lineHeight: 1.5,
                        minHeight: "150px",
                        backgroundColor: "white",
                        color: "black",
                      },
                      disabled: isSubmitting,
                    }}
                  />
                </div>
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  You can use Markdown formatting (bold, italic, lists, links,
                  etc.). Minimum 20 characters required.
                </p>
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-base font-medium text-gray-700 mb-4"
                >
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className={`
                    w-full px-0 py-3 text-base bg-transparent border-0 border-b-2 
                    focus:outline-none focus:ring-0 transition-colors
                    ${
                      errors.tags
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }
                  `}
                  placeholder="Enter tags separated by commas (e.g., React, JavaScript, CSS)"
                  disabled={isSubmitting}
                />
                {errors.tags && (
                  <p className="mt-2 text-sm text-red-600">{errors.tags}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Separate multiple tags with commas (maximum 5 tags, each under
                  20 characters)
                </p>
              </div>

              <div className="flex justify-center pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    px-8 py-3 text-base font-medium rounded-md transition-colors
                    border border-gray-900 focus:outline-none focus:ring-2 
                    focus:ring-gray-500 focus:ring-offset-2
                    ${
                      isSubmitting
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .w-md-editor {
          background-color: white !important;
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
