"use client";

import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import heroImage from "../../../public/assets/hero.png";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useAllCoursesWithoutPurhaseMutation } from "@/redux/features/courses/courseApi";

const Hero: FC = () => {
  const [AllCoursesWithoutPurhase] = useAllCoursesWithoutPurhaseMutation();
  const [search, setSearch] = useState("");
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🧩 Fetch all courses once when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await AllCoursesWithoutPurhase({}).unwrap();
        setAllCourses(res?.courses || []);
        setSearchResults(res?.courses || []); // show all by default
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [AllCoursesWithoutPurhase]);

  // 🔍 Live Search (filters while typing)
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const filtered = allCourses.filter((course) =>
      course.name.toLowerCase().includes(search.toLowerCase())
    );

    console.log(filtered)

    setSearchResults(filtered.slice(0, 5)); // only show 5 results
    setShowDropdown(true);
  }, [search, allCourses]);

  // 🪄 Fetch banner data
  const { data, isLoading, isError } = useGetHeroDataQuery("banner", {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <section className="flex justify-center items-center min-h-[70vh] bg-background text-foreground">
        <h1 className="text-3xl font-semibold animate-pulse">Loading...</h1>
      </section>
    );
  }

  const banner = data?.layout?.banner || {
    title: "Learn Without Limits",
    subtitle: "Explore thousands of courses from experts worldwide.",
    image: { url: heroImage },
  };

  return (
    <section id='home' className="relative flex flex-col justify-between py-20 px-8 bg-background text-foreground">
      {/* --- Hero Top Section --- */}
      <div className="relative z-20 w-full mx-auto text-center lg:text-left py-10 lg:py-20 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center gap-10">
        {/* Left content */}
        <div className="w-full lg:w-1/2 relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            {banner.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8">{banner.subtitle}</p>

          {/* --- Search Bar --- */}
          <div className="relative w-full max-w-xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // small delay to allow clicks
              placeholder="Search for courses..."
              className="w-full px-4 py-3 rounded-md border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />

            {/* 🔽 Dropdown List */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-border rounded-md shadow-md mt-2 z-30 max-h-64 overflow-y-auto">
                {loading ? (
                  <p className="text-center text-gray-500 bg-card py-3">Loading...</p>
                ) : searchResults.length > 0 ? (
                  searchResults.map((course: any) => (
                    <a
                      key={course._id}
                      href={`/courses/${course._id}`}
                      className="block px-2 h-15 gap-2 bg-card flex  py-2 hover:bg-card/80 transition text-left"
                    >
                     <img src={course.thumbnail.url} alt={course.name}  className=" rounded-md"/>
                     <div>
                       <h4 className="text-sm font-semibold text-foreground">
                        {course.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {course.description}
                      </p>
                     </div>
                    </a>
                  ))
                ) : (
                  <p className="text-center bg-card text-foreground py-3">
                    No courses found.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <Image
            src={banner.image?.url || heroImage}
            alt="Hero Background"
            className="!static w-full h-auto"
            width={600}
            height={400}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
