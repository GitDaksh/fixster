"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getUserProjects, Project } from "./services/projectService";

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userProjects = getUserProjects(user.id);
      setProjects(userProjects);
    }
    setLoading(false);
  }, [user]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading your workspace...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Welcome to Fixster
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              AI-powered code debugging assistant
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Please sign in to continue
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to Fixster
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            AI-powered code debugging assistant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/new-project")}
            className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300"
          >
            <div className="p-8">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Create New Project</h2>
              <p className="text-slate-600 dark:text-slate-400">Start fresh with a new project and get AI assistance</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>

          <button
            onClick={() => router.push("/projects")}
            className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300"
          >
            <div className="p-8">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Existing Projects</h2>
              <p className="text-slate-600 dark:text-slate-400">
                {projects.length > 0 
                  ? `Continue working on one of your ${projects.length} existing projects`
                  : "Browse and select from your existing projects"}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>
        </div>

        {projects.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Projects</h3>
            <div className="grid gap-4">
              {projects.slice(0, 3).map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    localStorage.setItem("activeProject", project.id);
                    router.push("/dashboard");
                  }}
                  className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-4">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-slate-900 dark:text-white">{project.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}