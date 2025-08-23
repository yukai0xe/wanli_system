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
      <div style={{ paddingTop: '100px' }}>
        {children}
      </div>
      <Footer />
    </Suspense>
  );
}
