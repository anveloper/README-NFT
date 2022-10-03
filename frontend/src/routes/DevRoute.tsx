import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";

interface DevRouteProps {
  children: ReactElement;
}

const isDev = process.env.NODE_ENV !== "production";

const DevRoute = ({ children }: DevRouteProps) => {
  if (!isDev) return children;
  else return <Navigate to="/" replace />;
};

export default DevRoute;
