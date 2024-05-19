"use client";
import React, { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoMdSearch } from "react-icons/io";
import { searchUsers } from "../services/searchService";
import { debounce } from "../utils/debounce";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults, setQuery } from "../features/searchSlice";
import { AppDispatch } from "../store/store";
import Modal from "../components/Modal";
import LoginForm from "../components/LoginForm";
import {
  fetchUserDetails,
  selectUserState,
  logout,
} from "../features/user/userSlice";
import SearchModal from "../components/SearchModel";

export interface SearchResult {
  _id: string;
  isExpert: boolean;
  isVerified: boolean;
  name: string;
  username: string;
  profilePicture: string;
  expertId: string;
  expertiseAreas: string[];
  pricePerMinute: number;
  profession: string;
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = useSelector(selectUserState);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (value.trim().length > 2) {
        const results = await searchUsers(value);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const { token, _id: userId } = JSON.parse(userData);
      dispatch(fetchUserDetails({ userId, token }));
    }
  }, [dispatch]);

  const handleSignInClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (
      searchRef.current &&
      event.target instanceof Node &&
      !searchRef.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setSearchResults([]);
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const handleSearchClick = () => {
    setSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setSearchModalOpen(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && searchInput.trim().length > 0) {
      dispatch(setQuery(searchInput));
      router.push(`/search?query=${searchInput}`);
      setSearchResults([]);
      dispatch(fetchSearchResults(searchInput));
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("userData");
    setDropdownOpen(false);
    window.location.reload();
  };
  const pathname = usePathname();

  return (
    <div>
      {pathname !== "/search" && (
        <div className="fixed top-0 left-0 right-0 z-10">
          <div className="w-full py-4 px-4 md:py-4 bg-white border-[#F2F2F2] border-b-[1px] z-50 fixed top-0 left-0 right-0">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link href="/">
                <Image
                  src="/images/logo-s.png"
                  height={36}
                  width={141}
                  alt="logo"
                />
              </Link>

              <div
                className="flex-1 mx-4 hidden md:block relative"
                onClick={handleSearchClick}
                ref={searchRef}
              >
                <input
                  type="text"
                  placeholder="Search Aliens"
                  className="w-full p-2 border border-gray-300 rounded-xl pl-10 focus:border-gray-600"
                  value={searchInput}
                  readOnly
                />
                <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400" />
                {searchResults.length > 0 && (
                  <div className="absolute bg-white border border-gray-300 roundexl mt-1 max-h-60 overflow-auto w-full">
                    {searchResults.map((result) => (
                      <Link
                        href={`/${result.username}`}
                        key={result._id}
                        onClick={clearSearch}
                      >
                        <div className="flex gap-3 px-4 py-2 cursor-pointer">
                          <Image
                            src={result.profilePicture}
                            alt={result.name}
                            height={40}
                            width={40}
                            className="h-[40px] w[40px] rounded-full object-cover"
                          />
                          <div>
                            <p className="block hover:bg-gray-100">
                              {result.name}
                            </p>
                            <p className="block hover:bg-gray-100 text-gray-400 text-sm">
                              {result.profession}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button className="bg-[#eeeeee] hidden md:block px-6 font-medium text-[#252525] py-2 rounded-full">
                Download App
              </button>

              <div className="flex justify-center">
                <IoMdSearch
                  className="block md:hidden self-center text-2xl text-gray-400"
                  onClick={handleSearchClick}
                />
                {user ? (
                  <div
                    className="flex gap-2 pl-4 relative"
                    onClick={toggleDropdown}
                    ref={dropdownRef}
                  >
                    <Image
                      className="my-auto justify-center"
                      src="/images/icons/user.svg"
                      alt="user"
                      height={22}
                      width={22}
                    />
                    <div className="relative">
                      <p className="text-[#252525] hidden md:flex font-medium py-2 rounded cursor-pointer">
                        {user.name}
                      </p>
                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                          <button
                            onClick={handleLogout}
                            className="block px-4 w-full py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleSignInClick}
                    className="text-[#252525] text-lg font-medium py-2 px-4 rounded"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
              <LoginForm onLoginSuccess={handleCloseModal} />
            </Modal>
          </div>
        </div>
      )}

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
    </div>
  );
};

export default Navbar;
