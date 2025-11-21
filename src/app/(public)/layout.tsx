import { ReactNode } from "react";
import Navbar from "./_components/Navbar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto">{children}</main>
    </>
  );
};

export default layout;
