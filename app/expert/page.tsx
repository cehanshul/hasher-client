"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../store/store";
import { fetchUserByUsername } from "../features/user/userSlice";
import { updateExpert } from "../features/expertSlice";
import { ExpertDetails } from "../types/expertType";

const ExpertSettingsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  //   const { username } = router.query;
  const username = "anshul";
  const user = useSelector((state: RootState) => state.user.user);
  const [profession, setProfession] = useState("");
  const [pricePerMinute, setPricePerMinute] = useState(0);
  const [socialMedia1, setSocialMedia1] = useState("");
  const [socialMedia2, setSocialMedia2] = useState("");
  //   const [lastMinuteBooking, setLastMinuteBooking] = useState(1);
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);

  useEffect(() => {
    if (username) {
      dispatch(fetchUserByUsername(username as string));
    }
  }, [dispatch, username]);

  useEffect(() => {
    if (user && user.expertDetails) {
      setProfession(user.expertDetails.profession || "");
      setPricePerMinute(user.expertDetails.pricePerMinute || 0);
      setSocialMedia1(user.expertDetails.socialMedia?.[0] || "");
      setSocialMedia2(user.expertDetails.socialMedia?.[1] || "");
      //   setLastMinuteBooking(user.expertDetails.lastMinuteBooking || 1);
      setExpertiseAreas(user.expertDetails.expertiseAreas || []);
    }
  }, [user]);

  const handleSubmit = async () => {
    const updatedDetails: Partial<ExpertDetails> = {
      profession,
      pricePerMinute,
      socialMedia: [socialMedia1, socialMedia2],
      //   lastMinuteBooking,
      expertiseAreas,
    };

    if (user && user.isExpert) {
      try {
        await dispatch(updateExpert({ userId: user._id, updatedDetails }));
        toast.success("Expert details updated successfully");
        router.push("/");
      } catch (error) {
        toast.error("Failed to update expert details");
      }
    } else {
      try {
        await axios.post("/api/experts", { userId: user?._id, updatedDetails });
        toast.success("Expert details submitted successfully");
        router.push("/");
      } catch (error) {
        toast.error("Failed to submit expert details");
      }
    }
  };

  const addExpertiseArea = () => {
    if (expertiseAreas.length < 5) {
      setExpertiseAreas([...expertiseAreas, ""]);
    }
  };

  const removeExpertiseArea = (index: number) => {
    const updatedAreas = [...expertiseAreas];
    updatedAreas.splice(index, 1);
    setExpertiseAreas(updatedAreas);
  };

  const updateExpertiseArea = (index: number, value: string) => {
    const updatedAreas = [...expertiseAreas];
    updatedAreas[index] = value;
    setExpertiseAreas(updatedAreas);
  };

  //   const increaseLastMinuteBooking = () => {
  //     if (lastMinuteBooking < 24) {
  //       setLastMinuteBooking(lastMinuteBooking + 1);
  //     }
  //   };

  //   const decreaseLastMinuteBooking = () => {
  //     if (lastMinuteBooking > 0) {
  //       setLastMinuteBooking(lastMinuteBooking - 1);
  //     }
  //   };

  return (
    <div className="mt-14 pl-10">
      <h1 className="text-2xl font-bold mb-4">
        {user?.isExpert ? "Expert Settings" : "Become an Expert"}
      </h1>
      <div className="mb-4">
        <p className="text-sm font-medium mb-1">PROFESSION</p>
        <input
          type="text"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          placeholder="mad scientist"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium mb-1">EXPERTISE</p>
        {expertiseAreas.map((area, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={area}
              onChange={(e) => updateExpertiseArea(index, e.target.value)}
              placeholder={`Expertise ${index + 1}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={() => removeExpertiseArea(index)}
              className="ml-2 text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        {expertiseAreas.length < 5 && (
          <button
            onClick={addExpertiseArea}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Expertise
          </button>
        )}
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium mb-1">PRICE PER MINUTE</p>
        <p className="text-xs text-gray-500 mb-1">
          Minimum price should be ₹10 (you can change it later)
        </p>
        <input
          type="number"
          value={pricePerMinute}
          onChange={(e) => setPricePerMinute(Number(e.target.value))}
          placeholder="₹10"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium mb-1">LAST MINUTE BOOKING</p>
        <p className="text-xs text-gray-500 mb-1">
          Minimum time between booking and meeting
        </p>
        {/* <div className="flex items-center">
          <button
            onClick={decreaseLastMinuteBooking}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
          >
            -
          </button>
          <span className="mx-4">{lastMinuteBooking} hrs</span>
          <button
            onClick={increaseLastMinuteBooking}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
          >
            +
          </button>
        </div> */}
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium mb-1">SOCIAL MEDIA</p>
        <div className="mb-2">
          <span className="text-gray-500">https://</span>
          <input
            type="text"
            value={socialMedia1}
            onChange={(e) => setSocialMedia1(e.target.value)}
            placeholder="instagram.com/zuck"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div>
          <span className="text-gray-500">https://</span>
          <input
            type="text"
            value={socialMedia2}
            onChange={(e) => setSocialMedia2(e.target.value)}
            placeholder="twitter.com/elonmusk"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Save
      </button>
    </div>
  );
};

export default ExpertSettingsPage;
