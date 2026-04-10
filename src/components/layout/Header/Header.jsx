"use client";

import TopBar from "./TopBar";
import MainNav from "./MainNav";
import CategoryNav from "./CategoryNav";

export default function Header() {
  return (
    <header className="w-full">
      <TopBar />
      <MainNav />
      <CategoryNav />
    </header>
  );
}
