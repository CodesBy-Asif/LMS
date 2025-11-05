"use client";

import React, { useEffect, useState } from "react";
import { useAllCoursesWithoutPurhaseMutation } from "@/redux/features/courses/courseApi";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import Header from "../components/Header/Header";
import { FaStar, FaUsers, FaVideo } from "react-icons/fa";
import Footer from "../components/Footer/Footer";
import Heading from "../utils/Heading";

const CoursesPage = () => {
  const [AllCoursesWithoutPurhase] = useAllCoursesWithoutPurhaseMutation();
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
const user = useSelector((state: any) => state.auth.user);
const [open, setOpen] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState(99);
    const [route, setRoute] = React.useState("login");
  // 🧩 Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await AllCoursesWithoutPurhase({}).unwrap();
        setCourses(res?.courses || []);
        
        setFilteredCourses(res?.courses || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [AllCoursesWithoutPurhase]);
  // 🔍 Filter courses based on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCourses(courses);
      return;
    }
    const results = courses.filter((course) =>
      course.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCourses(results);
  }, [search, courses]);

  return (
    <>
    <Heading 
        title="courses | Edura" 
        description="Learn about Edura, our mission, vision, and team." 
        keywords="edura, mission vision, codebyasif"
      />
    <Header open={open} setOpen={setOpen} activeItem={1} route={route} setRoute={setRoute} />
    <section className="min-h-screen bg-background text-foreground py-16 px-6">
      {/* --- Header --- */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">All Courses</h1>
        <p className="text-gray-600 text-lg">
          Browse our collection of expert-led online courses
        </p>

        {/* --- Search bar --- */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full px-4 py-3 rounded-md border border-border bg-muted text-foreground 
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <button
            className="px-6 py-3 rounded-md font-medium bg-primary text-background 
                       hover:bg-primary-dark transition"
            onClick={() => setSearch(search.trim())}
          >
            Search
          </button>
        </div>
      </div>

      {/* --- Course Grid --- */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading courses...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="border border-border bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* --- Thumbnail --- */}
                <div className="relative w-full h-48">
                  <Image
                    src={course.thumbnail?.url || "/assets/placeholder.png"}
                    alt={course.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* --- Course info --- */}
                <div className="p-5 flex flex-col h-full">
                  <h3 className="text-lg font-semibold mb-2 text-primary line-clamp-1">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {course.description || "No description available."}
                  </p>

               <div className=" flex justify-between items-center">
               <div> <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                         <div className="flex items-center gap-1">
                           <FaUsers size={16} />
                           <span>{course?.purchased ? course.purchased.toLocaleString() : "0"}</span>
                         </div>
                         <div className="flex items-center gap-1">
                           <FaVideo size={16} />
                           <span>
                             {course?.courseData?.length
                               ? `${course.courseData.length} Lectures`
                               : "0 Lectures"}
                           </span>
                         </div>
                       </div>
               
                       {/* Rating */}
                       <div className="flex items-center gap-2 mb-4">
                         <div className="flex items-center gap-1 text-yellow-500">
                           <FaStar size={18} fill="currentColor" />
                           <span className="font-bold text-primary">
                             {course?.ratting >= 0 ? course.ratting.toFixed(2) : "0"}
                           </span>
                         </div>
                         <span className="text-gray-500 text-sm">
                           ({course?.purchased > 0 ? course.purchased : 0} students)
                         </span>
                       </div></div>
                 <div className="">

{user?.courses?.some((c:any) => c._id === course._id) ? (
  <Link
    href={`/course-access/${course._id}`}
    className="text-sm font-medium px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
  >
    Go To Course
  </Link>
) : (
  <Link
    href={`/courses/${course._id}`}
    className="text-sm font-medium px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
  >
    View Course
  </Link>
)}

</div>
               </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default CoursesPage;
