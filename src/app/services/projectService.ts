"use client";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: number;
  type?: "text" | "code" | "image";
  status?: "sending" | "sent" | "error";
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  code: string;
  status: 'In Progress' | 'Completed' | 'Archived';
  chatHistory: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export const PROJECT_STORAGE_KEY = 'fixster_user_projects';

export function getUserProjects(userId: string): Project[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const allProjects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY) || '{}');
    return allProjects[userId] || [];
  } catch (error) {
    console.error('Error retrieving user projects:', error);
    return [];
  }
}

export function getProject(userId: string, projectId: string): Project | null {
  try {
    const projects = getUserProjects(userId);
    return projects.find(p => p.id === projectId) || null;
  } catch (error) {
    console.error('Error retrieving project:', error);
    return null;
  }
}

export function saveUserProject(userId: string, project: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'chatHistory'>): Project {
  if (typeof window === 'undefined') throw new Error('Cannot save project on server side');
  
  try {
    const allProjects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY) || '{}');
    const userProjects = allProjects[userId] || [];
    
    const timestamp = Date.now();
    const newProject: Project = {
      ...project,
      id: `proj_${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      chatHistory: [],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    allProjects[userId] = [...userProjects, newProject];
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(allProjects));
    
    return newProject;
  } catch (error) {
    console.error('Error saving user project:', error);
    throw error;
  }
}

export function updateUserProject(userId: string, projectId: string, updates: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>): Project {
  if (typeof window === 'undefined') throw new Error('Cannot update project on server side');
  
  try {
    const allProjects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY) || '{}');
    const userProjects = allProjects[userId] || [];
    
    const projectIndex = userProjects.findIndex((p: Project) => p.id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');
    
    const updatedProject = {
      ...userProjects[projectIndex],
      ...updates,
      updatedAt: Date.now()
    };
    
    userProjects[projectIndex] = updatedProject;
    allProjects[userId] = userProjects;
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(allProjects));
    
    return updatedProject;
  } catch (error) {
    console.error('Error updating user project:', error);
    throw error;
  }
}

export function addMessageToProject(userId: string, projectId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Project {
  if (typeof window === 'undefined') throw new Error('Cannot update project on server side');
  
  try {
    const project = getProject(userId, projectId);
    if (!project) throw new Error('Project not found');
    
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
    };
    
    return updateUserProject(userId, projectId, {
      chatHistory: [...(project.chatHistory || []), newMessage]
    });
  } catch (error) {
    console.error('Error adding message to project:', error);
    throw error;
  }
}

export function deleteUserProject(userId: string, projectId: string): void {
  if (typeof window === 'undefined') throw new Error('Cannot delete project on server side');
  
  try {
    const allProjects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY) || '{}');
    const userProjects = allProjects[userId] || [];
    
    const filteredProjects = userProjects.filter((p: Project) => p.id !== projectId);
    allProjects[userId] = filteredProjects;
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(allProjects));
  } catch (error) {
    console.error('Error deleting user project:', error);
    throw error;
  }
}