"use client";
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide, SwiperClass } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AppDispatch, RootState } from "../store/store";
import { fetchCategories } from "../features/categoriesSlice";
import "./style.css";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoriesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  const swiperRefs = useRef<(SwiperClass | null)[]>([]);

  useEffect(() => {
    dispatch(fetchCategories());
    swiperRefs.current = categories.map(() => null);
  }, [dispatch, categories.length]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-28">
      <Swiper
        className="category-swiper mr-auto ml-0 left-0 right-auto md:w-9/12"
        modules={[A11y]}
        spaceBetween={10}
        slidesPerView={3.5}
        breakpoints={{
          640: { slidesPerView: 4 },
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 7 },
        }}
        scrollbar={{ draggable: true }}
        style={{ padding: "20px 0" }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category._id}>
            <Link href={`/search?q=${category.name}`}>
              <div className="category-item">
                {loading ? (
                  <Skeleton circle height={100} width={100} />
                ) : (
                  <Image
                    className="rounded-full md:h-[100px] md:w-[100px] w-[90px] h-[90px] object-cover"
                    height={100}
                    width={100}
                    alt={category.name}
                    src={category.imageUrl}
                  />
                )}
                {loading ? (
                  <Skeleton width={70} />
                ) : (
                  <p className="category-name">{category.name}</p>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {categories.map((category, index) => (
        <div key={category._id} className="relative">
          {loading ? (
            <Skeleton width={150} height={30} />
          ) : (
            <p className="text-xl md:text-2xl text-[#252525] mt-8 font-medium">
              {category.name}
            </p>
          )}
          <Swiper
            className="md:mt-8 mt-6"
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={20}
            slidesPerView={1.4}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 4.5 },
            }}
            onSwiper={(swiper) => (swiperRefs.current[index] = swiper)}
          >
            {category.experts.map((expert) => (
              <SwiperSlide key={expert._id}>
                <Link href={`/${expert.userId.username}`} passHref>
                  <div className="flex flex-col items-left">
                    {loading ? (
                      <Skeleton height={320} width={280} />
                    ) : (
                      <Image
                        className="rounded-[40px] h-[280px] md:h-[320px] w-[280px] object-cover"
                        height={320}
                        width={280}
                        alt={expert.userId.name}
                        src={expert.userId.profilePicture || ""}
                      />
                    )}
                    <div className="flex gap-2 pt-2">
                      {loading ? (
                        <Skeleton width={120} height={20} />
                      ) : (
                        <>
                          <p className="text-lg overflow-hidden whitespace-nowrap overflow-ellipsis">
                            {expert.userId.name}
                          </p>
                          <Image
                            className="my-auto justify-center"
                            src="/images/icons/verified.svg"
                            alt="user"
                            height={18}
                            width={18}
                          />
                        </>
                      )}
                    </div>
                    {loading ? (
                      <Skeleton width={150} height={20} />
                    ) : (
                      <p className="text-[#acacac] text-sm font-normal overflow-hidden whitespace-nowrap overflow-ellipsis">
                        {expert.profession}
                      </p>
                    )}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute hidden md:block top-[-10px] right-0 z-0 md:flex">
            <button
              className="bg-[#F3F3F3] border-[#C7C7C7] border-3 text-[#494949] p-3 rounded-full hover:bg-[#ededed] relative z-0"
              onClick={() => swiperRefs.current[index]?.slidePrev()}
            >
              <FaChevronLeft className="text-[#494949]" />
            </button>
            <button
              className="bg-[#F3F3F3] border-[#C7C7C7] border-3 text-[#494949] p-3 rounded-full hover:bg-[#ededed] ml-2 relative z-0"
              onClick={() => swiperRefs.current[index]?.slideNext()}
            >
              <FaChevronRight className="text-[#494949]" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesPage;
