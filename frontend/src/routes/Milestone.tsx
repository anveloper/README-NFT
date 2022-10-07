import React, { ReactElement, useState } from "react";
import { useAppSelector } from "app/hooks";
import { selectIsWelcome, selectUserAddress } from "features/auth/authSlice";
import { useLocation } from "react-router-dom";
import Welcome from "features/welcome/Welcome";
import { SNSRoutes } from "features/share/SNS";
import NetGuide from "./NetGuide";
interface MilestoneProps {
  children: ReactElement;
  isSsafyNet: boolean;
}
const Milestone = ({ children, isSsafyNet }: MilestoneProps) => {
  // const [isWelcome, setIsWelcome] = useState<boolean>(true);
  const userAddress = useAppSelector(selectUserAddress);
  const isWelcome = useAppSelector(selectIsWelcome);
  const { pathname } = useLocation();
  if (pathname.startsWith("/readme")) return <SNSRoutes />;
  else if (userAddress && !isWelcome) return children;
  else if (pathname.startsWith("/guide")) return <NetGuide />;
  else return <Welcome isSsafyNet={isSsafyNet} />;
};

export default Milestone;
