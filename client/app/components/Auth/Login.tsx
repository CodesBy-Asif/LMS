'use client'
import React, { useState, FC, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { styles } from "../../styles/styles";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useLoginMutation } from "../../../redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type Props = {
  setRoute: (route: string) => void;
  setopen: (open: boolean) => void;
};

const Schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const Login: FC<Props> = ({ setRoute,setopen }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [login,{isLoading,data,error}] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Schema,
    onSubmit: async ({ email, password }) => {
      await login({email,password});
    },
  });

  useEffect(()=>{
    if(data){
      toast.success("Login Successful");
      setRoute("")
      setopen(false)
      
    }
     if(error) {
      if("data" in error) {
        const errordata = error as any;
        const message = errordata.data.message || "Something went wrong";
        toast.error(message);
      }
    }
  },[data,error])


  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full max-w-sm min-w-100 mx-auto px-8 py-8">
      <h1 className={`${styles.title} mb-12`}>Login with Edura</h1>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        {/* Email */}
        <div>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
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
            disabled={isLoading}
            className={`${styles.buttomPrimary} w-full`}>
            {isLoading ? "loging in..." : "Login"}
          </button>
        </div>
      
      </form>
        <br />
        <h5 className="text-center mb-2  text-gray-800 dark:text-gray-100 text-sm">
            Or Join with
        </h5>
        <div className="flex justify-center gap-4">
            <button className={`${styles.buttonOutline}`} onClick={()=>signIn("google")}><FcGoogle/></button>
            <button className={`${styles.buttonOutline}`} onClick={()=>signIn("github")}><FaGithub/></button>
        </div>
        <h5 className="text-center mt-2 text-gray-800 dark:text-gray-100 text-sm">
            Don't have an account? <button onClick={()=>setRoute("Sign-up")} className="text-primary hover:underline">Sign Up</button>
        </h5>
    </div>
  );
};

export default Login;


