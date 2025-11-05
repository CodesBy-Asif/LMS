'use client'
import React, { useState, FC, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { styles } from "../../styles/styles";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  setRoute: (route: string) => void;
};

const Schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const SignUp: FC<Props> = ({ setRoute }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [register,{isError,data,error,isSuccess}] = useRegisterMutation();

  useEffect(() => {
    if(isSuccess) {
      const message = data?.message || "Registration successful";
      toast.success(message);
      setRoute("Verification");
    }
    if(error) {
      if("data" in error) {
        const errordata = error as any;
        const message = errordata.data.message || "Something went wrong";
        toast.error(message);
      }
    }
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    
    },
    validationSchema: Schema,
    onSubmit: async ({name, email, password}) => {
      const data = {
        name,
        email,
        password,
      };
     await register(data);  
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full max-h-[85vh] max-w-sm min-w-100 mx-auto px-8 py-2  overflow-auto">
      <h1 className={`${styles.title} mb-4`}>Sign Up for Edura</h1>
      <form onSubmit={handleSubmit} className="space-y-2 ">
        {/* Name */}
        <div>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className={styles.input}
          />
          {touched.name && errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={styles.input}
          />
          {touched.email && errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5 text-gray-600" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

      
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`${styles.buttomPrimary} w-full`}
          >
            Sign Up
          </button>
        </div>

      
      </form>
        <br />
        <h5 className="text-center mb-2 text-gray-800 dark:text-gray-100 text-sm">Or Join with</h5>
        <div className="flex justify-center gap-4">
          <button className={`${styles.buttonOutline}`}>
            <FcGoogle />
          </button>
          <button className={`${styles.buttonOutline}`}>
            <FaGithub />
          </button>
        </div>

        <h5 className="text-center mt-2 text-gray-800 dark:text-gray-100 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => setRoute("Login")}
            className="text-primary hover:underline"
          >
            Login
          </button>
        </h5>
    </div>
  );
};

export default SignUp;
