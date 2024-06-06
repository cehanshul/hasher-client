import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef, FC, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface DateData {
  date: string;
  selected: boolean;
}

interface CustomSwiperProps {
  availabilityDates: DateData[];
  handleDateSelection: (date: string) => void;
}

const CustomSwiper: FC<CustomSwiperProps> = ({
  availabilityDates,
  handleDateSelection,
}) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="relative mt-4">
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={4}
        breakpoints={{
          640: {
            slidesPerView: 5.2,
          },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="flex"
      >
        {availabilityDates.map((dateData) => (
          <SwiperSlide key={dateData.date}>
            <button
              className={`px-4 py-2 rounded-lg border ${
                dateData.selected
                  ? "bg-gray-200 border-gray-400"
                  : "bg-white border-gray-200"
              }`}
              onClick={() => handleDateSelection(dateData.date)}
            >
              <div className="text-center">
                <div className="text-lg">
                  <p className="text-sm text-[#252525]">
                    {new Date(dateData.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                </div>
                <div className="font-medium">
                  <p className="text-md ">
                    {new Date(dateData.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        ref={prevRef}
        className="custom-prev absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hidden md:block"
      >
        <FaChevronLeft className="text-gray-600 w-6 h-6" />
      </div>
      <div
        ref={nextRef}
        className="custom-next absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hidden md:block"
      >
        <FaChevronRight className="text-gray-600 w-6 h-6" />
      </div>
    </div>
  );
};

export default CustomSwiper;
