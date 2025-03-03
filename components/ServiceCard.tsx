"use client";

import Image from "next/image";
import PaymentButton from "./PaymentButton";

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function ServiceCard({ id, name, description, price, imageUrl }: ServiceCardProps) {
  const handlePayment = async () => {
    // This will automatically trigger the loading state in PaymentButton
    const response = await fetch("/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: price,
        description: `Payment for ${name}`,
        orderId: "order-" + Math.random().toString(36).substring(2, 9)
      })
    });

    const data = await response.json();
    
    if (data.success && data.paymentUrl) {
      window.location.href = data.paymentUrl;
    } else {
      throw new Error(data.message || "Payment creation failed");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">{price} ₮</span>
          <PaymentButton onPayment={handlePayment} />
        </div>
      </div>
    </div>
  );
} 