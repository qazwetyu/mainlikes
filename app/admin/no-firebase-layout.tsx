"use client";

export default function NoFirebaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
} 