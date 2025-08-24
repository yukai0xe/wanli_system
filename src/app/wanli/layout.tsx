import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Suspense>
      <Navbar />
      <div
        className="overflow-y-auto overflow-x-hidden w-screen h-screen pt-[100px]"
      >
        {children}
      </div>
      <Footer />
    </Suspense>
  );
}
