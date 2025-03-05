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
          <PaymentButton 
            serviceId={id}
            serviceName={name}
            price={price}
            buttonText="Buy Now"
          />
        </div>
      </div>
    </div>
  );
} 