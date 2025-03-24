"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getUserProjects, Project, deleteUserProject } from "../services/projectService";
import { Search, FolderOpen, Clock, PlusCircle, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "updated">("updated");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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

  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); // Prevent project selection when clicking delete
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (user && projectToDelete) {
      deleteUserProject(user.id, projectToDelete.id);
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      setShowDeleteModal(false);
      setProjectToDelete(null);

      // If the deleted project was active, clear it
      const activeProject = localStorage.getItem("activeProject");
      if (activeProject === projectToDelete.id) {
        localStorage.removeItem("activeProject");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900 pt-4">
      <Sidebar />
      <main className="ml-64 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Your Projects</h1>
              <p className="text-sm text-slate-400 mt-1">
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
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "updated")}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="updated">Last Updated</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-left w-full group"
                >
                  <div 
                    className="flex-1 flex items-center cursor-pointer"
                    onClick={() => handleSelectProject(project.id)}
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-4">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{project.name}</h3>
                      <p className="text-sm text-slate-400 truncate">{project.description}</p>
                      <div className="flex items-center mt-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Last updated {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(e, project)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors ml-4"
                    title="Delete project"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-1">No projects found</h3>
                <p className="text-slate-400 mb-4">
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
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-backdrop">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 animate-modal-enter">
            <h2 className="text-xl font-semibold mb-4 text-white">Delete Project</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete &quot;{projectToDelete?.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
