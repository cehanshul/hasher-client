"use client";
import { fetchExpertAnalytics } from "@/app/features/expertSlice";
import { fetchUserDetails } from "@/app/features/userSlice";
import { AppDispatch, RootState } from "@/app/store/store";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Expert = ({ params }: { params: { username: string } }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user);
  const {
    reviews,
    totalReviews,
    averageRating,
    totalMeetings,
    loading: reviewsLoading,
    error: reviewsError,
  } = useSelector((state: RootState) => state.expert);
  useEffect(() => {
    dispatch(fetchUserDetails(params.username));
  }, [dispatch, params.username]);

  useEffect(() => {
    if (user) {
      console.log(`user from page.tsx${JSON.stringify(user.expertId._id)}`);
      dispatch(fetchExpertAnalytics(user.expertId._id));
    }
  }, [dispatch, user]);

  if (userLoading || reviewsLoading) {
    return <div>Loading...</div>;
  }

  if (userError || reviewsError) {
    return <div>Error: {userError || reviewsError}</div>;
  }

  if (!user) {
    return null;
  }
  console.log(user);

  const getSocialMediaIcon = (link: string) => {
    if (link.includes("instagram.com")) {
      return "/images/social/instagram.svg";
    } else if (link.includes("facebook.com")) {
      return "/images/social/facebook.svg";
    } else if (link.includes("x.com")) {
      return "/images/social/x.svg";
    } else if (link.includes("twitter.com")) {
      return "/images/social/x.svg";
    } else if (link.includes("behance.com")) {
      return "/images/social/behance.svg";
    } else if (link.includes("behance.net")) {
      return "/images/social/behance.svg";
    } else if (link.includes("twitter.com")) {
      return "/images/social/x.svg";
    } else if (link.includes("discord.com")) {
      return "/images/social/discord.svg";
    } else if (link.includes("discord.gg")) {
      return "/images/social/discord.svg";
    } else if (link.includes("figma.com")) {
      return "/images/social/figma.svg";
    } else if (link.includes("github.com")) {
      return "/images/social/github.svg";
    } else if (link.includes("linkedin.com")) {
      return "/images/social/linkedin.svg";
    } else if (link.includes("reddit.com")) {
      return "/images/social/reddit.svg";
    } else if (link.includes("youtube.com")) {
      return "/images/social/youtube.svg";
    }

    // Add more conditions for other social media platforms
    // Return a default icon if none of the conditions match
    return "/images/social/custom_link.svg"; // Point to the default icon image
  };

  return (
    <>
      <div className="max-w-lg mx-auto mt-auto relative">
        <Image
          className="rounded-[90px] h-[420] w-full object-cover"
          alt="user profile"
          width={450}
          height={450}
          src={user.profilePicture}
        ></Image>
        <div className="flex justify-between mt-6">
          <div>
            <h1 className="text-2xl font-semibold ">{user.name}</h1>
          </div>

          <div className="flex gap-2">
            {user.expertId.socialMedia.map((link, index) => {
              const icon = getSocialMediaIcon(link);

              return (
                <a
                  key={index}
                  href={link}
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
                </a>
              );
            })}
          </div>
        </div>
        <p className="text-lg font-regular -mt-3 text-[#A4A4A4]">
          {user.expertId.profession}
        </p>
        <p className="text-lg font-regular mt-2 text-[#A4A4A4]">{user.bio}</p>
        <div className="mt-8">
          <hr />
          <div className="flex justify-between px-8">
            <div className="text-center py-4">
              <p className="text-xl font-semibold">{totalMeetings}</p>
              <p className="text-md text-[#A4A4A4]">Meetings</p>
            </div>
            <div className="border border-[#ECEBE7] h-16 self-center w-[1px] mx-4"></div>
            <div className="text-center py-4">
              <p className="text-xl font-semibold">{averageRating ?? 0}</p>
              <p className="text-md text-[#A4A4A4]">Rating</p>
            </div>
            <div className="border border-[#ECEBE7] h-16 self-center w-[1px] mx-4"></div>
            <div className="text-center py-4">
              <p className="text-xl font-semibold">{totalReviews}</p>
              <p className="text-md text-[#A4A4A4]">Reviews</p>
            </div>
          </div>
          <hr />
        </div>
        <div>
          <p className="text-xl mt-8 mb-6 font-medium border-b-4 w-6 center">
            Expertise
          </p>
          {user.expertId.expertiseAreas.map((expertise, index) => (
            <div key={index} className="bg-[#ECEBE7] mt-2 py-2 pl-4 rounded-xl">
              <p className="text-[#484848] font-medium ">{expertise}</p>
            </div>
          ))}
        </div>

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
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            <div className="mb-20"></div>
            {/* <div className="mt-6 mb-20">
              <div className="border-[1px] text-center rounded-2xl border-[#ECEBE7] p-3 text-[#5F5F5F]">
                <p className="font-medium">Show All Reviews</p>
              </div>
            </div> */}
          </>
        )}
        <div className="fixed bottom-4 w-full left-0 right-0 mx-auto">
          <div className="absolute bottom-4 w-full px-4">
            <div className="text-center hover:cursor-pointer rounded-full bg-[#252525] p-6 text-[#5F5F5F] max-w-lg mx-auto">
              <p className="font-medium text-white text-xl">Download the app</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Expert;
