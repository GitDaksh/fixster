"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getUserProjects, Project } from "../services/projectService";
import { Search, FolderOpen, Clock, PlusCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "updated">("updated");

  useEffect(() => {
    if (user) {
      const userProjects = getUserProjects(user.id);
      setProjects(userProjects);
    }
  }, [user]);

  const filteredProjects = projects
    .filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return b.updatedAt - a.updatedAt;
    });

  const handleSelectProject = (projectId: string) => {
    localStorage.setItem("activeProject", projectId);
    router.push("/dashboard");
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your Projects</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} total
              </p>
            </div>
            <button
              onClick={() => router.push("/new-project")}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              New Project
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "updated")}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            >
              <option value="updated">Last Updated</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleSelectProject(project.id)}
                  className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left w-full group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-4">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 dark:text-white truncate">{project.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{project.description}</p>
                    <div className="flex items-center mt-1 text-xs text-slate-400 dark:text-slate-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Last updated {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="ml-4 transform translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                    <div className="flex items-center text-blue-500">
                      <span className="text-sm font-medium mr-2">Open</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No projects found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  {searchQuery ? "Try adjusting your search" : "Create your first project to get started"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => router.push("/new-project")}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Create New Project
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
