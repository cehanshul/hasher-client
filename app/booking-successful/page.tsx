"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BookingSuccessfulPage() {
  const searchParams = useSearchParams();

  const expertName = searchParams.get("expertName") || "Expert";
  const expertProfilePicture = decodeURIComponent(
    searchParams.get("expertProfilePicture") || ""
  );
  const date = searchParams.get("date")
    ? new Date(searchParams.get("date")!)
    : new Date();
  const startTime = searchParams.get("startTime") || "";
  const endTime = searchParams.get("endTime") || "";
  const sessionType = searchParams.get("sessionType") || "Session";

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Image
            src={expertProfilePicture || "/default-avatar.jpg"}
            alt={expertName}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="ml-2 font-semibold">{expertName}</span>
        </div>
        <Link href="/" className="text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </Link>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block p-2 bg-green-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold">Booking confirmed</h2>
        <p className="text-gray-600">for {sessionType}</p>
      </div>

      <div className="border border-green-200 rounded-lg p-4 flex items-center justify-between mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-gray-700">
          {formattedDate} | {startTime} - {endTime}
        </span>
      </div>

      <p className="text-center text-sm text-gray-600">
        Meeting details are sent to your Email and Mobile number
      </p>
    </div>
  );
}
