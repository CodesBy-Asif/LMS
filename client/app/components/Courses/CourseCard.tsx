"use client";
import Link from "next/link";
import React from "react";
import { FaBook, FaUsers, FaStar, FaVideo } from "react-icons/fa";

interface CourseCardProps {
  course: any;
  isprofile?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course,isprofile }) => {
  return (
    <Link href={!isprofile?`/courses/${course?._id}`:'/course-acess/'+course?._id} className={'cursor-pointer'}>
      <div className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course?.thumbnail?.url}
          alt={course?.name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
        />
        {course?.level && (
          <div className="absolute top-4 right-4 bg-foreground px-3 py-1 rounded-full text-sm font-semibold text-primary">
            {course.level}
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
          {course?.name}
        </h3>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
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
              {course?.ratting >= 0 ? course.ratting : "4.5"}
            </span>
          </div>
          <span className="text-gray-500 text-sm">
            ({course?.purchased > 0 ? course.purchased : 0} students)
          </span>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-start gap-4">
            <span className="text-2xl font-bold text-primary">
              {course?.price > 0 ? `$${course.price}` : "Free"}
            </span>
            {course?.estimatedPrice > 0 && (
              <span className="text-muted-foreground">
                <del>${course.estimatedPrice}</del>
              </span>
            )}
          </div>
          <div>
         
          </div>
          
        </div>
      </div>
    </div></Link>
  
  );
};

export default CourseCard;
