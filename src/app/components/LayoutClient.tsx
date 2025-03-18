"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isProjectSet, setIsProjectSet] = useState(false);

  useEffect(() => {
    const activeProject = localStorage.getItem("activeProject");
    if (!activeProject) {
      router.push("/new-project"); // Redirect if no project is set
    } else {
      setIsProjectSet(true);
    }
  }, [router]);

  if (!isProjectSet) return null; // Prevents flashing

  return <div className="flex min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">{children}</div>;
}
