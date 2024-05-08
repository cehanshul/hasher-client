"use client";
import Image from "next/image";
import React from "react";
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

  return (
    <div>
      <SearchModal
        isOpen={true}
        onClose={() => router.push("/")}
        searchInput={search as string}
        setSearchInput={(value) =>
          router.push(`/search?q=${encodeURIComponent(value)}`)
        }
      />
    </div>
  );
};

export default SearchPage;
