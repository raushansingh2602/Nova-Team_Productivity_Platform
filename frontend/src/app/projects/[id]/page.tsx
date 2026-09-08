"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/api";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  project_id: number;
}

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function ProjectDetails() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
      return;
    }
    
    if (projectId) {
      fetchProject();
      fetchTasks();
    }
  }, [projectId, isAuthenticated]);

  const fetchProject = async () => {
    try {
      const data = await fetchWithAuth(`/projects/${projectId}`);
      setProject(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await fetchWithAuth(`/projects/${projectId}/tasks/`);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchWithAuth(`/projects/${projectId}/tasks/`, {
        method: "POST",
        body: JSON.stringify({ title: newTaskTitle, description: newTaskDesc }),
      });
      setNewTaskTitle("");
      setNewTaskDesc("");
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const taskToUpdate = tasks.find((t) => t.id === taskId);
      if (!taskToUpdate) return;
      
      await fetchWithAuth(`/projects/${projectId}/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ ...taskToUpdate, status: newStatus }),
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await fetchWithAuth(`/projects/${projectId}/tasks/${taskId}`, { method: "DELETE" });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  if (!project) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const renderTaskColumn = (title: string, status: string) => {
    const columnTasks = tasks.filter((t) => t.status === status);
    return (
      <div className="bg-gray-100 rounded-lg p-4 w-full">
        <h3 className="font-semibold text-gray-700 mb-4 flex justify-between">
          <span>{title}</span>
          <span className="bg-gray-200 text-gray-600 px-2 rounded-full text-sm">{columnTasks.length}</span>
        </h3>
        <div className="space-y-3">
          {columnTasks.map((task) => (
            <div key={task.id} className="bg-white p-3 rounded shadow-sm border border-gray-200">
              <h4 className="font-medium text-gray-900">{task.title}</h4>
              <p className="text-sm text-gray-500 mt-1 mb-3">{task.description}</p>
              
              <div className="flex justify-between items-center text-xs">
                <select 
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  className="border-gray-300 rounded text-gray-600 focus:ring-blue-500"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {columnTasks.length === 0 && (
            <div className="text-sm text-gray-400 text-center py-4 border-2 border-dashed border-gray-200 rounded">
              No tasks
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-500">{project.description}</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add Task</h2>
          <form onSubmit={createTask} className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Task Title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Description"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
            >
              Add Task
            </button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {renderTaskColumn("To Do", "TODO")}
          {renderTaskColumn("In Progress", "IN_PROGRESS")}
          {renderTaskColumn("Done", "DONE")}
        </div>
      </main>
    </div>
  );
}
