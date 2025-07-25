import React from "react";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import { routeConfig } from "../../routes/routeConfig";
import { getRouteByPath } from "../../routes/routeDefinitions";
import { useStatus } from "../../contexts/StatusContext";
import type { PageTitleEntry } from "../../routes/routeConfig";

function findPageEntry(pathname: string, entries: Record<string, PageTitleEntry>): PageTitleEntry | undefined {
  for (const [key, entry] of Object.entries(entries)) {
    if (key === pathname) return entry;
    if (entry.children) {
      const child = findPageEntry(pathname, entry.children);
      if (child) return child;
    }
  }
  return undefined;
}

const HeaderWithRoute: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  const page = findPageEntry(pathname, routeConfig) || { title: "", pretitle: "", icon: "" };
  const route = getRouteByPath(pathname);
  const { status } = useStatus();
  
  // Verwende den Status aus dem Context, falls vorhanden, sonst den aus der Route
  const headerStatus = status || route?.status;
  
  return <Header title={page.title} status={headerStatus} />;
};

export default HeaderWithRoute; 