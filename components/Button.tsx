import { ReactNode } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-6 sm:px-8 md:px-10 lg:px-11 py-1 border border-black font-medium cursor-pointer hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
