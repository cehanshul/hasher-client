"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchSearchResults } from "../features/searchSlice";
import { AppDispatch, RootState } from "../store/store";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SearchPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const search = searchParams.get("query");
  console.log(`logging from search result page ${search}`);

  const results = useSelector((state: RootState) => state.search.results);

  useEffect(() => {
    if (search) {
      dispatch(fetchSearchResults(search as string));
    }
  }, [dispatch, search]);

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <div className="flex gap-4">
        {results.map((user, index) => (
          <Link key={index} href={`/${user.username}`}>
            <div className="flex flex-col items-left mb-4">
              <Image
                className="rounded-[40px] h-[320px] w-[280px] object-cover"
                height={320}
                width={280}
                alt={user.name}
                src={user.profilePicture || "/fallback-image-path.jpg"}
              />
              <p className="pt-2 text-lg  overflow-hidden whitespace-nowrap overflow-ellipsis">
                {user.name}
              </p>
              <p className="text-[#acacac] text-sm font-normal  overflow-hidden whitespace-nowrap overflow-ellipsis">
                {user.profession}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
