import React, { ReactElement, useState } from "react";
import { useAppSelector } from "app/hooks";
import { selectUserAddress } from "features/auth/authSlice";
import { useLocation } from "react-router-dom";
import Welcome from "features/welcome/Welcome";
import { SNSRoutes } from "features/share/SNS";
interface MilestoneProps {
  children: ReactElement;
  isSsafyNet: boolean;
}
const Milestone = ({ children, isSsafyNet }: MilestoneProps) => {
  const [isWelcome, setIsWelcome] = useState<boolean>(true);
  const userAddress = useAppSelector(selectUserAddress);
  const { pathname } = useLocation();
  if (pathname.startsWith("/readme")) return <SNSRoutes />;
  else if (userAddress && !isWelcome) return children;
  else return <Welcome setIsWelcome={setIsWelcome} isSsafyNet={isSsafyNet} />;
};

export default Milestone;
