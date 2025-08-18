'use client';

const Page = ({ children }: {
  children: React.ReactNode,
}) => {
  return <div className="pl-2 pr-2 pt-10">{children}</div>;
};

export default Page;
