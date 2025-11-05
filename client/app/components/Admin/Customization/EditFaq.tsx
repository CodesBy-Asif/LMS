"use client";
import React, { useEffect, useState } from "react";
import { styles } from "@/app/styles/styles";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";

const EditFaq = () => {
  const { data, refetch } = useGetHeroDataQuery("Faq", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading, isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();

  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {

    if (data?.layout?.faqs) {
      setQuestions(data.layout.faqs.map((q: any) => ({ ...q, active: false })));
      console.log(data)
    }

    if (layoutSuccess) {
      refetch();
      toast.success("FAQ updated successfully!");
    }

    if (error && "data" in error) {
      toast.error((error as any)?.data?.message);
    }
  }, [data, layoutSuccess, error, refetch]);

  // Toggle open/close question
  const toggleQuestion = (index: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, active: !q.active } : q))
    );
  };

  // Edit question text
  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, question: value } : q))
    );
  };

  // Edit answer text
  const handleAnswerChange = (index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, answer: value } : q))
    );
  };

  // Add new FAQ
  const newFaqHandler = () => {
    if (questions.some((q) => q.question.trim() === "" || q.answer.trim() === "")) {
      toast.error("Please fill existing FAQ entries before adding a new one.");
      return;
    }

    setQuestions([...questions, { question: "", answer: "", active: true }]);
  };

  // Compare old vs new
  const areQuestionsUnchanged = (original: any[], current: any[]) =>
    JSON.stringify(original) === JSON.stringify(current);

  const isAnyQuestionEmpty = (questions: any[]) =>
    questions.some((q) => q.question.trim() === "" || q.answer.trim() === "");

  // Save FAQ
  const handleEdit = async () => {
    if (
      !areQuestionsUnchanged(data.layout.faq, questions) &&
      !isAnyQuestionEmpty(questions)
    ) {
      await editLayout({
        type: "FAQ",
        faq: questions.map(({ question, answer }) => ({ question, answer })),
      });
    }
  };

  const canSave =
    !areQuestionsUnchanged(data?.layout?.faq || [], questions) &&
    !isAnyQuestionEmpty(questions);

  if (isLoading) return <Loader />;

  return (
    <div className="w-[95%] md:w-[80%] mx-auto mt-[100px] mb-16">
      <h1 className={`${styles.title} text-center mb-8`}>Manage FAQs</h1>

      <div className="space-y-4">
        {questions.map((q, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 rounded-2xl p-4 transition hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <input
                className="flex-1 bg-transparent border-none outline-none text-[18px] dark:text-white text-black placeholder:text-gray-400"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder="Enter question..."
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="text-sm text-primary hover:underline"
                >
                  {q.active ? "Hide" : "Show"}
                </button>
                <AiOutlineDelete
                  className="text-red-500 hover:text-red-600 text-[22px] cursor-pointer transition"
                  onClick={() =>
                    setQuestions((prev) => prev.filter((_, i) => i !== index))
                  }
                />
              </div>
            </div>

            {q.active && (
              <div className="mt-3">
                <textarea
                  className="w-full bg-transparent border-none outline-none text-[16px] dark:text-gray-200 text-gray-800 placeholder:text-gray-400 resize-none"
                  rows={3}
                  value={q.answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Enter answer..."
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <IoMdAddCircleOutline
          className="text-primary text-[35px] hover:scale-110 transition-transform cursor-pointer"
          onClick={newFaqHandler}
        />
      </div>

      <div className="flex justify-end mt-8">
        <button
          disabled={!canSave}
          onClick={handleEdit}
          className={`px-6 py-2 rounded-xl text-white font-semibold transition-all 
            ${
              canSave
                ? "bg-primary hover:bg-primary/90 shadow-md"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditFaq;
