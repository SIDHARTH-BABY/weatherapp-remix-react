import React from "react";

type layoutProps ={
    children : React.ReactNode
}
const Layout = ({ children }: layoutProps) => {
  return <div className="h-screen w-full bg-yellow-200">{children}</div>;
};

export default Layout;
