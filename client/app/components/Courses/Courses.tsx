"use client";
import { useAllCoursesWithoutPurhaseMutation } from "@/redux/features/courses/courseApi";
import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import CourseCard from "./CourseCard";
import { useSelector } from "react-redux";

export default function Courses() {
  const [filter, setFilter] = useState("all");
  const [courses, setCourses] = useState<any[]>([]);
  const [fetchCourses, { isLoading }] = useAllCoursesWithoutPurhaseMutation();
  const {user} = useSelector((state: any) => state.auth);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response: any = await fetchCourses({}).unwrap();
        if (response?.courses) {
          setCourses(response.courses);
        }
      } catch (error) {
        console.error("Failed to load courses:", error);
      }
    };
    getCourses();
  }, [fetchCourses]);
  

  const categories = [
    { id: "all", label: "All Courses" },
    { id: "development", label: "Development" },
    { id: "design", label: "Design" },
    { id: "marketing", label: "Marketing" },
    { id: "data", label: "Data Science" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-primary">
        Loading courses...
      </div>
    );
  }

  const filteredCourses =
    filter === "all"
      ? courses
      : courses.filter((course) => course.category === filter);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn new skills with industry experts
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <FaFilter className="text-primary" size={20} />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                filter === cat.id
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-foreground text-white dark:text-black hover:bg-muted-foreground shadow"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id || course.id} course={course} isprofile={!user ? false : user.courses.some((c: any) => c._id === course._id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No courses found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
