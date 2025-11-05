"use client";

import { styles } from "@/app/styles/styles";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsPencil } from "react-icons/bs";

type LinkType = {
  title: string;
  url: string;
};

type VideoContent = {
  videoUrl: string;
  title: string;
  description: string;
  videoSection: string;
  links: LinkType[];
  suggestions: string;
};

type Props = {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  courseContent: VideoContent[];
  setCourseContent: (courseContent: VideoContent[]) => void;
  handleSubmit: () => void;
};

const CourseContent: FC<Props> = ({
  activeTab,
  setActiveTab,
  courseContent,
  setCourseContent,
  handleSubmit: onSubmitHandler,
}) => {
  const [sectionCollapse, setSectionCollapse] = useState<boolean[]>([]);
  const [videoCollapse, setVideoCollapse] = useState<Record<number, boolean[]>>(
    {}
  );
  const [linkCollapse, setLinkCollapse] = useState<
    Record<number, Record<number, boolean>>
  >({});

  // Toggle a section
  const toggleSectionCollapse = (sectionIndex: number) => {
    const updated = [...sectionCollapse];
    updated[sectionIndex] = !updated[sectionIndex];
    setSectionCollapse(updated);
  };

  // Toggle video collapse within a section
  const toggleVideoCollapse = (sectionIndex: number, videoIndex: number) => {
    const sectionVideos = videoCollapse[sectionIndex] || [];
    sectionVideos[videoIndex] = !sectionVideos[videoIndex];
    setVideoCollapse({ ...videoCollapse, [sectionIndex]: sectionVideos });
  };

  // Toggle links collapse for each video
  const toggleLinksCollapse = (sectionIndex: number, videoIndex: number) => {
    const sectionLinks = linkCollapse[sectionIndex] || {};
    sectionLinks[videoIndex] = !sectionLinks[videoIndex];
    setLinkCollapse({ ...linkCollapse, [sectionIndex]: sectionLinks });
  };

  // Input change handler
  const handleChange = (
    index: number,
    field: keyof VideoContent,
    value: any
  ) => {
    const updated = [...courseContent];
    updated[index][field] = value;
    setCourseContent(updated);
  };

  // Add new section
  // Add video to a section (only if previous video is complete)
const addVideoToSection = (sectionName: string, sectionIndex: number) => {
  const sectionVideos = courseContent.filter(
    (item) => item.videoSection === sectionName
  );

  // Check if last video is complete
  const lastVideo = sectionVideos[sectionVideos.length - 1];
  if (
    !lastVideo.title.trim() ||
    !lastVideo.videoUrl.trim() ||
    !lastVideo.description.trim()
  ) {
    toast.error("Please complete the previous video before adding a new one.");
    return;
  }

  const newVideo: VideoContent = {
    videoUrl: "",
    title: "",
    description: "",
    videoSection: sectionName,
    links: [{ title: "", url: "" }],
    suggestions: "",
  };

  setCourseContent([...courseContent, newVideo]);
  setVideoCollapse({
    ...videoCollapse,
    [sectionIndex]: [
      ...(videoCollapse[sectionIndex] || []),
      true, // expanded
    ],
  });
  toast.success(`New video added to ${sectionName}`);
};

// Add new section (only if last section's videos are complete)
const addNewSection = () => {
  // Get last section name
  const lastSectionName = uniqueSections[uniqueSections.length - 1];
  const lastSectionVideos = courseContent.filter(
    (item) => item.videoSection === lastSectionName
  );

  // Check if all videos in the last section are complete
  const incompleteVideos = lastSectionVideos.some(
    (v) =>
      !v.title.trim() || !v.videoUrl.trim() || !v.description.trim()
  );

  if (incompleteVideos) {
    toast.error("Please complete all videos in the previous section first.");
    return;
  }

  const newSectionName = `Untitled Section ${sectionCollapse.length + 1}`;
  const newSection: VideoContent = {
    videoUrl: "",
    title: "",
    description: "",
    videoSection: newSectionName,
    links: [{ title: "", url: "" }],
    suggestions: "",
  };

  setCourseContent([...courseContent, newSection]);
  setSectionCollapse([...sectionCollapse, true]);
  toast.success("New section added!");
};


  // Add a new link inside a video
  const addLink = (globalVideoIndex: number) => {
    const updated = [...courseContent];
    updated[globalVideoIndex].links.push({ title: "", url: "" });
    setCourseContent(updated);
  };

  // Delete a link
  const deleteLink = (videoIndex: number, linkIndex: number) => {
    const updated = [...courseContent];
    updated[videoIndex].links.splice(linkIndex, 1);
    setCourseContent(updated);
  };

  // Delete a video
  const deleteVideo = (index: number) => {
    const updated = [...courseContent];
    updated.splice(index, 1);
    setCourseContent(updated);
    toast.success("Video removed");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitHandler();
  };

  const uniqueSections = Array.from(
    new Set(courseContent.map((item) => item.videoSection))
  );

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {uniqueSections.map((sectionName, sectionIndex) => {
          const sectionVideos = courseContent.filter(
            (item) => item.videoSection === sectionName
          );

          return (
            <div
              key={sectionIndex}
              className="bg-background rounded-lg p-4 border border-border"
            >
              {/* Section Header */}
              <div className="flex md:flex-row flex-col items-center justify-between mb-2">
                <div className="flex   md:w-min-content w-auto md:mb-0 mb-2 items-center gap-2">
                  <input
                    type="text"
                    className="text-xl !w-full font-medium text-foreground bg-transparent border-none outline-none"
                    value={sectionName}
                    onChange={(e) => {
                      const updated = courseContent.map((item) =>
                        item.videoSection === sectionName
                          ? { ...item, videoSection: e.target.value }
                          : item
                      );
                      setCourseContent(updated);
                    }}
                  />
                  <BsPencil className="text-foreground cursor-pointer" />
                </div>
                <div className="flex md:justify-normal justify-between md:w-auto w-full  items-center gap-3">
                  <button
                    type="button"
                    onClick={() => addVideoToSection(sectionName, sectionIndex)}
                    className="flex items-center gap-1 text-sm text-primary"
                  >
                    <AiOutlinePlus /> Add Video
                  </button>
                  <MdOutlineKeyboardArrowDown
                    size={24}
                    className="text-foreground cursor-pointer"
                    style={{
                      transform: sectionCollapse[sectionIndex]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "0.2s ease",
                    }}
                    onClick={() => toggleSectionCollapse(sectionIndex)}
                  />
                </div>
              </div>

              {/* Section Content */}
              {sectionCollapse[sectionIndex] && (
                <div className="space-y-4 mt-4">
                  {sectionVideos.map((video, videoIndex) => {
                    const globalVideoIndex = courseContent.indexOf(video);
                    const collapsed =
                      videoCollapse[sectionIndex]?.[videoIndex] ?? true;

                    return (
                      <div
                        key={videoIndex}
                        className="bg-muted rounded-md shadow-sm p-4"
                      >
                        {/* Video Header */}
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-foreground">
                          {videoIndex+1} .  {video.title || `Video`}
                          </p>
                          <div className="flex items-center gap-2">
                            <AiOutlineDelete
                              className="cursor-pointer text-red-500"
                              onClick={() => deleteVideo(globalVideoIndex)}
                            />
                            <MdOutlineKeyboardArrowDown
                              size={20}
                              className="text-foreground cursor-pointer"
                              style={{
                                transform: collapsed
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "0.2s ease",
                              }}
                              onClick={() =>
                                toggleVideoCollapse(sectionIndex, videoIndex)
                              }
                            />
                          </div>
                        </div>

                        {/* Collapsible Video Body */}
                        {collapsed && (
                          <div className="space-y-3 mt-3">
                            <div>
                              <label className={styles.label}>Video Title</label>
                              <input
                                type="text"
                                placeholder="Enter title"
                                className={styles.input}
                                value={video.title}
                                onChange={(e) =>
                                  handleChange(
                                    globalVideoIndex,
                                    "title",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label className={styles.label}>Video URL</label>
                              <input
                                type="text"
                                placeholder="https://..."
                                className={styles.input}
                                value={video.videoUrl}
                                onChange={(e) =>
                                  handleChange(
                                    globalVideoIndex,
                                    "videoUrl",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label className={styles.label}>
                                Description
                              </label>
                              <textarea
                                rows={4}
                                className={`${styles.input} !h-min py-2`}
                                value={video.description}
                                onChange={(e) =>
                                  handleChange(
                                    globalVideoIndex,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* Links Section */}
                            <div className="border-t border-border pt-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-foreground">
                                  Resource Links
                                </h4>
                                <MdOutlineKeyboardArrowDown
                                  size={18}
                                  className="text-foreground cursor-pointer"
                                  style={{
                                    transform:
                                      linkCollapse[sectionIndex]?.[
                                        videoIndex
                                      ] === false
                                        ? "rotate(0deg)"
                                        : "rotate(180deg)",
                                    transition: "0.2s ease",
                                  }}
                                  onClick={() =>
                                    toggleLinksCollapse(sectionIndex, videoIndex)
                                  }
                                />
                              </div>

                              {linkCollapse[sectionIndex]?.[videoIndex] !==
                                false && (
                                <div className="space-y-3 mt-3">
                                  {video.links.map((link, linkIndex) => (
                                    <div
                                      key={linkIndex}
                                      className="flex gap-3 items-center"
                                    >
                                      <input
                                        type="text"
                                        placeholder="Link Title"
                                        className="flex-1 border rounded-md px-2 py-1 bg-transparent text-foreground border-border"
                                        value={link.title}
                                        onChange={(e) => {
                                          const updated = [...courseContent];
                                          updated[globalVideoIndex].links[
                                            linkIndex
                                          ].title = e.target.value;
                                          setCourseContent(updated);
                                        }}
                                      />
                                      <input
                                        type="text"
                                        placeholder="https://..."
                                        className="flex-1 border rounded-md px-2 py-1 bg-transparent text-foreground border-border"
                                        value={link.url}
                                        onChange={(e) => {
                                          const updated = [...courseContent];
                                          updated[globalVideoIndex].links[
                                            linkIndex
                                          ].url = e.target.value;
                                          setCourseContent(updated);
                                        }}
                                      />
                                      <AiOutlineDelete
                                        className="text-red-500 cursor-pointer"
                                        onClick={() =>
                                          deleteLink(globalVideoIndex, linkIndex)
                                        }
                                      />
                                    </div>
                                  ))}

                                  <button
                                    type="button"
                                    onClick={() => addLink(globalVideoIndex)}
                                    className="flex items-center gap-2 text-sm text-primary mt-2"
                                  >
                                    <AiOutlinePlus /> Add Link
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

             
            </div>
          );
        })}

        {/* Add Section Button */}
        <div className="w-full flex justify-center mt-6">
          <button
            type="button"
            onClick={addNewSection}
            className="flex items-center gap-2 text-primary font-medium"
          >
            <AiOutlinePlus /> Add New Section
          </button>
        </div>
      </form>
       <div className="w-full flex justify-between">
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-foreground bg-secondary py-2 px-4  rounded-md mt-2"
onClick={() => setActiveTab(activeTab - 1)}
                  >Previous</button>
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-foreground bg-primary py-2 px-4  rounded-md mt-2"
                  onClick={() => {onSubmitHandler();setActiveTab(activeTab + 1)}}
                  >next</button>
              </div>
    </div>
  );
};

export default CourseContent;
