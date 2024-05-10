// SearchModal.tsx
import React, { useEffect } from "react";
import Modal from "../components/Modal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchSearchResults } from "../features/searchSlice";
import Image from "next/image";
import Link from "next/link";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import ModelSearch from "./ModelSearch";
import { useRouter } from "next/navigation";
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  searchInput,
  setSearchInput,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const results = useSelector((state: RootState) => state.search.results);
  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchInput.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);
  useEffect(() => {
    if (searchInput.length > 2) {
      dispatch(fetchSearchResults(searchInput));
    }
  }, [searchInput, dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    router.push("/");
    onClose();
  };
  return (
    <ModelSearch
      isOpen={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-auto bg-white"
    >
      <div className="max-w-7xl mx-auto mt-4">
        <div className="flex items-center px-4 w-full justify-between mb-8">
          <div className="flex w-full items-center">
            <IoMdClose
              className="text-4xl mr-4 text-gray-400 cursor-pointer"
              onClick={handleClearSearch}
            />
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Aliens"
                className="w-full p-2 border border-gray-300 rounded-xl pl-10 focus:border-gray-600"
                value={searchInput}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
              />
              <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400" />
            </div>
          </div>
        </div>
        <div className="grid px-4 mb-20 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {results.map((user, index) => (
            <Link key={index} href={`/${user.username}`} onClick={onClose}>
              <div className="flex flex-col items-left">
                <Image
                  className="rounded-[40px] h-[320px] w-full object-cover"
                  height={320}
                  width={280}
                  alt={user.name}
                  src={user.profilePicture || "/fallback-image-path.jpg"}
                />
                <p className="pt-2 text-lg overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {user.name}
                </p>
                <p className="text-[#acacac] text-sm font-normal overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {user.profession}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ModelSearch>
  );
};

export default SearchModal;
