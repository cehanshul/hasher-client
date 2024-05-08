"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Link from "next/link";
import SearchBar from "../components/SearchBar";
import { useRouter, useSearchParams } from "next/navigation";
import SearchModal from "../components/SearchModel";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("q");

  // Render a fallback UI until searchParams are ready
  const searchModal = (
    <SearchModal
      isOpen={true}
      onClose={() => router.push("/")}
      searchInput={search as string}
      setSearchInput={(value) =>
        router.push(`/search?q=${encodeURIComponent(value)}`)
      }
    />
  );

  return (
    <div>
      {/* Wrap the part of your component that uses useSearchParams with Suspense */}
      <Suspense fallback={<div>Loading...</div>}>{searchModal}</Suspense>
    </div>
  );
};

export default SearchPage;
