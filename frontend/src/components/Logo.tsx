import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ size = "medium" }) => {
  const sizes = {
    small: { logo: 32, text: "text-xl" },
    medium: { logo: 48, text: "text-2xl" },
    large: { logo: 64, text: "text-3xl" },
  };

  const currentSize = sizes[size];

  return (
    <Link href="/" className="logo-container">
      <Image
        src="/assets/logo.svg"
        alt="StudyBuddy Logo"
        width={currentSize.logo}
        height={currentSize.logo}
      />
      <span className={`logo-text ${currentSize.text}`}>StudyBuddy</span>
    </Link>
  );
};

export default Logo;
