"use client";

import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchExpertData } from "../features/expertSlice";
import { FiArrowRight } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Expert = ({ params }: { params: { username: string } }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    expertProfile,
    expertUser,
    reviews,
    totalReviews,
    averageRating,
    totalMeetings,
    loading,
    error,
  } = useSelector((state: RootState) => state.expert);
  const [message, setMessage] = useState<string>("");
  const [duration, setDuration] = useState<number>(15);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showCheckoutDetails, setShowCheckoutDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= 200) {
      setMessage(event.target.value);
    }
  };

  const [availableSlots, setAvailableSlots] = useState<
    { startTime: string; endTime: string; _id: string }[]
  >([]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchAvailableSlots = async (date: Date) => {
    try {
      setSlotsLoading(true); // Start loading
      const expertId = expertProfile?.expertId?._id;
      const userId = user?._id;
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const localDate = moment(date).tz(userTimeZone);
      const formattedDateWithTimezone = localDate.format(
        "YYYY-MM-DDTHH:mm:ssZ"
      );

      const response = await api.get(
        `/api/users/expert/availability/${expertId}/${userId}/${formattedDateWithTimezone}`
      );
      setAvailableSlots(response.data.availability.slots);
      setSlotsLoading(false); // Stop loading
    } catch (error) {
      console.error("Failed to fetch available slots:", error);
      setSlotsLoading(false); // Stop loading on error
    }
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
    if (startDate !== null) {
      fetchAvailableSlots(startDate);
    }
  }, [startDate]);

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

  useEffect(() => {
    dispatch(fetchExpertData(params.username));
  }, [dispatch, params.username]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!expertProfile || !expertUser) {
    return null;
  }

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

  const convertToLocalTime = (utcTime: string) => {
    const [hours, minutes] = utcTime.slice(0, -1).split(":");
    const date = new Date();
    date.setUTCHours(Number(hours));
    date.setUTCMinutes(Number(minutes));
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const generateTimeSlots = (
    startTime: string,
    endTime: string,
    duration: number
  ) => {
    const slots = [];
    let currentTime = new Date(`2000-01-01T${startTime}`);
    const endDateTime = new Date(`2000-01-01T${endTime}`);

    while (currentTime < endDateTime) {
      slots.push(
        currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }

    return slots;
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

  const hideCheckoutDetailsSection = () => {
    setShowCheckoutDetails(false);
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":");
    const endTime = new Date();
    endTime.setHours(parseInt(hours, 10));
    endTime.setMinutes(parseInt(minutes, 10) + duration);
    return endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleBooking = async () => {
    setBookingLoading(true);
    try {
      if (selectedTimeSlot) {
        // Detect the user's local time zone
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Combine the selected date and time slot
        const startDateStr = moment(startDate).format("YYYY-MM-DD");
        const startTimeStr = `${startDateStr}T${selectedTimeSlot}:00`;

        // Use the detected time zone
        const startTime = moment.tz(startTimeStr, userTimeZone);

        // Calculate the end time based on the duration
        const endTime = moment(startTime).add(duration, "minutes");

        // Prepare the booking data
        const bookingData = {
          userId: user?._id ?? "",
          expertId: expertProfile.expertId?._id ?? "",
          startTime: startTime.format(),
          endTime: endTime.format(),
          sessionType: "video",
          ratePerMinute: expertProfile.expertId?.pricePerMinute ?? 0,
          totalCost: (expertProfile.expertId?.pricePerMinute ?? 0) * duration,
          confirmationStatus: "pending",
        };

        // Dispatch the bookSession action to create a booking
        const bookingResponse = await dispatch(
          bookSession(bookingData)
        ).unwrap();

        // Prepare the order data
        const orderData = {
          amount: (
            (expertProfile.expertId?.pricePerMinute ?? 0) * duration
          ).toString(),
          sessionId: bookingResponse._id,
          expertId: expertProfile.expertId?._id ?? "",
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

  return (
    <div className="max-w-lg mx-auto mt-auto relative pt-24 md:pt-28">
      {!showCheckoutDetails && (
        <div>
          {loading ? (
            <Skeleton className="rounded-[90px] h-[420px] w-full " />
          ) : (
            <Image
              className="rounded-[90px] h-[360px] md:h-[420px] w-full object-cover"
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
                  {loading ? <Skeleton count={1} /> : expertUser.name}
                </h1>
              </div>
            </div>

            <div className="flex gap-2">
              {expertProfile.expertId.socialMedia?.map((link, index) => {
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
              })}
            </div>
          </div>

          <p className="text-lg w-4/5 -mt-3 font-regular  text-[#A4A4A4] overflow-hidden whitespace-nowrap overflow-ellipsis">
            {loading ? (
              <Skeleton width={150} />
            ) : (
              expertProfile.expertId.profession
            )}{" "}
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
            ) : (
              expertProfile.expertId.expertiseAreas &&
              expertProfile.expertId.expertiseAreas.map((expertise, index) => (
                <div
                  key={index}
                  className="bg-[#ECEBE7] mt-2 py-2 pl-4 rounded-xl"
                >
                  <p className="text-[#484848] font-medium">{expertise}</p>
                </div>
              ))
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
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
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
                onClick={showCheckoutDetailsSection}
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
                  ₹{expertProfile.expertId.pricePerMinute * duration}
                  <span>
                    <FiArrowRight size={24} className="font-bold" />
                  </span>
                </p>
              </div>
            </div>
          </div>
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
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            minDate={new Date()}
            placeholderText="DD-MM-YYYY"
            className="bg-[#EEEEEE] p-4 rounded-3xl mt-3 focus:border-none w-full"
          />

          <p className="mt-6">TIME SLOTS</p>
          <div className="grid grid-cols-4 md:grid-cols-6 mb-36 gap-2">
            {slotsLoading ? (
              <div className="col-span-full text-center">
                <ClipLoader color="#252525" size={24} />
              </div>
            ) : availableSlots.length > 0 ? (
              availableSlots.map((slot) => {
                const localStartTime = convertToLocalTime(slot.startTime);
                const localEndTime = convertToLocalTime(slot.endTime);
                const timeSlots = generateTimeSlots(
                  localStartTime,
                  localEndTime,
                  duration
                );

                return timeSlots.length > 0 ? (
                  timeSlots.map((timeSlot, index) => (
                    <p
                      key={`${slot._id}-${index}`}
                      className={`py-2 px-4 border-[1px] mt-4 rounded-lg w-fit ${
                        selectedTimeSlot === timeSlot
                          ? "bg-[#EAEAEA]"
                          : "border-[#EAEAEA]"
                      }`}
                      onClick={() => handleTimeSlotSelection(timeSlot)}
                    >
                      {timeSlot}
                    </p>
                  ))
                ) : (
                  <p className="text-center pt-16 col-span-full">
                    No time slots available
                  </p>
                );
              })
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
                  {bookingLoading ? (
                    <ClipLoader color="#ff252525" size={24} />
                  ) : (
                    <span className="flex gap-1 items-center">
                      ₹{expertProfile.expertId.pricePerMinute * duration}
                      <span>
                        <FiArrowRight size={24} className="font-bold" />
                      </span>
                    </span>
                  )}
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

export default Expert;
