"use client";

import { styles } from "@/app/styles/styles";
import React, { FC, useState, DragEvent, ChangeEvent } from "react";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  activeTab,
  setActiveTab,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActiveTab(activeTab + 1);
  };

  // Handle drag/drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Handle file selection manually
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Convert file to Base64 for preview
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCourseInfo({
        ...courseInfo,
        thumbnail: reader.result, // store Base64 for backend upload
      });
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* === COURSE NAME === */}
        <label htmlFor="name" className={styles.label}>
          Course Name
        </label>
        <input
          type="text"
          value={courseInfo.name}
          onChange={(e) =>
            setCourseInfo({ ...courseInfo, name: e.target.value })
          }
          className={styles.input}
          placeholder="Enter course name"
          id="name"
          required
        />

        {/* === DESCRIPTION === */}
        <label htmlFor="description" className={styles.label}>
          Course Description
        </label>
        <textarea
          value={courseInfo.description}
          onChange={(e) =>
            setCourseInfo({ ...courseInfo, description: e.target.value })
          }
          className={styles.input}
          placeholder="Enter course description"
          id="description"
          required
          cols={30}
          rows={6}
        ></textarea>

        {/* === PRICE + ESTIMATED PRICE === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className={styles.label}>
              Price
            </label>
            <input
              type="number"
              value={courseInfo.price}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              className={styles.input}
              placeholder="Enter course price"
              id="price"
              min={0}
              max={9999}
              required
            />
          </div>

          <div>
            <label htmlFor="estimatedPrice" className={styles.label}>
              Estimated Price (optional)
            </label>
            <input
              type="number"
              value={courseInfo.estimatedPrice}
              onChange={(e) =>
                setCourseInfo({
                  ...courseInfo,
                  estimatedPrice: e.target.value,
                })
              }
              min={courseInfo.price}
              max={9999}
              className={styles.input}
              placeholder="Enter estimated price"
              id="estimatedPrice"
            />
          </div>
        </div>

        {/* === TAGS === */}
        <div>
          <label htmlFor="tags" className={styles.label}>
            Tags
          </label>
          <input
            type="text"
            value={courseInfo.tags}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, tags: e.target.value })
            }
            className={styles.input}
            placeholder="nextjs, react, javascript"
            id="tags"
            required
          />
        </div>

        {/* === LEVEL + DEMO URL === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="level" className={styles.label}>
              Level
            </label>
            <select
              value={courseInfo.level}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              className={styles.input}
              id="level"
              required
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label htmlFor="demoUrl" className={styles.label}>
              Demo URL
            </label>
            <input
              type="text"
              value={courseInfo.demoUrl}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
              id="demoUrl"
              placeholder="Enter your Demo URL"
              className={styles.input}
            />
          </div>
        </div>

        {/* === DRAG & DROP THUMBNAIL === */}
        <div>
          <label className={styles.label}>Course Thumbnail</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition 
              ${
                dragging
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              }`}
          >
            {courseInfo.thumbnail ? (
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={courseInfo.thumbnail.url||courseInfo.thumbnail}
                  alt="Course Thumbnail"
                  className="w-40 h-40 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() =>
                    setCourseInfo({ ...courseInfo, thumbnail: "" })
                  }
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Drag & drop thumbnail here, or{" "}
                  <label
                    htmlFor="thumbnail-upload"
                    className="text-primary cursor-pointer hover:underline"
                  >
                    browse
                  </label>
                </p>
                <input
                  type="file"
                  id="thumbnail-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
        </div>

        {/* === NEXT BUTTON === */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-primary text-text-on-primary px-6 py-2 rounded-md hover:opacity-90 transition"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;
