"use client";

import React, { useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import Options from "./Options";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "@/redux/features/courses/courseApi";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

const tabs = [
  { id: "info", label: "Course Information" },
  { id: "options", label: "Course Options" },
  { id: "content", label: "Course Content" },
  { id: "preview", label: "Course Preview" },
];

const CreateCourse = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [courseInfo, setCourseInfo] = useState({
        name: '',
        description: '',
      price: "",
       estimatedPrice: "",
       tags:"",
       level:"",
       demoUrl:"",
       thumbnail:""
    })
    const [banifets, setBanifets] = useState([{title:""}]); 
const [createCourse, {isSuccess,error}] = useCreateCourseMutation();
    const [prerequisites, setPrerequisites] = useState([{title:""}]);
const[courseContent, setCourseContent] = useState([{
    videoUrl: "",
    title: "",
    description: "",
    videoSection: "Untitled Section",
    links: [{title:"",
        url:""
    }],
    suggestions: "",
}]);
const [courseData, setCourseData] = useState({
  name: "",
  description: "",
  price: "",
  estimatedPrice: "",
  tags: "",
  level: "",
  demoUrl: "",
  thumbnail: "",
  banifets: [{ title: "" }],
  prerequisites: [{ title: "" }],
  courseData: [
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      links: [{ title: "", url: "" }],
      suggestions: "",
  }],
});

const handleSubmit = async() => {
const formatedBanefits = banifets.map((item: { title: string }) => ({
  title: item.title,
}));
const formatedPrerequisites = prerequisites.map((item: { title: string }) => ({
  title: item.title,
}));

const formatedContent = courseContent.map((item) => ({
  videoUrl: item.videoUrl,
  title: item.title,
  description: item.description,
  videoSection: item.videoSection,
  links: item.links,
  suggestions: item.suggestions,
}));

const courseData = {
  name: courseInfo.name,
  description: courseInfo.description,
  price: courseInfo.price,
  estimatedPrice: courseInfo.estimatedPrice,
  tags: courseInfo.tags,
  level: courseInfo.level,
  demoUrl: courseInfo.demoUrl,
  thumbnail: courseInfo.thumbnail,
  banifets: formatedBanefits,
  prerequisites: formatedPrerequisites,
  courseData: formatedContent,
};
setCourseData(courseData);
}
useEffect(() => {
  if(isSuccess) {
    toast.success("Course Created Successfully");
   redirect("/admin/courses")
  }
  if(error) {
   if("data" in error) {
     const errordata = error as any;
     const message = errordata.data.message || "Something went wrong";
     toast.error(message);
   }
  }
} ,[isSuccess,error])
const handleCourseCreate = async () => {
  await createCourse({data:courseData});
}
  return (
  <div className="bg-background flex md:flex-row flex-col-reverse gap-6 text-foreground p-6 rounded-lg shadow-md w-full">
  
      {/* Tabs */}
 
      <div className="md:w-[80%] ">
        {
          activeTab === 0 && <CourseInformation courseInfo={courseInfo} setCourseInfo={setCourseInfo} activeTab={activeTab} setActiveTab={setActiveTab}/>
        }
        {
          activeTab === 1 && <CourseOptions activeTab={activeTab} setactiveTab={setActiveTab} prerequisites={prerequisites} setPrerequisites={setPrerequisites} banefits={banifets} setBanefits={setBanifets} />
        }
        {
          activeTab === 2 && <CourseContent activeTab={activeTab} setActiveTab={setActiveTab} courseContent={courseContent} setCourseContent={setCourseContent}  handleSubmit={handleSubmit}/>
        }
        {
          activeTab === 3 && <CoursePreview  courseData={courseData} activeTab={activeTab} setActiveTab={setActiveTab} handleCourseCreate={handleCourseCreate} />
        }
        
      </div>
      <div className="md:w-[20%] ">
        <Options activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

   
    </div>
  );
};

export default CreateCourse;
