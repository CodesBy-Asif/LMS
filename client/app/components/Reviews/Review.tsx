"use client";
import React from "react";
import { StarIcon } from "@heroicons/react/24/outline";

const reviews = [
  {
    id: 1,
    name: "Ali Raza",
    role: "Frontend Developer",
    rating: 5,
    review:
      "This platform has completely changed the way I learn! The mentors are super helpful and the course structure is well-organized.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Fatima Khan",
    role: "UI/UX Designer",
    rating: 4,
    review:
      "Great platform with amazing mentors. The progress tracking and structured modules really helped me stay consistent.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 3,
    name: "Ahmed Ali",
    role: "Backend Engineer",
    rating: 5,
    review:
      "A perfect blend of theory and practical learning. I especially loved how each course includes hands-on projects!",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
  },
];

const Reviews = () => {
  return (
    <section className="bg-background text-foreground py-16 px-6 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          What Our Learners Say
        </h2>
        <p className="text-muted-foreground mb-10">
          Hear from people who’ve experienced growth and success using our platform.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <img
                  src={review.image}
                  alt={review.name}
                  className="w-14 h-14 rounded-full mr-4"
                />
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-primary">
                    {review.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
                <div className="flex items-center mb-3">
               <StarIcon className="w-4 h-4 text-yellow-500" fill="oklch(79.5% 0.184 86.047)" />  <span className="ml-1">{review.rating}</span>
              </div>
              </div>

              

              <p className="text-muted-foreground text-sm leading-relaxed">
                “{review.review}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
