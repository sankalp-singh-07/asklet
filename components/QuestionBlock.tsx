import Image from "next/image";
import Link from "next/link";

type QuestionBlockProps = {
  title: string;
  description: string;
  tags: string[];
  author: string;
  image: string;
  reply_num: number;
  vote_count?: number;
  views?: number;
  created_at?: string;
  is_answered?: boolean;
  id: string;
};

export default function QuestionBlock({
  title,
  description,
  tags,
  author,
  image,
  reply_num,
  vote_count = 0,
  views = 0,
  created_at,
  is_answered = false,
  id,
}: QuestionBlockProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  return (
    <div className="mt-2 flex flex-col gap-1 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <Link href={`/questions/${id}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-gray-700 transition-colors duration-300">
          {title}
        </h2>
      </Link>

      <p className="text-gray-700 text-sm mb-3 font-secondary line-clamp-3">
        {truncateText(description.replace(/<[^>]*>/g, ""), 150)}
      </p>

      <div className="flex max-sm:flex-col-reverse gap-8 justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 relative">
            <Image
              src={image}
              alt={author}
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-sm text-gray-900 font-medium">{author}</p>
              {created_at && (
                <p className="text-xs text-gray-500">{created_at}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-3 py-1 text-xs font-medium text-gray-500">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 max-sm:self-end text-sm text-gray-600">
          {vote_count !== 0 && (
            <span
              className={`${
                vote_count > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {vote_count > 0 ? "+" : ""}
              {vote_count} votes
            </span>
          )}

          <span
            className={`${is_answered ? "text-green-600 font-medium" : ""}`}
          >
            {reply_num} {reply_num === 1 ? "reply" : "replies"}
            {is_answered && " ✓"}
          </span>

          {views > 0 && <span>{views} views</span>}
        </div>
      </div>
    </div>
  );
}
