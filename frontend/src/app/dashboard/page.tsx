"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/api";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
      return;
    }
    
    fetchProjects();
  }, [isAuthenticated, router]);

  const fetchProjects = async () => {
    try {
      const data = await fetchWithAuth("/projects/");
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchWithAuth("/projects/", {
        method: "POST",
        body: JSON.stringify({ name: newProjectName, description: newProjectDesc }),
      });
      setNewProjectName("");
      setNewProjectDesc("");
      fetchProjects();
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await fetchWithAuth(`/projects/${id}`, { method: "DELETE" });
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button 
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Log Out
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Project</h2>
          <form onSubmit={createProject} className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Description"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Create
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 flex flex-col">
              <div className="px-4 py-5 sm:p-6 flex-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {project.name}
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>{project.description || "No description provided."}</p>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center">
                <Link 
                  href={`/projects/${project.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Tasks &rarr;
                </Link>
                <button 
                  onClick={() => deleteProject(project.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {projects.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              You don't have any projects yet. Create one above!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
