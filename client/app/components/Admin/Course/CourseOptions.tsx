"use client";

import React, { FC, useRef } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

type Props = {
  activeTab: number;
  setactiveTab: (activeTab: number) => void;
  banefits: { title: string }[];
  setBanefits: (banefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
};

const CourseOptions: FC<Props> = ({
  activeTab,
  setactiveTab,
  banefits,
  setBanefits,
  prerequisites,
  setPrerequisites,
}) => {
  const benefitInputRef = useRef<HTMLInputElement | null>(null);
  const prereqInputRef = useRef<HTMLInputElement | null>(null);

  // Add Benefit (only if last one isn't empty)
  const handleAddBenefit = () => {
    if (banefits.length === 0 || banefits[banefits.length - 1].title.trim() !== "") {
      setBanefits([...banefits, { title: "" }]);
      setTimeout(() => {
        benefitInputRef.current?.focus();
      }, 50);
    }
  };

  // Update Benefit
  const handleBenefitChange = (index: number, value: string) => {
    const updated = [...banefits];
    updated[index].title = value;
    setBanefits(updated);
  };

  // Remove Benefit
  const handleRemoveBenefit = (index: number) => {
    setBanefits(banefits.filter((_, i) => i !== index));
  };

  // Add Prerequisite (only if last one isn't empty)
  const handleAddPrerequisite = () => {
    if (
      prerequisites.length === 0 ||
      prerequisites[prerequisites.length - 1].title.trim() !== ""
    ) {
      setPrerequisites([...prerequisites, { title: "" }]);
      setTimeout(() => {
        prereqInputRef.current?.focus();
      }, 50);
    }
  };

  // Update Prerequisite
  const handlePrerequisiteChange = (index: number, value: string) => {
    const updated = [...prerequisites];
    updated[index].title = value;
    setPrerequisites(updated);
  };

  // Remove Prerequisite
  const handleRemovePrerequisite = (index: number) => {
    setPrerequisites(prerequisites.filter((_, i) => i !== index));
  };

  // Handle Enter key for Benefits/Prerequisites
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "benefit" | "prerequisite"
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (type === "benefit") {
        const last = banefits[banefits.length - 1];
        if (last?.title.trim() === "") return; // prevent adding empty
        handleAddBenefit();
      } else {
        const last = prerequisites[prerequisites.length - 1];
        if (last?.title.trim() === "") return; // prevent adding empty
        handleAddPrerequisite();
      }
    }
  };

  // Handle "Previous" navigation with cleanup
  const handlePrevious = () => {
    const filteredBenefits = banefits.filter((b) => b.title.trim() !== "");
    const filteredPrereqs = prerequisites.filter((p) => p.title.trim() !== "");

    setBanefits(filteredBenefits);
    setPrerequisites(filteredPrereqs);
    setactiveTab(activeTab - 1);
  };

  // Handle "Next" navigation with validation
  const handleNext = () => {
    const emptyBenefit = banefits.some((b) => b.title.trim() === "");
    const emptyPrereq = prerequisites.some((p) => p.title.trim() === "");

    if (emptyBenefit || emptyPrereq) {
      alert("Please fill all fields before continuing.");
      return;
    }
    setactiveTab(activeTab + 1);
  };

  return (
    <div className="p-6 bg-background text-foreground rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Course Options</h2>

      {/* Benefits Section */}
      <section className="mb-8">
        <h3 className="font-medium text-lg mb-3">Course Benefits</h3>
        <div className="space-y-3">
          {banefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                ref={index === banefits.length - 1 ? benefitInputRef : null}
                type="text"
                id={`benefit-${index}`}
                placeholder={`Benefit ${index + 1}`}
                value={benefit.title}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, "benefit")}
                className="flex-1 p-2 w-full border border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveBenefit(index)}
                className="p-2 text-red-500 hover:bg-foreground/20 rounded-full transition"
                title="Remove"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleAddBenefit}
          type="button"
          className="flex items-center gap-2 mt-3 text-primary hover:underline"
        >
          <FaPlus /> Add Benefit
        </button>
      </section>

      {/* Prerequisites Section */}
      <section>
        <h3 className="font-medium text-lg mb-3">Course Prerequisites</h3>
        <div className="space-y-3">
          {prerequisites.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                ref={index === prerequisites.length - 1 ? prereqInputRef : null}
                type="text"
                id={`prerequisite-${index}`}
                placeholder={`Prerequisite ${index + 1}`}
                value={item.title}
                onChange={(e) =>
                  handlePrerequisiteChange(index, e.target.value)
                }
                onKeyDown={(e) => handleKeyPress(e, "prerequisite")}
                className="flex-1 p-2 w-full border border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => handleRemovePrerequisite(index)}
                className="p-2 text-red-500 hover:bg-foreground/20 rounded-full transition"
                title="Remove"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleAddPrerequisite}
          type="button"
          className="flex items-center gap-2 mt-3 text-primary hover:underline"
        >
          <FaPlus /> Add Prerequisite
        </button>
      </section>

      {/* Navigation Buttons */}
      <div className="mt-10 flex justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          className="md:px-5 px-3 md:text-sm text-xs py-2 bg-secondary text-foreground rounded-lg hover:opacity-90 transition"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="d:px-5 px-3 py-2 md:text-sm text-xs bg-primary text-foreground rounded-lg hover:opacity-90 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseOptions;
