"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendCode,
  verifyCode,
  clearError,
  selectAuthState,
} from "../features/authSlice";
import { AppDispatch } from "../store/store";
import { useRouter } from "next/navigation";
import { MdArrowBackIos } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setUser, updateUserProfile } from "../features/user/userSlice";
import { selectUserState } from "../features/user/userSlice";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { ClipLoader } from "react-spinners";
const LoginForm: React.FC<{ onLoginSuccess: () => void }> = ({
  onLoginSuccess,
}) => {
  const [country, setCountry] = useState("+91");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDOB] = useState<Date | null>(null);
  const [showOTPField, setShowOTPField] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const today = new Date();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error: authError } = useSelector(selectAuthState);
  const { loading: userLoading, error: userError } =
    useSelector(selectUserState);
  const { updateError } = useSelector(selectUserState);
  const validateForm = () => {
    if (phone.trim() === "") {
      toast.error("Phone number is required.");
      return false;
    }
    if (showOTPField && code.trim() === "") {
      toast.error("OTP is required.");
      return false;
    }
    if (showAdditionalFields) {
      if (name.trim() === "") {
        toast.error("Name is required.");
        return false;
      }
      if (username.trim().length < 8) {
        toast.error("Username must be at least 8 characters long.");
        return false;
      }
      if (gender.trim() === "") {
        toast.error("Please select a gender.");
        return false;
      }
      if (!dob) {
        toast.error("Date of birth is required.");
        return false;
      }
    }
    return true;
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(event.target.value);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const handleSendCode = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    dispatch(clearError());
    try {
      await dispatch(sendCode({ phone: `${country}${phone}` })).unwrap();
      setShowOTPField(true);
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };

  const handleVerifyCode = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    dispatch(clearError());
    try {
      const response = await dispatch(
        verifyCode({ phone: `${country}${phone}`, code })
      ).unwrap();
      const { status, ...userData } = response.data;
      localStorage.setItem("userData", JSON.stringify(userData));
      if (status === "NEW") {
        setShowOTPField(false);
        setShowAdditionalFields(true);
      } else if (status === "ACTIVE") {
        onLoginSuccess();
        const {
          token,
          _id: userId,
          ...userData
        } = JSON.parse(localStorage.getItem("userData") || "{}");
        dispatch(setUser({ ...userData, _id: userId }));
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };

  const handleUpdateUserProfile = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const userData = {
      name,
      username,
      gender,
      dob: dob?.toISOString().split("T")[0],
    };
    const { token, _id: userId } = JSON.parse(
      localStorage.getItem("userData") || "{}"
    );

    dispatch(clearError());

    try {
      const response = await dispatch(
        updateUserProfile({ userId, userData, token })
      ).unwrap();
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...userData, _id: userId, token, status: "ACTIVE" })
      );

      onLoginSuccess();
      router.push("/");
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(
        "Failed to update profile: " + (error.message || "Unknown error")
      );
    }
    setIsSubmitting(false);
  };

  const renderInputField = (
    id: string,
    label: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div className="relative w-full min-w-[200px]">
      <input
        placeholder=""
        id={id}
        value={value}
        onChange={onChange}
        className="peer w-full bg-transparent mt-6 pb-2 pl-6 outline-none"
      />
      <label
        htmlFor={id}
        className="absolute top-1 left-6 text-sm text-gray-600 transition-all peer-focus:leading-tight peer-placeholder-shown:leading-10"
      >
        {label}
      </label>
    </div>
  );

  const renderInputFieldBorder = (
    id: string,
    label: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div className="relative w-full min-w-[200px]">
      <input
        placeholder=""
        id={id}
        value={value}
        onChange={onChange}
        className="peer w-full bg-transparent border-b border-gray-400 mt-6 pb-2 pl-6 outline-none"
      />
      <label
        htmlFor={id}
        className="absolute top-1 left-6 text-sm text-gray-600 transition-all peer-focus:leading-tight peer-placeholder-shown:leading-10"
      >
        {label}
      </label>
    </div>
  );

  const renderDatePickerField = (
    id: string,
    label: string,
    selected: Date | null,
    onChange: (date: Date | null) => void
  ) => (
    <div className="relative w-full min-w-[200px]">
      <DatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        maxDate={today}
        className="peer w-full bg-transparent  mt-6 pb-2 pl-6 outline-none"
        dateFormat="yyyy-MM-dd"
      />
      <label
        htmlFor={id}
        className="absolute top-1 left-6 text-sm text-gray-600 transition-all peer-focus:leading-tight peer-placeholder-shown:leading-10"
      >
        {label}
      </label>
    </div>
  );

  return (
    <form className="space-y-4 ">
      <div className="rounded-2xl">
        <div className="md:px-6 md:py-4 rounded-3xl p-4 top-2 mx-auto bg-white">
          {showOTPField && !showAdditionalFields && (
            <button
              type="button"
              className=" top-2 left-2 text-gray-600"
              onClick={() => setShowOTPField(false)}
            >
              <MdArrowBackIos />
            </button>
          )}
          {!showOTPField && !showAdditionalFields && (
            <h3 className="text-lg md:text-xl text-[#000000] pb-[23px] pt-4 lg:pt-0">
              Sign in to Continue
            </h3>
          )}
          {showOTPField && !showAdditionalFields && (
            <h3 className="text-lg mt-4 md:text-xl text-[#000000] pb-[23px] pt-4 lg:pt-0">
              Verify code
            </h3>
          )}
          {showAdditionalFields && (
            <h3 className="text-lg mt-4 md:text-xl text-[#000000] pb-[23px] pt-4 lg:pt-0">
              Create Account
            </h3>
          )}
          <RxCross2
            onClick={onLoginSuccess}
            className="text-[20px] absolute right-4 top-4 cursor-pointer"
          />
          <div className="rounded-xl border border-gray-400">
            {!showOTPField && !showAdditionalFields && (
              <>
                <div className="relative inline-flex w-full border-gray-400 border-b">
                  <select
                    id="Country"
                    value={country}
                    onChange={handleCountryChange}
                    className="peer w-full bg-transparent mt-6 pb-2 pl-6 outline-none appearance-none"
                  >
                    <option value="+91">India (+91)</option>
                    <option value="+233">Ghana (+233)</option>
                  </select>
                  <label className="absolute top-1 pl-6 text-[12px] text-gray-600 transition-all peer-focus:leading-tight peer-placeholder-shown:leading-10">
                    Country
                  </label>
                </div>
                {renderInputField("phone", "Phone Number", phone, (event) =>
                  setPhone(event.target.value)
                )}
              </>
            )}
            {showOTPField && !showAdditionalFields && (
              <>
                {renderInputField("code", "OTP", code, (event) =>
                  setCode(event.target.value)
                )}
              </>
            )}
            {showAdditionalFields && (
              <>
                {renderInputFieldBorder("name", "Name", name, (event) =>
                  setName(event.target.value)
                )}
                {renderInputFieldBorder(
                  "username",
                  "Username",
                  username,
                  (event) => setUsername(event.target.value)
                )}
                <div className="relative inline-flex w-full border-gray-400 border-b">
                  <select
                    id="Gender"
                    value={gender}
                    onChange={handleGenderChange}
                    className="peer w-full bg-transparent mt-6 pb-2 pl-6 outline-none appearance-none"
                  >
                    <option defaultValue={""}>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                  <label className="absolute top-1 pl-6 text-[12px] text-gray-600 transition-all peer-focus:leading-tight peer-placeholder-shown:leading-10">
                    Gender
                  </label>
                </div>

                {renderDatePickerField("dob", "Date of Birth", dob, setDOB)}
              </>
            )}
          </div>

          {authError && <div className="text-red-500 mt-2">{authError}</div>}
          {userError && <div className="text-red-500 mt-2">{userError}</div>}
          {updateError && (
            <div className="text-red-500 mt-2">{updateError}</div>
          )}
          <button
            className="mt-6 md:mt-10 w-full py-3 text-[20px] text-white rounded-full bg-black disabled:bg-gray-500"
            type="button"
            onClick={
              showAdditionalFields
                ? handleUpdateUserProfile
                : showOTPField
                ? handleVerifyCode
                : handleSendCode
            }
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <ClipLoader color="#FFFFFF" size={30} />
                {/* <span className="ml-2">Processing...</span> */}
              </div>
            ) : showAdditionalFields ? (
              "Create account"
            ) : showOTPField ? (
              "Verify OTP"
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
