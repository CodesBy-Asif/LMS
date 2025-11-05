"use client";

import React, { FC } from "react";
import {IoMdCheckmark} from "react-icons/io"
interface props {
    activeTab: number,
    setActiveTab:(activeTab: number) => void
}
const CourseOptions:FC<props> = ({activeTab, setActiveTab}) => {
    const options =[
        "Course Information",
        "Course Options",
        "Course Content",
        "Course Preview"
    ]
  return (
    <div className="md:block md:overflow-hidden overflow-x-scroll flex">{
        options.map((option, index) => (
<div key={index}    className="w-full flex md:flex-row flex-col  py-5 items-center">
    <div className={`w-[35px] h-[35px] rounded-full bg-card flex items-center justify-center ${(activeTab+1) > index?"bg-primary text-foreground":"bg-card text-foreground"} relative`}>
        <IoMdCheckmark className={`text[35px]  bg-prrimary `}/>
{index !== options.length-1 &&(
    <div 
    className={`absolute md:h-[30px] w-[30px] md:w-1 h-1 ${activeTab>index?"bg-primary text-foreground":"bg-card text-foreground"} md:bottom-[-100%] md:left-auto left-[120%] `}></div>
)}
    </div>
    <h5 className={`pl-3 ${activeTab===index?"text-primary":"text-foreground"}`}>{option}</h5>

</div>
        ))
    }
      
    </div>
  );
};

export default CourseOptions;
