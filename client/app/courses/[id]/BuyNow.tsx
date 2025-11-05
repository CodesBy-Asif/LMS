"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useCreateOrderMutation, useCreatePaymentMutation } from "@/redux/features/order/orderApi";
import { useLoadUserQuery } from "@/redux/features/api/ApiSlice";
import { skip } from "node:test";

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// --- Checkout Form ---
const CheckoutForm = ({
  course,
  onClose,
}: {
  course: any;
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const[loadUser, setLoadUser] = useState(false);
  const [createOrder] = useCreateOrderMutation();
  const [createPayment] = useCreatePaymentMutation();
  const {} = useLoadUserQuery(undefined,{skip: !loadUser});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Create PaymentIntent on server
 const intentRes =  await createPayment({ amount: course.price * 100, product: course.name })
     const { client_secret } =  intentRes.data;

      // 2️⃣ Confirm card payment
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: { name: "Student" },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        setLoading(false);
        return;
      }

      // 3️⃣ Verify payment succeeded
      if (result.paymentIntent?.status === "succeeded") {
        // 4️⃣ Create order in your backend
        const orderRes = await createOrder({courseId:course._id,paymentInfo:{id:result.paymentIntent.id}});

        const orderData = orderRes;
        if (orderData.data && orderData.data.success) {
          toast.success("Payment verified and order created successfully!");
          setLoadUser(true);
          onClose();

        } else if(orderData && orderData.error){ 
            const message = orderData.error as any;
            const errorMessage = message.data.message;
          setError("Payment succeeded, but order creation failed. please contact admin with payment id as: " + result.paymentIntent.id);
          toast.error( errorMessage);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": { color: "#a0aec0" },
            },
            invalid: { color: "#e53e3e" },
          },
        }}
        className="p-3 border rounded-lg bg-card"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-primary text-foreground px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${course.price}`}
      </button>
    </form>
  );
};

// --- Buy Now Dialog ---
export const BuyNowDialog = ({
  open,
  onClose,
  course,
}: {
  open: boolean;
  onClose: () => void;
  course: any;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* Dialog */}
      <div className="relative bg-card rounded-xl shadow-lg w-full max-w-md p-6 z-10">
        <h2 className="text-xl font-semibold mb-2">{`Buy ${course.title}`}</h2>
        <p className="text-muted-foreground mb-4">Price: ${course.price}</p>

        <Elements stripe={stripePromise}>
          <CheckoutForm course={course} onClose={onClose} />
        </Elements>

        <button
          onClick={onClose}
          className="mt-4 w-full border border-border rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
