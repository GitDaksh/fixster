"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, FolderOpen } from "lucide-react";

const projectsData = [
  { id: 1, name: "React Todo App", description: "A simple React-based todo list app.", status: "In Progress", link: "/projects/react-todo" },
  { id: 2, name: "Node.js API", description: "RESTful API using Node.js and Express.", status: "Completed", link: "/projects/nodejs-api" },
  { id: 3, name: "Python Flask Backend", description: "A backend service built with Flask.", status: "In Progress", link: "/projects/python-flask" },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projectsData.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      
      <div className="relative w-full mb-6">
        <Search className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Link key={project.id} href={project.link}>
              <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <FolderOpen className="text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{project.status}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
        )}
      </div>
    </div>
  );
}
