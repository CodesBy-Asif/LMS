"use client";

import React, { useEffect, useState } from "react";
import {useRouter } from "next/navigation";
import CourseContent from "./CourseContent";
import { useUpdateCourseMutation } from "@/redux/features/courses/courseApi";
import toast from "react-hot-toast";
import CoursePreview from "./CoursePreview";
import Options from "./Options";
import CourseOptions from "./CourseOptions";
import CourseInformation from "./CourseInformation";

const tabs = [
  { id: "info", label: "Course Information" },
  { id: "options", label: "Course Options" },
  { id: "content", label: "Course Content" },
  { id: "preview", label: "Course Preview" },
];

const EditCoursePage =  ({ id }: { id: string }) => {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });

  const [banefits, setBanefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContent, setCourseContent] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      links: [{ title: "", url: "" }],
      suggestions: "",
    },
  ]);

  const [updateCourse, { isSuccess, error }] = useUpdateCourseMutation();
  const [courseData, setCourseData] = useState({});

  // Fetch course info on mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/course/get/${id}`);
        const data = await res.json();
        if (data.success) {
          setCourseInfo(data.course);
          setBanefits(data.course.banefits || [{ title: "" }]);
          setPrerequisites(data.course.prerequisites || [{ title: "" }]);
          setCourseContent(data.course.courseContent || [
            {
              videoUrl: "",
              title: "",
              description: "",
              videoSection: "Untitled Section",
              links: [{ title: "", url: "" }],
              suggestions: "",
            },
          ]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch course data");
      }
    };
    fetchCourse();
  }, [id]);

  const handleSubmit = () => {
    const formattedBanefits = banefits.map((item) => ({ title: item.title }));
    const formattedPrerequisites = prerequisites.map((item) => ({
      title: item.title,
    }));
    const formattedContent = courseContent.map((item) => ({
      videoUrl: item.videoUrl,
      title: item.title,
      description: item.description,
      videoSection: item.videoSection,
      links: item.links,
      suggestions: item.suggestions,
    }));

    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      thumbnail: courseInfo.thumbnail,
      banifets: formattedBanefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedContent,
    };
    setCourseData(data);
  };

  const handleCourseUpdate = async () => {
    try {
      await updateCourse({ id, data: courseData });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update course");
    }
  };

  // Success/Error handling
  useEffect(() => {
    if (isSuccess) {
      toast.success("Course updated successfully");
      router.push("/admin/courses"); // redirect back to course list
    }
    if (error) {
      const err = error as any;
      const message = err?.data?.message || "Something went wrong";
      toast.error(message);
    }
  }, [isSuccess, error, router]);

  return (
    
    <div className="bg-background flex md:flex-row flex-col-reverse gap-6 text-foreground p-6 rounded-lg shadow-md w-full">
      <div className="md:w-[80%]">
        {activeTab === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 1 && (
          <CourseOptions
            activeTab={activeTab}
            setactiveTab={setActiveTab}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            banefits={banefits}
            setBanefits={setBanefits}
          />
        )}
        {activeTab === 2 && (
          <CourseContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            courseContent={courseContent}
            setCourseContent={setCourseContent}
            handleSubmit={handleSubmit}
          />
        )}
        {activeTab === 3 && (
          <CoursePreview
            courseData={courseData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleCourseCreate={handleCourseUpdate} // Reuse preview button
          />
        )}
      </div>
      <div className="md:w-[20%]">
        <Options activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default EditCoursePage; 