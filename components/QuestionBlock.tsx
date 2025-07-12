import Image from "next/image";

type QuestionBlockProps = {
  title: string;
  description: string;
  tags: string[];
  author: string;
  image: string;
  reply_num: number;
};

export default function QuestionBlock({
  title,
  description,
  tags,
  author,
  image,
  reply_num,
}: QuestionBlockProps) {
  return (
    <div className="mt-2 flex flex-col gap-1">
      <h2 className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:opacity-70 transition-opacity duration-300">
        {title}
      </h2>

      <p className="text-gray-700 text-sm mb-3 font-secondary">{description}</p>

      <div className="flex max-sm:flex-col-reverse gap-8 justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 relative">
            <Image
              src={image}
              alt={author}
              width={40}
              height={40}
              className="object-cover rounded-md"
            />
            <p className="text-sm text-gray-600">By {author}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-1 text-xs font-medium border border-black"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="opacity-60 max-sm:self-end">{reply_num} replies</p>
      </div>
    </div>
  );
}
