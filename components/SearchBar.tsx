import { useState } from "react";
import Image from "next/image";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
};

export default function SearchBar({
  placeholder = "Search questions...",
  onSearch,
  className = "",
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <section className="relative w-full">
        <Image
          src="/search.svg"
          alt="Search"
          width={15}
          height={15}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-1.5 border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
        />

        {searchValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            aria-label="Clear search"
          >
            <Image src="/cross.svg" alt="Clear" width={16} height={16} />
          </button>
        )}
      </section>
    </div>
  );
}
