"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { fetchSearchResults } from "../features/searchSlice";
import { IoMdSearch } from "react-icons/io";

const SearchBar = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [searchInput, setSearchInput] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    if (value.length > 2) {
      dispatch(fetchSearchResults(value));
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    router.push("/");
  };

  return (
    <div className=" flex">
      <IoClose
        className="   text-4xl mr-4 self-center text-gray-400 cursor-pointer"
        onClick={handleClearSearch}
      />
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search Aliens"
          className="w-full p-2 border border-gray-300 rounded-xl pl-10 focus:border-gray-600"
          value={searchInput}
          onChange={handleSearch}
        />
        <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400" />
      </div>

      {/* {searchInput && (
        
      )} */}
    </div>
  );
};

export default SearchBar;
