'use client';
import React, { useState } from 'react';
import { useAddReviewMutation } from '@/redux/features/courses/courseApi';

const ReviewsTab = ({ courseId, courseData, setCourseData }: any) => {
  const [addReview, { isLoading }] = useAddReviewMutation();
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [openReplyForm, setOpenReplyForm] = useState<string | null>(null); // track which reply form is open

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const rating = Number((form.elements.namedItem('rating') as HTMLSelectElement).value);
    const comment = (form.elements.namedItem('review') as HTMLTextAreaElement).value;

    if (!rating || !comment.trim()) return;

    try {
      const data = await addReview({
        id: courseId,
        data: { ratting: rating, comment },
      }).unwrap();

      setCourseData((prev: any) => ({
        ...prev,
        rating: data.course.rating,
        reviews: data.course.reviews,
      }));

      form.reset();
      alert('Review added successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add review.');
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    const reply = replyText[reviewId]?.trim();
    if (!reply) return;

    try {
      // Assuming your API supports adding reply to a review
      const data = await addReview({
        id: courseId,
        data: { parentReviewId: reviewId, comment: reply },
      }).unwrap();

      setCourseData((prev: any) => ({
        ...prev,
        reviews: data.course.reviews,
        rating: data.course.rating,
      }));

      setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
      setOpenReplyForm(null); // close the reply form after submitting
    } catch (err) {
      console.error(err);
      alert('Failed to add reply.');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">Course Reviews</h3>

      {/* ⭐ Average Rating */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl font-bold text-yellow-500">
          ⭐ {(courseData.ratting || 0).toFixed(2)}
        </span>
        <span className="text-muted-foreground">
          ({courseData.reviews?.length || 0} reviews)
        </span>
      </div>

      {/* 🗒 Review List */}
      {courseData.reviews?.length > 0 ? (
        <div className="space-y-4">
          {courseData.reviews.slice(0, 5).map((review: any, index: number) => (
            <div key={index} className="border border-border rounded-lg p-4 bg-card shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-foreground">{review.user?.name || 'Anonymous'}</h4>
                <span className="text-yellow-400">⭐ {review.ratting}/5</span>
              </div>
              <p className="text-muted-foreground mb-2">{review.comment}</p>

              {/* Replies */}
              {review.replies?.length > 0 && (
                <div className="ml-4 mt-2 space-y-2 border-l border-border pl-2">
                  {review.replies.map((reply: any, idx: number) => (
                    <div key={idx} className="bg-background rounded-lg p-2">
                      <span className="font-medium text-foreground">
                        {reply.user?.name || 'Anonymous'}:
                      </span>{' '}
                      <span className="text-muted-foreground">{reply.comment}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Show "Add Reply" button */}
              {openReplyForm !== review._id && (
                <button
                  onClick={() => setOpenReplyForm(review._id)}
                  className="text-sm text-primary mt-2 hover:underline"
                >
                  Add Reply
                </button>
              )}

              {/* Add Reply Form (only if clicked) */}
              {openReplyForm === review._id && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    className="flex-1 border border-border rounded-lg px-3 py-1"
                    value={replyText[review._id || review.id] || ''}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [review._id || review.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => handleReplySubmit(review._id || review.id)}
                    className="bg-primary text-white px-4 py-1 rounded-lg hover:bg-primary-dark"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setOpenReplyForm(null)}
                    className="bg-gray-300 text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      )}

      {/* ✍️ Add Review Form */}
      <form onSubmit={handleSubmit} className="mt-6 border-t border-border pt-4 space-y-3">
        <h4 className="font-medium mb-2">Add Your Review</h4>
        <select
          className="w-full border border-border bg-background rounded-lg px-3 py-2"
          name="rating"
          required
        >
          <option value="">Select rating</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 ? 's' : ''}
            </option>
          ))}
        </select>
        <textarea
          className="w-full border border-border bg-background rounded-lg px-3 py-2"
          placeholder="Write your feedback..."
          rows={3}
          name="review"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewsTab;
