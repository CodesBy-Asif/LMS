"use client";
import React, { useEffect, useState } from "react";
import { FaUsers, FaClock, FaStar, FaBook } from "react-icons/fa";
import { useGetSingleCourseQuery } from "@/redux/features/courses/courseApi";
import Loader from "@/app/components/Loader/Loader";
import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/Header/Header";
import Heading from "@/app/utils/Heading";
import CloudinaryPlayer from "@/app/utils/CoursePlayer";
import CourseContent from "./content";
import { BuyNowDialog } from "./BuyNow";
import { useSelector } from "react-redux";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const id = React.use(params).id;
  const { data, isLoading, error } = useGetSingleCourseQuery(id);
  const [course, setCourse] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [Buy, setBuy] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [Route, setRoute] = useState("Login");
  const {user} = useSelector((state:any) => state.auth);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (user && user.courses) {
         const hasCourse = user.courses?.some((c: { _id: string }) => c._id === id);

     setIsEnrolled(hasCourse);
      console.log(user.courses.includes(id));
      console.log(user.courses);
    }
  }, [user]);

  useEffect(() => {
    if (data?.course) setCourse(data.course);
  }, [data]);

  if (isLoading) return <Loader />;

  if (error || !course)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600">
        Failed to load course details.
      </div>
    );

  return (
    <>
      <Heading
        title={course.name || "edura"}
        description="Edura is a free and open source learning management system."
        keywords="Edura, LMS, free, open source, learning management system"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={Route}
        setRoute={setRoute}
      />

      <div className="min-h-screen pt-20 bg-gradient-to-br from-accent via-background to-accent py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto bg-card rounded-2xl shadow-lg overflow-hidden">
          {/* Header Image */}
          <div className="relative h-auto overflow-hidden">
            <img
              src={course.thumbnail?.url}
              alt={course.name}
              className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
            />
           
          </div>

          {/* Content */}
          <div className="p-8 md:p-10">
              <h1 className="text-3xl md:text-4xl font-bold">{course.name}</h1>
            
    
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Stats */}
           
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                
                <div className="flex items-center gap-2">
                  <FaBook className="text-primary" />
                  <span>{course.courseData?.length || 0} lectures</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-primary" />
                  <span>{course.purchased?.toLocaleString() || 0} students</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-500">
                  <FaStar />
                  <span className="text-primary font-semibold">
                    {course.ratting >= 0 ? course.ratting.toFixed(2) : "0"}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  {course.price > 0 ? `$${course.price}` : "Free"}
                </span>
                {course.estimatedPrice > 0 && (
                  <span className="text-muted-foreground line-through">
                    ${course.estimatedPrice}
                  </span>
                )}
                {!isEnrolled?<button onClick={() => setBuy(true)} className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200">
                 {course.price ===0 ?"Enroll Now": "Buy Now"}
                </button>:
                <a href={`/course-access/${id}`} className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200">View Course</a>}
              </div>
            </div>

            {/* Divider */}
            <hr className="my-8 border-border" />

            {/* DEMO VIDEO SECTION */}
           
<div className="md:flex gap-4 justify-between">

            <div className="space-y-6 max-w-[60%]">
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-3">
                  About this course
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description ||
                    "This course provides an in-depth understanding of the topic with practical examples and projects to help you gain real-world skills."}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-primary mb-3">
                  What you’ll learn
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {course.banifets?.length ? (
                    course.banifets.map((benefit: any, index: number) => (
                      <li key={index}>{benefit.title}</li>
                    ))
                  ) : (
                    <>
                      <li>Understand the core concepts of the topic.</li>
                      <li>Work on hands-on projects and case studies.</li>
                      <li>Gain confidence in applying what you learn.</li>
                    </>
                  )}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-primary mb-3">
                  Pre Requisites
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {course.prerequisites?.length ? (
                    course.prerequisites.map((item: any, index: number) => (
                      <li key={index}>{item.title}</li>
                    ))
                  ) : (
                    <>
                      <li>Understanding of basic programming concepts.</li>
                      <li>Basic knowledge of programming languages.</li>
                    </>
                  )}
                </ul>
              </div>

       
            

            </div>
             {course.demoUrl && (
                <div className="w-50% h-auto relative">
                     <div className="md:mb-10 my-5 sticky top-0 ">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  Course Preview
                </h2>
                <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
                  {/* Supports YouTube / Cloudinary / Direct MP4 */}
                  {course.demoUrl.includes("youtube.com") ||
                  course.demoUrl.includes("youtu.be") ? (
                    <iframe
                      src={course.demoUrl.replace("watch?v=", "embed/")}
                      title="Demo Video"
                      className="w-full h-full border-none"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <CloudinaryPlayer
                      publicId={course.demoUrl}
                      title="Demo Video"
                    ></CloudinaryPlayer>
                  )}
                </div>
              </div>
                </div>
             
            )}
</div>
            {/* About / Learn / Prerequisites */}
          </div>
                 {/* Course Content */}
           <div className="px-8">
             <CourseContent courseData={course.courseData} /> 
           </div>
        </div>
      </div>
      <Footer />
<BuyNowDialog open={Buy} onClose={() =>{ setBuy(false);
setIsEnrolled(true);
}} course={course} />

    </>
  );
};

export default Page;
