"use client";
import { ReactNode, createContext, useContext } from "react";

type TrackLinkContextType = {
  trackLinkClick: (url: string, pageName: string, teamId: string) => void;
};

export const TrackLinkContext = createContext<TrackLinkContextType | null>(null);
type TrackLinkProps = {
    url: string;
    pageName: string;
    teamId: string;
    children: ReactNode;
    className?: string;
};

const useTrackLink = () => {
  const ctx = useContext(TrackLinkContext);
  if (!ctx)
    throw new Error("useTrackLink must be used inside TrackLinkProvider");
  return ctx;
};

export default function TrackLink({
    url,
    pageName,
    teamId,
    children,
    className,
}: TrackLinkProps) {
  const { trackLinkClick } = useTrackLink();

  const handleClick = () => {
    trackLinkClick(url, pageName, teamId);
  };

  return (
    <span
      onClick={handleClick}
      className={className}
      style={{ cursor: "pointer" }}
    >
      {children}
    </span>
  );
}
