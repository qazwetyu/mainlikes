"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PaymentButton from "../../components/PaymentButton";

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add your service fetching logic here

  const handlePayment = async () => {
    try {
      // Call your payment API
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: service?.price,
          description: `Payment for ${service?.name}`,
          orderId: "order-" + Math.random().toString(36).substring(2, 9),
          customerEmail: "customer@example.com"
        })
      });

      const data = await response.json();
      
      if (data.success && data.paymentUrl) {
        // Redirect to payment page
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.message || "Payment creation failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Төлбөр үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading ? (
        <div>Loading service details...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">{service?.name}</h1>
          <p className="text-gray-700 mb-4">{service?.description}</p>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-bold">{service?.price} ₮</div>
              <PaymentButton 
                serviceId={params.id}
                serviceName={service?.name || 'Service'}
                price={service?.price || 0}
                buttonText="Buy Now"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 