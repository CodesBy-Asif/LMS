"use client";

import { ArrowDownIcon, PlayIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";



interface CourseContentProps {
  courseData: any;
}

const CourseContent: React.FC<CourseContentProps> = ({ courseData }) => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  // Group lectures by their section
  const groupedData = courseData.reduce((groups: Record<string, any[]>, lecture:any) => {
    const section = lecture.videoSection || "Uncategorized";
    if (!groups[section]) groups[section] = [];
    groups[section].push(lecture);
    return groups;
  }, {});

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-primary mb-4">Course Content</h2>

      {courseData && courseData.length > 0 ? (
        Object.entries(groupedData).map(([section, lectures]: any, index) => {
          const isOpen = openSections.includes(section);

          return (
            <div
              key={index}
              className="mb-6 border border-border rounded-xl overflow-hidden"
            >
              {/* Section Header */}
              <div
                className="bg-primary/10 px-5 py-3 flex justify-between items-center cursor-pointer select-none"
                onClick={() => toggleSection(section)}
              >
                <h3 className="text-lg font-semibold text-primary capitalize">
                  {section}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">
                    {lectures.length} lecture{lectures.length > 1 ? "s" : ""}
                  </span>
                  <IoIosArrowDown 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                  
                </div>
              </div>

              {/* anys List (collapsible) */}
              {isOpen && (
                <div className="divide-y divide-border">
                  {lectures.map((lecture:any, index:number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-5 py-3 bg-card hover:bg-card/30 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center px-2 justify-center w-8 h-8 bg-primary/10 rounded-full text-primary">
                         <PlayIcon />
                        </span>
                        <div>
                          <h4 className="text-base font-medium text-primary">
                            {lecture.title || `any ${index + 1}`}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {lecture.description || "No description available"}
                          </p>
                        </div>
                      </div>

                      {/* Preview or Locked */}
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        {lecture.demoUrl ? (
                          <a
                            href={lecture.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary font-medium hover:underline"
                          >
                            Preview
                          </a>
                        ) : lecture.freePreview ? (
                          <span className="text-primary font-medium">Preview</span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5M6.75 10.5h10.5v10.5H6.75V10.5z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-600 italic">No course videos added yet.</p>
      )}
    </div>
  );
};

export default CourseContent;
