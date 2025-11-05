import { styles } from "@/app/styles/styles";
import CloudinaryPlayer from "@/app/utils/CoursePlayer";
import React, { FC, useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

type Props = {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  courseData: any;
  handleCourseCreate: () => void;
};

const CoursePreview: FC<Props> = ({
  activeTab,
  setActiveTab,
  courseData,
  handleCourseCreate,
}) => {
  const [coupon, setCoupon] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [couponMessage, setCouponMessage] = useState("");

  const applyCoupon = () => {
    // Example: Hardcoded valid coupon
    if (coupon.toUpperCase() === "DISCOUNT50") {
      const discount = 50; // 50% discount
      const newPrice = parseInt(courseData.price) * ((100 - discount) / 100);
      setDiscountedPrice(newPrice);
      setCouponMessage(`Coupon applied! ${discount}% off`);
    } else {
      setDiscountedPrice(null);
      setCouponMessage("Invalid coupon code");
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-500" />);
    }
    return stars;
  };

  const priceToShow = discountedPrice ?? parseInt(courseData.price);

  return (
    <div className="py-5 mb-5">
      <div className="relative w-full">
        {/* Video Player */}
        <div className="w-full mt-10">
          <CloudinaryPlayer
            title={courseData.name}
            publicId={courseData.demoUrl}
          />
        </div>

        {/* Course Title & Price */}
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-[25px] font-bold">
            {priceToShow === 0 ? "Free" : "$" + priceToShow}
          </h1>
          {courseData.estimatedPrice && (
            <h5 className="text-[18px] text-red-500 font-semibold">
              {(
                parseInt(courseData.estimatedPrice) -
                (parseInt(courseData.price) / parseInt(courseData.price)) * 100
              ).toFixed(1)}
              % off
            </h5>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center mt-2">
          {renderStars(courseData.rating || 0)}
          <span className="ml-2 text-gray-600">
            ({courseData.totalReviews || 0} reviews)
          </span>
        </div>

        {/* Purchases */}
        <div className="mt-2 text-gray-700">
          <strong>Purchases:</strong> {courseData.purchases || 0}
        </div>

        {/* Course Description */}
        <div className="mt-4 text-gray-800">
          <h3 className="font-semibold mb-2">Description</h3>
          <p>{courseData.description || "No description available."}</p>
        </div>

        {/* Benefits */}
        {courseData.benefits && courseData.benefits.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Benefits</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {courseData.benefits.map((benefit: string, index: number) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Coupon & Buy */}
        <div className="flex items-center mt-4 space-x-4">
          <input
            type="text"
            className={`${styles.input} flex-1`}
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <div
            className={`${styles.buttomPrimary} cursor-pointer`}
            onClick={applyCoupon}
          >
            Apply
          </div>
        </div>

        {/* Coupon message */}
        {couponMessage && (
          <p className="mt-2 text-sm text-green-600">{couponMessage}</p>
        )}

        {/* Buy Button */}
        <div className="flex items-center mt-4">
          <div className={`${styles.buttomPrimary} md:w-[200px] w-full`}>
            Buy Now {priceToShow === 0 ? "Free" : "$" + priceToShow}
          </div>
        </div>
      </div>
     <div className="flex  mt-4 items-center justify-between">
      <button onClick={()=>setActiveTab(activeTab-1)} className={`${styles.buttomPrimary} !bg-secondary px-4 py-2 text-white`}>
        prev
      </button>
      <button onClick={()=>handleCourseCreate()} className={`${styles.buttomPrimary} px-4 py-2 text-white`}>
        create
      </button>

     </div>
    </div>
  );
};

export default CoursePreview;
