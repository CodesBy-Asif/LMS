'use client';

import CloudinaryPlayer from '@/app/utils/CoursePlayer';
import { useGetCourseContentQuery ,useAddReviewMutation} from '@/redux/features/courses/courseApi';
import React, { useState, useEffect } from 'react';
import {  PlayIcon } from '@heroicons/react/24/outline';
import ReviewsTab from './ReviewTab';
import QuestionSection from './QuestionSection';
import AboutTab from './AboutTab';
import ResourcesTab from './ResourcesTab';
import { useSelector } from 'react-redux';


// --- Icons ---
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s',
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Detail = ({ id,course}: any) => {
  const [openSections, setOpenSections] = useState<string[]>(['Getting Started']);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [completedLectures, setCompletedLectures] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'about' | 'resources' | 'qa'|'reviews'>('about');
  const { data,isLoading } = useGetCourseContentQuery(id);
  // --- State for course data ---
const [courseData, setCourseData] = useState<any>(() => {
  return course.course ||{};
});
const {user} = useSelector((state:any)=>state.auth)

// --- Update courseData when API data arrives ---
useEffect(() => {
  if (data?.course) {
    // Merge API data into state (keeps existing state, updates rating & reviews)
    setCourseData((prev: any) => ({
      ...prev,
      ...data.course,
      rating: data.course.rating,
      reviews: data.course.reviews,
    }));
  }
}, [data]);

useEffect(() => {
  if (data?.course) {
    setCourseData((prev: any) => ({
      ...prev,
      rating: data.course.rating,
      reviews: data.course.reviews,
    }));
  }
}, [data]);


useEffect(() => {
  const stored = localStorage.getItem(`completedLectures_${id}`);
  if (stored) {
    setCompletedLectures(JSON.parse(stored));
  }
}, [id]);

// ✅ Save only when completedLectures changes
useEffect(() => {
  if (completedLectures.length > 0) {
    localStorage.setItem(`completedLectures_${id}`, JSON.stringify(completedLectures));
  }
}, [completedLectures, id]);
if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium text-gray-600">
        Loading course details...
      </div>
    );
  }
    if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4 bg-background">
        <h2 className="text-2xl font-semibold text-primary mb-2">
          Login to access this page
        </h2>
        <p className="text-muted-foreground max-w-md mb-4">
          You need to be logged in to view this course. Please log in to continue.
        </p>
        
      </div>
    );
  }
 if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          No Access to this Course
        </h2>
        <p className="text-muted-foreground max-w-md">
          It seems you don't have permission to view this course, or the course
          doesn't exist. Please check your account or contact support.
        </p>
      </div>
    );
  }
  const groupedData = data.content.reduce((groups: any, lecture: any) => {
    const section = lecture.videoSection || 'Uncategorized';
    if (!groups[section]) groups[section] = [];
    groups[section].push(lecture);
    return groups;
  }, {});
  const flatLectures = data.content


  const toggleSection = (section: string) =>
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );

  const playVideo = (lecture: any) => setCurrentVideo(lecture);

const markAsCompleted = (lectureId: string) => {
  setCompletedLectures((prev) => {
    if (!prev.includes(lectureId)) {
      const updated = [...prev, lectureId];
      localStorage.setItem(`completedLectures_${id}`, JSON.stringify(updated));
      return updated;
    }
    return prev;
  });
};
const handleNextVideo = () => {
    if (!currentVideo) return;
    const currentIndex = flatLectures.findIndex(
      (v:any) => v._id === currentVideo._id || v.id === currentVideo.id
    );
    if (currentIndex < flatLectures.length - 1) {
      setCurrentVideo(flatLectures[currentIndex + 1]);
    }
  };

  const handlePrevVideo = () => {
    if (!currentVideo) return;
    const currentIndex = flatLectures.findIndex(
      (v:any) => v._id === currentVideo._id || v.id === currentVideo.id
    );
    if (currentIndex > 0) {
      setCurrentVideo(flatLectures[currentIndex - 1]);
    }
  };

  const totalLectures = data.content.length;
  const completedCount = completedLectures.length;
  const progress = Math.round((completedCount / totalLectures) * 100);
  return (
    <div className="pt-16 bg-background">
      <div className="flex flex-col lg:flex-row ">
        {/* --- Video Player Section --- */}
        <div className="lg:w-2/3 bg-card flex flex-col">
          <div className="flex-1 flex items-center justify-center bg-black">
            {currentVideo ? (
              <div className="w-full h-full">
                <CloudinaryPlayer publicId={currentVideo.videoUrl} title={currentVideo.title} />
              </div>
            ) : (
              <div className="text-center text-foreground p-8">
                <PlayIcon className="w-10 h-10 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Select a lecture to start</h2>
                <p>Choose any lecture from the sidebar to begin learning</p>
              </div>
            )}
          </div>

          {/* --- Video Info --- */}
          {currentVideo && (
            <div className="bg-background text-foregrund p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{currentVideo.title}</h3>
                  <p className="text-muted-foreground">{currentVideo.description}</p>
                </div>
                <button
                  onClick={() => markAsCompleted(currentVideo._id || currentVideo.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    completedLectures.includes(currentVideo._id || currentVideo.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {completedLectures.includes(currentVideo._id || currentVideo.id)
                    ? 'Completed ✓'
                    : 'Mark as Complete'}
                </button>
              </div>
                <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevVideo}
                  disabled={
                    flatLectures.findIndex(
                      (v:any) => v._id === currentVideo._id
                    ) === 0
                  }
                  className="bg-gray-700 text-white disabled:opacity-50 hover:bg-gray-600   px-4 py-2 rounded-lg"
                >
                  ← Previous
                </button>

                <button
                  onClick={handleNextVideo}
                  disabled={
                    flatLectures.findIndex(
                      (v:any) => v._id === currentVideo._id 
                    ) === flatLectures.length - 1
                  }
                  className="bg-primary hover:bg-primary-dark disabled:opacity-50 px-4 py-2 rounded-lg"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* --- Tabs Section --- */}
          
        </div>

        {/* --- Sidebar --- */}
        <div className="lg:w-1/3 max-h-[112vh] bg-sidebar border-l border-border flex flex-col ">
          {/* Header */}
          <div className="p-6 border-b md:top-16 bg-background z-10">
            <h2 className="text-xl font-bold text-foreground mb-2">Course Content</h2>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{totalLectures} lectures</span>
              <span>
                {completedCount}/{totalLectures} completed
              </span>
            </div>
            <div className="mt-3 bg-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto max-h-screen bg-sidebar px-4 py-4">
            {Object.entries(groupedData).map(([section, lectures]: [string, any], index) => {
              const isOpen = openSections.includes(section);
              const sectionCompleted = lectures.every((l: any) =>
                completedLectures.includes(l._id || l.id)
              );
              return (
               
                <div key={index} className="mb-4 border bg-card border-border rounded-lg overflow-hidden">
                  {/* Section Header */}
                  <div
                    className="bg-card px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => toggleSection(section)}
                  >
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                      {sectionCompleted && (
                        <span className="text-green-600">
                          <CheckIcon />
                        </span>
                      )}
                      {section}
                    </h3>
                    <div className="flex items-center gap-2 text-foreground">
                      <span className="text-sm">
                        {lectures.length} lecture{lectures.length > 1 ? 's' : ''}
                      </span>
                      <ArrowDownIcon isOpen={isOpen} />
                    </div>
                  </div>

                  {/* Lectures */}
                  {isOpen && (
                    <div className="divide-y divide-border">
                      {lectures.map((lecture: any) => {
                        const lectureId = lecture._id || lecture.id;
                        const isCompleted = completedLectures.includes(lectureId);
                        const isCurrent =
                          currentVideo?._id === lectureId || currentVideo?.id === lectureId;

                        return (
                          <div
                            key={lectureId}
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                              isCurrent
                                ? 'bg-sidebar border-l-4 border-primary'
                                : 'hover:bg-primary'
                            }`}
                            onClick={() => playVideo(lecture)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span
                                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                  isCompleted
                                    ? 'bg-primary/10 text-green-600'
                                    : isCurrent
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-primary/10 text-gray-600'
                                }`}
                              >
                                {isCompleted ? '✓' : <PlayIcon className="p-1" />}
                              </span>
                              <h4
                                className={`text-sm font-medium ${
                                  isCurrent ? 'text-primary' : 'text-foreground'
                                }`}
                              >
                                {lecture.title}
                              </h4>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div> 
              
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-card border-t border-border">
            <div className="flex border-b border-border">
              {['about', 'resources', 'qa', 'reviews'].map((tab) => (
  <button
    key={tab}
    onClick={() => setActiveTab(tab as any)}
    className={`flex-1 text-center py-3 font-medium capitalize ${
      activeTab === tab
        ? 'border-b-2 border-primary text-primary'
        : 'text-foreground hover:text-primary-dark'
    }`}
  >
    {tab === 'qa'
      ? 'Q&A'
      : tab === 'reviews'
      ? 'Reviews'
      : tab.charAt(0).toUpperCase() + tab.slice(1)}
  </button>
))}

            </div>

            <div className="p-6">
  {activeTab === 'about' && (
    <AboutTab currentVideo={currentVideo} courseData={courseData} />
  )}

  {activeTab === 'resources' && (
    <ResourcesTab currentVideo={currentVideo} />
  )}

  {activeTab === 'qa' && (
    <QuestionSection
      lectureId={currentVideo?._id || currentVideo?.id}
      question={
    currentVideo?.questions
      ?.slice()
      ?.sort((a: any, b: any) => (b._id || b.id).localeCompare(a._id || a.id))
  }
      id={id}
      name={currentVideo?.title}
    />
  )}

  {activeTab === 'reviews' && (
    <ReviewsTab
      courseId={id}
      courseData={courseData}
      setCourseData={setCourseData}
    />
  )}
</div>

          </div>
    </div>
  );
};

export default Detail;
