'use client'
import { styles } from "@/app/styles/styles";
import { useActiivationMutation } from "@/redux/features/auth/authApi";
import React, { useState, useRef, FC, use, useEffect } from "react";
import toast from "react-hot-toast";
import { FcLock } from "react-icons/fc";
import { useSelector } from "react-redux";

type Props = {
 setRoute: (route: string) => void;
};

const OTPVerification: FC<Props> = ({setRoute}) => {
  const [otp, setOtp] = useState(Array(4).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const {token} = useSelector((state:any) => state.auth);
  const [activation,{data,error,isSuccess}] = useActiivationMutation();
  const length =4;
  useEffect(() => {
   
    if(isSuccess) {
      const message = data?.Message || "Registration successful";
      toast.success(message);
      setRoute("Login");
    }
    if(error) {
      if("data" in error) {
        const errordata = error as any;
        const message = errordata.data.message || "Something went wrong";
        toast.error(message);
      }
    }
    }, [isSuccess, error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").slice(0, length).replace(/\D/g, ""); // only digits
    const newOtp = [...otp];

    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
      inputsRef.current[i]?.focus();
    }

    setOtp(newOtp);

    if (newOtp.every((digit) => digit !== "") && newOtp.length === 4) {
      await activation({activationcode:newOtp.join(""),token:token});
      
  };
  }
  const handleSubmit = async () => {
    if (otp.every((digit) => digit !== "")) {
     await activation({activationcode:otp.join(""),token:token});
     setRoute("Login");
    } else {
      alert("Please complete all OTP digits");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto pb-6 px-6 bg-background rounded-md ">
       <div className="flex justify-center items-center mb-4">
        <FcLock className="text-8   text-8xl"/>
       </div>
        <h1 className={`${styles.title} mb-6 !text-3xl `}>Verify Your Account</h1>
      <p className="text-center text-foreground mb-6">We sent a 4-digit code to your email </p>

      <div className="flex justify-center dark:text-gray-100 gap-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(el) => void (inputsRef.current[index] = el)}
            className="w-12 h-12 text-center text-xl  rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-gray-200  dark:bg-gray-800 dark:text-foreground"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition"
      >
        Verify OTP
      </button>
    </div>
  );
};

export default OTPVerification;
