"use client";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import React, { use, useEffect, useState } from "react";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";



const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
const [faqData, setFaqData] = useState([
    {
        question: "What is the purpose of this website?",
        answer:
            "The purpose of this website is to provide a platform for users to learn and practice programming concepts while also having fun.",
    },
    {
        question: "Is this website free to use?",
        answer:
            "Yes, this website is completely free to use. We do not charge any fees for accessing or using our platform.",
    },
    {
        question: "Can I use this website for commercial purposes?",
        answer:
            "Yes, you can use this website for commercial purposes as long as you follow our terms and conditions.",
    },
    {
        question: "What are the terms and conditions for using this website?",
        answer:
            "The terms and conditions for using this website can be found in our Privacy Policy and Terms of Use.",
    },
])
const { data } = useGetHeroDataQuery("Faq");

  useEffect(() => {
    if (data) {
      setFaqData(data.layout.faqs);
    }
    console.log(data);
  }, [data]);
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-background  py-16 px-6 lg:px-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-md text-muted-foreground mb-10">
          Have questions? We’ve got answers to the most common queries about our platform.
        </p>

        <div className="text-left space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-card shadow-sm rounded-2xl p-5 transition-all duration-300 hover:shadow-md"
            >
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ArrowUpIcon className="text-primary" width={18} height={18} />
                ) : (
                  <ArrowDownIcon className="text-gray-500"   width={18} height={18}/>
                )}
              </button>

              <div
                className={`mt-3 text-gray-600 text-sm leading-relaxed transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
