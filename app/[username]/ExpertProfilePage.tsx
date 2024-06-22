"use client";

import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { ExpertProfile, Review } from "../features/expertSlice";
import { FiArrowRight } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import api from "../utils/api";
import { bookSession } from "../features/bookingsSlice";
import { createOrder, verifyPayment } from "../features/paymentSlice";
import moment from "moment-timezone";
import Modal from "../components/Modal";
import LoginForm from "../components/LoginForm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import CustomSwiper from "./DateSwiper";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DateData {
  date: string;
  day: string;
  selected: boolean;
}

interface SlotInfo {
  startTime: string;
  endTime: string;
  _id: string;
}

interface ExpertData {
  expertProfile: ExpertProfile | null;
  expertUser: {
    _id: string;
    name: string;
    profilePicture: string;
    bio: string;
    isVerified: boolean;
  };
  reviews: Review[];
  totalReviews: number;
  averageRating: number | null;
  totalMeetings: number;
  loading: boolean;
  error: string | null;
}

const ExpertProfilePage = ({
  expertData,
  username,
}: {
  expertData: ExpertData;
  username: string;
}) => {
  const {
    expertProfile,
    expertUser,
    reviews,
    totalReviews,
    averageRating,
    totalMeetings,
    loading,
    error,
  } = expertData;

  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState<string>("");
  const [duration, setDuration] = useState<number>(15);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showCheckoutDetails, setShowCheckoutDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [availabilityDates, setAvailabilityDates] = useState<DateData[]>([]);
  const [availableSlots, setAvailableSlots] = useState<SlotInfo[]>([]);
  const [processedSlots, setProcessedSlots] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [storeUrl, setStoreUrl] = useState("");

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
      setStoreUrl(
        "https://apps.apple.com/in/app/hasher-connect-with-experts/id6502012082"
      );
    } else if (/android/.test(userAgent)) {
      setStoreUrl(
        "https://play.google.com/store/apps/details?id=com.hasher.android"
      );
    } else if (/macintosh|mac os x/.test(userAgent)) {
      setStoreUrl(
        "https://apps.apple.com/in/app/hasher-connect-with-experts/id6502012082"
      );
    } else if (/windows/.test(userAgent)) {
      setStoreUrl(
        "https://play.google.com/store/apps/details?id=com.hasher.android"
      );
    } else {
      setStoreUrl("#");
    }
  }, []);

  const handleClick = () => {
    if (storeUrl && storeUrl !== "#") {
      // Ensure the URL is properly encoded
      const encodedUrl = encodeURI(storeUrl);
      window.location.href = encodedUrl;
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= 200) {
      setMessage(event.target.value);
    }
  };

  const fetchAvailableDates = async () => {
    if (expertProfile?._id) {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await api.get(
          `/api/users/available/dates/${expertProfile._id}?timezone=${timezone}`
        );
        const data = response.data.map((item: { date: string }) => {
          const utcDate = new Date(item.date);
          const localDate = new Date(
            utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
          );
          return {
            date: localDate.toISOString(),
            day: localDate.toLocaleDateString("en-US", { weekday: "long" }),
            selected: false,
          };
        });
        setAvailabilityDates(data);
      } catch (error) {
        console.error("Failed to fetch availability dates:", error);
      }
    }
  };

  const handleDateSelection = (selectedDate: string) => {
    setAvailabilityDates((prevDates) =>
      prevDates.map((date) =>
        date.date === selectedDate
          ? { ...date, selected: true }
          : { ...date, selected: false }
      )
    );
    setStartDate(new Date(selectedDate));
  };

  const fetchAvailableSlots = async (date: Date) => {
    if (expertProfile?._id) {
      try {
        setSlotsLoading(true);
        const expertId = expertProfile._id;
        const userId = user?._id;
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formattedDate = moment(date).format("YYYY-MM-DD");
        const response = await api.get(
          `/api/users/expert/availability/${expertId}/${userId}/${formattedDate}?timezone=${userTimeZone}`
        );
        setAvailableSlots(response.data.availability.slots);
        processSlots(response.data.availability.slots, duration);
        setSlotsLoading(false);
      } catch (error) {
        console.error("Failed to fetch available slots:", error);
        setSlotsLoading(false);
      }
    }
  };

  const processSlots = (slots: SlotInfo[], duration: number) => {
    const processed: string[] = [];
    slots.forEach((slot) => {
      let start = moment(slot.startTime, "HH:mm");
      const end = moment(slot.endTime, "HH:mm");
      while (start.isBefore(end)) {
        const nextSlot = start.clone().add(duration, "minutes");
        if (nextSlot.isAfter(end)) break;
        processed.push(start.format("HH:mm"));
        start.add(duration, "minutes");
      }
    });
    setProcessedSlots(processed);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (window.Razorpay) {
        // Razorpay script has loaded successfully
        // You can initialize Razorpay here if needed
      }
    };
  }, []);

  useEffect(() => {
    fetchAvailableDates();
  }, [expertProfile?._id]);

  useEffect(() => {
    if (startDate !== null) {
      fetchAvailableSlots(startDate);
    }
  }, [startDate]);

  useEffect(() => {
    processSlots(availableSlots, duration);
  }, [availableSlots, duration]);

  console.log("Expert Profile Data: ", expertProfile);
  console.log("Expertise Areas: ", expertProfile?.expertiseAreas);

  const incrementDuration = () => {
    setDuration((prev) => (prev < 90 ? prev + 15 : prev));
  };

  const decrementDuration = () => {
    setDuration((prev) => (prev > 15 ? prev - 15 : prev));
  };

  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user);

  const getSocialMediaIcon = (link: string) => {
    const socialMediaIcons: { [key: string]: string } = {
      "instagram.com": "/images/social/instagram.svg",
      "facebook.com": "/images/social/facebook.svg",
      "x.com": "/images/social/x.svg",
      "twitter.com": "/images/social/x.svg",
      "behance.com": "/images/social/behance.svg",
      "behance.net": "/images/social/behance.svg",
      "discord.com": "/images/social/discord.svg",
      "discord.gg": "/images/social/discord.svg",
      "figma.com": "/images/social/figma.svg",
      "github.com": "/images/social/github.svg",
      "linkedin.com": "/images/social/linkedin.svg",
      "reddit.com": "/images/social/reddit.svg",
      "youtube.com": "/images/social/youtube.svg",
    };

    const matchedIcon = Object.keys(socialMediaIcons).find((platform) =>
      link.includes(platform)
    );

    return matchedIcon
      ? socialMediaIcons[matchedIcon]
      : "/images/social/custom_link.svg";
  };

  const handleTimeSlotSelection = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const showCheckoutDetailsSection = () => {
    const userData = localStorage.getItem("userData");
    const user = userData ? JSON.parse(userData) : null;

    if (user && user._id) {
      // If user ID exists, show checkout details
      setShowCheckoutDetails(true);
    } else {
      // If user ID does not exist, open login modal
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const hideCheckoutDetailsSection = () => {
    setShowCheckoutDetails(false);
  };

  const handleBooking = async () => {
    setBookingLoading(true);
    try {
      if (selectedTimeSlot) {
        // Combine the selected date and time slot
        const startDateStr = moment(startDate).format("YYYY-MM-DD");
        const startTimeStr = `${startDateStr}T${selectedTimeSlot}:00`;

        // Prepare the booking data
        const bookingData = {
          userId: user?._id ?? "",
          expertId: expertProfile?._id ?? "",
          startTime: startTimeStr,
          endTime: calculateEndTime(startTimeStr, duration),
          sessionType: "video",
          ratePerMinute: expertProfile?.pricePerMinute ?? 0,
          totalCost: (expertProfile?.pricePerMinute ?? 0) * duration,
          confirmationStatus: "pending",
        };

        // Dispatch the bookSession action to create a booking
        const bookingResponse = await dispatch(
          bookSession(bookingData)
        ).unwrap();

        // Prepare the order data
        const orderData = {
          amount: ((expertProfile?.pricePerMinute ?? 0) * duration).toString(),
          sessionId: bookingResponse._id,
          expertId: expertProfile?._id ?? "",
          currency: "INR",
        };

        // Dispatch the createOrder action to create an order
        const orderResponse = await dispatch(createOrder(orderData)).unwrap();

        // Initialize Razorpay with the order details
        const razorpay = new window.Razorpay({
          key: orderResponse.razorpayConfig.key,
          amount: orderResponse.order.amount,
          currency: orderResponse.order.currency,
          name: orderResponse.razorpayConfig.name,
          order_id: orderResponse.order.id,
          prefill: orderResponse.razorpayConfig.prefill,
          external: orderResponse.razorpayConfig.external,
          handler: async function (response: any) {
            // Verify the payment after successful transaction
            await dispatch(
              verifyPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              })
            );
            console.log("Payment successful");
          },
        });

        // Open the Razorpay payment modal
        razorpay.open();
      } else {
        console.error("No time slot selected.");
      }
    } catch (error) {
      console.error("Error during booking and payment:", error);
    }
    setBookingLoading(false);
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [date, time] = startTime.split("T");
    const [hours, minutes] = time.split(":");
    const start = new Date(date);
    start.setHours(parseInt(hours));
    start.setMinutes(parseInt(minutes));
    const end = new Date(start.getTime() + duration * 60000);
    return `${end.toISOString().split("T")[0]}T${end
      .toTimeString()
      .slice(0, 5)}`;
  };

  return (
    <div className="max-w-lg px-4 mx-auto mt-auto relative pt-6 md:pt-18">
      {!showCheckoutDetails && (
        <div>
          {loading ? (
            <Skeleton className="rounded-[35px] h-[420px] w-full " />
          ) : (
            <Image
              className="rounded-[35px] h-[360px] md:h-[420px] w-full object-cover"
              alt="user profile"
              width={450}
              height={450}
              src={expertUser.profilePicture}
            />
          )}
          <div className="flex justify-between mt-6">
            <div>
              <div className="flex gap-2">
                <h1 className="text-2xl font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {loading ? (
                    <Skeleton count={1} />
                  ) : (
                    expertUser.name || username
                  )}
                </h1>
                {expertProfile?.isVerified == true && (
                  <Image
                    className="my-auto justify-center"
                    src="/images/icons/verified.svg"
                    alt="user"
                    height={18}
                    width={18}
                  />
                )}
              </div>
            </div>
            {!error && (
              <div className="flex gap-2">
                {expertProfile?.socialMedia?.map(
                  (link: string, index: number) => {
                    if (link.trim() !== "") {
                      const icon = getSocialMediaIcon(link);

                      return (
                        <Link
                          key={index}
                          href={`https://${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="bg-[#ECEBE7] text-green-500 rounded-full p-2.5">
                            <Image
                              alt="social media logo"
                              src={icon}
                              height={20}
                              width={20}
                            />
                          </div>
                        </Link>
                      );
                    }
                    return null;
                  }
                )}
              </div>
            )}
          </div>

          {error ? (
            <div className="text-center mt-20 text-2xl">
              User doesn&apos;t exist
            </div>
          ) : (
            <>
              <p className="text-lg w-4/5 -mt-3 font-regular text-[#A4A4A4] overflow-hidden whitespace-nowrap overflow-ellipsis">
                {loading ? <Skeleton width={150} /> : expertProfile?.profession}{" "}
              </p>
              <p className="text-lg font-regular mt-2 text-[#A4A4A4]">
                {loading ? <Skeleton count={2} /> : expertUser.bio}
              </p>

              <div className="mt-8">
                <hr />
                <div className="flex justify-between px-8">
                  <div className="text-center py-2 md:py-4">
                    <p className="text-xl font-semibold">
                      {loading || totalMeetings === null ? (
                        <Skeleton width={50} />
                      ) : (
                        totalMeetings || 0
                      )}
                    </p>
                    <p className="text-md text-[#A4A4A4]">Meetings</p>
                  </div>
                  <div className="border border-[#ECEBE7] h-12 md:h-16 self-center w-[1px] mx-4" />
                  <div className="text-center py-2 md:py-4">
                    <p className="text-xl font-semibold">
                      {loading ? <Skeleton width={50} /> : averageRating ?? 0}
                    </p>
                    <p className="text-md text-[#A4A4A4]">Rating</p>
                  </div>
                  <div className="border border-[#ECEBE7] h-12 md:h-16 self-center w-[1px] mx-4" />
                  <div className="text-center py-2 md:py-4">
                    <p className="text-xl font-semibold">
                      {loading || totalReviews === null ? (
                        <Skeleton width={50} />
                      ) : (
                        totalReviews || 0
                      )}
                    </p>
                    <p className="text-md text-[#A4A4A4]">Reviews</p>
                  </div>
                </div>
                <hr />
              </div>

              <div>
                <p className="text-xl mt-8 mb-6 font-medium border-b-4 w-6 center">
                  Expertise
                </p>
                {loading ? (
                  <Skeleton count={3} className="h-12 mt-2" />
                ) : expertProfile?.expertiseAreas &&
                  expertProfile?.expertiseAreas.length > 0 ? (
                  expertProfile.expertiseAreas.map((expertise, index) => (
                    <div
                      key={index}
                      className="bg-[#ECEBE7] mt-2 py-2 pl-4 rounded-xl"
                    >
                      <p className="text-[#484848] font-medium">{expertise}</p>
                    </div>
                  ))
                ) : (
                  <p>No expertise areas found.</p>
                )}
              </div>

              {reviews && reviews.length === 0 && <div className="mb-32" />}

              {reviews && reviews.length > 0 && (
                <>
                  <p className="text-xl mt-8 font-medium border-b-4 w-6 center">
                    Reviews
                  </p>
                  {reviews.map((review) => (
                    <div key={review._id} className="mt-6">
                      <div className="border-[1px] rounded-2xl border-[#ECEBE7] p-3 text-[#5F5F5F]">
                        <p>{review.comment}</p>
                        <p className="text-lg font-semibold mt-2">
                          {review.reviewer.name}
                        </p>
                        <p className="text-sm text-[#9A9A9A] font-regular">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}{" "}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="mb-30" />
                </>
              )}
              {reviews && reviews.length > 0 && <div className="mb-32" />}
              <div className="fixed bottom-4 w-full left-0 right-0 mx-auto">
                <div className="absolute bottom-4 w-full px-4">
                  <div
                    className="text-center items-center justify-between flex gap-2 hover:cursor-pointer rounded-full bg-[#252525] px-4 py-2 text-[#5F5F5F] max-w-lg mx-auto"
                    // onClick={showCheckoutDetailsSection}
                    onClick={handleClick}
                  >
                    <p className="text-center mx-auto text-xl md:text-2xl py-2 md:py-3 text-white">
                      Download The app
                    </p>
                    {/* <div className="flex gap-2">
                      <Image
                        className="my-auto justify-center"
                        src="/images/icons/calender.svg"
                        alt="user"
                        height={44}
                        width={44}
                      />
                      <div className="text-start">
                        <p className="text-[#ffffff] text-lg">{duration} min</p>
                        <p className="text-md">Video Session</p>
                      </div>
                    </div>
                    <p className="px-3 py-2 flex gap-1 items-center font-semibold text-lg rounded-full bg-white">
                      ₹
                      {expertProfile?.pricePerMinute
                        ? expertProfile.pricePerMinute * duration
                        : 0}
                      <span>
                        <FiArrowRight size={24} className="font-bold" />
                      </span>
                    </p> */}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {showCheckoutDetails && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div />
            <button onClick={hideCheckoutDetailsSection}>
              <RxCross1 size={24} />
            </button>
          </div>

          <div>
            <p className="mt-4">MESSAGE</p>
            <textarea
              className="bg-[#EEEEEE] p-4 rounded-3xl mt-3 focus:border-none"
              value={message}
              onChange={handleChange}
              rows={3}
              placeholder="Type your message here..."
              style={{ width: "100%" }}
            />
          </div>

          <p className="mt-4">DURATION</p>
          <div className="flex gap-8 mt-4">
            <Image
              className="cursor-pointer"
              src="/images/icons/minus.svg"
              alt="decrease duration"
              height={28}
              width={28}
              onClick={decrementDuration}
            />
            <p>{duration} Mins</p>
            <Image
              className="cursor-pointer"
              src="/images/icons/add.svg"
              alt="increase duration"
              height={28}
              width={28}
              onClick={incrementDuration}
            />
          </div>

          <p className="mt-6">DATE</p>
          <CustomSwiper
            availabilityDates={availabilityDates}
            handleDateSelection={handleDateSelection}
          />

          <p className="mt-6">TIME SLOTS</p>
          <div className="grid grid-cols-4 md:grid-cols-6 mb-36 gap-2">
            {slotsLoading ? (
              <div className="col-span-full text-center">
                <ClipLoader color="#252525" size={24} />
              </div>
            ) : processedSlots.length > 0 ? (
              processedSlots.map((slot, index) => (
                <p
                  key={index}
                  className={`py-2 px-4 border-[1px] mt-4 rounded-lg w-fit ${
                    selectedTimeSlot === slot
                      ? "bg-[#EAEAEA]"
                      : "border-[#EAEAEA]"
                  }`}
                  onClick={() => handleTimeSlotSelection(slot)}
                >
                  {slot}
                </p>
              ))
            ) : (
              <p className="text-center pt-16 col-span-full">
                No time slots available
              </p>
            )}
          </div>

          {/* booking button */}
          <div className="fixed bottom-4 w-full left-0 right-0 mx-auto">
            <div className="absolute bottom-4 w-full px-4">
              <div
                className="text-center items-center justify-between flex gap-2 hover:cursor-pointer rounded-full bg-[#252525] px-4 py-2 text-[#5F5F5F] max-w-lg mx-auto"
                onClick={handleBooking}
              >
                <div className="flex gap-2">
                  <Image
                    className="my-auto justify-center"
                    src="/images/icons/calender.svg"
                    alt="user"
                    height={44}
                    width={44}
                  />
                  <div className="text-start">
                    <p className="text-[#ffffff] text-lg">{duration} min</p>
                    <p className="text-md">Video Session</p>
                  </div>
                </div>
                <p className="px-3 py-2 flex gap-1 items-center font-semibold text-lg rounded-full bg-white">
                  ₹
                  {expertProfile?.pricePerMinute
                    ? expertProfile.pricePerMinute * duration
                    : 0}
                  <span>
                    <FiArrowRight size={24} className="font-bold" />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <LoginForm onLoginSuccess={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default ExpertProfilePage;
