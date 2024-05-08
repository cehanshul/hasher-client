"use client";

import Image from "next/image";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Link from "next/link";
import SearchBar from "../components/SearchBar";
import { useRouter, useSearchParams } from "next/navigation";
import SearchModal from "../components/SearchModel";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("q");

  return (
    <SearchModal
      isOpen={true}
      onClose={() => router.push("/")}
      searchInput={search as string}
      setSearchInput={(value) =>
        router.push(`/search?q=${encodeURIComponent(value)}`)
      }
    />
  );
};

const SearchPage = () => {
  const router = useRouter();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Search />
      </Suspense>
    </div>
  );
};

export default SearchPage;
