import React, { ReactNode } from "react";

type HeadingProps = {
  children: ReactNode;
};

const Heading: React.FC<HeadingProps> = ({ children }) => {
  return (
    <h1 className="inline-block text-2xl border-b-2 border-primary pb-1 md:text-3xl font-extrabold tracking-tight text-text-primary">
      {children}
    </h1>
  );
};

export default Heading;
