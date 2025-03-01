"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WorkspaceType, useWorkspaceStore } from "../store/workspaceStore";

interface BuddyCardProps {
  type: WorkspaceType;
  name: string;
}

const BuddyCard: React.FC<BuddyCardProps> = ({ type, name }) => {
  const router = useRouter();
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);

  const getImagePath = () => {
    return `/assets/pixel_${type}_static.svg`;
  };

  const handleClick = () => {
    setWorkspace(type);
    router.push("/workspace");
  };

  return (
    <div
      className="flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-110"
      onClick={handleClick}
    >
      <div className="w-32 h-32 relative mb-2">
        <Image
          src={getImagePath()}
          alt={`${name} buddy`}
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
      <span className="text-lg font-medium">{name}</span>
    </div>
  );
};

export default BuddyCard;
