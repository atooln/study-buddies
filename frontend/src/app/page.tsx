"use client";

import React from "react";
import Logo from "../components/Logo";
import BuddyCard from "../components/BuddyCard";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-12">
        <Logo size="large" />
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-8 text-center">Select a buddy</h1>

        <div className="flex justify-center gap-12 py-6">
          <BuddyCard type="fox" name="Fox" />
          <BuddyCard type="frog" name="Frog" />
          <BuddyCard type="bunny" name="Bunny" />
        </div>
      </div>
    </div>
  );
}
