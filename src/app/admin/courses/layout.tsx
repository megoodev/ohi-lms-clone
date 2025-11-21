import { ReactNode } from "react";

const layoutCourse = ({ children }: { children: ReactNode }) => {
  return <div className="p-5">{children}</div>;
};

export default layoutCourse;
