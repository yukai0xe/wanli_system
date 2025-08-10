import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '100px' }}>
        {children}
      </div>
      <Footer />
    </>
  );
}
