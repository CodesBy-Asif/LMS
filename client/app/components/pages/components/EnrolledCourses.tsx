import { dividerClasses } from "@mui/material";
import React from "react";



interface EnrolledCoursesProps {
  courses: any[];
}

const EnrolledCourses: React.FC<EnrolledCoursesProps> = ({ courses }) => {
  if (courses.length === 0){
    return(
      <div className="bg-card  rounded-lg  shadow-lg p-6">
      <h2 className="md:text-2xl text-xl font-bold text-foreground mb-6">
        No Enrolled Courses
      </h2>
      </div>

)
}
  return (
    <div className="bg-card  rounded-lg  shadow-lg p-6">
      <h2 className="md:text-2xl text-xl font-bold text-foreground mb-6">
        My Enrolled Courses
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-accent  rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={course.thumbnail.url}
              alt={course.name}
              className="w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold md:text-lg text-md text-foreground mb-2">
                {course.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {course.description.slice(0,100)}...
              </p>
             
              <a href={`/course-access/${course._id}`} className="w-full px-4 md:text-sm text-xs py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium">
                Continue Learning
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;
