import {
  addDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task } from "@/features/types";

interface CreateTaskData
  extends Omit<
    Task,
    "id" | "createdAt" | "updatedAt" | "createdBy" | "projectId"
  > {
  createdBy: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UpdateTaskData
  extends Partial<
    Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy" | "projectId">
  > {}

export function useTaskActions() {
  const createTask = async (projectId: string, taskData: CreateTaskData) => {
    const timestamp = new Date().toISOString();

    // Create the task in the tasks collection
    const taskDoc = await addDoc(collection(db, "tasks"), {
      projectId,
      ...taskData,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const taskId = taskDoc.id;

    // Add the task reference to the project
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      taskIds: arrayUnion(taskId),
    });

    return taskId;
  };

  const updateTask = async (taskId: string, updates: UpdateTaskData) => {
    const taskRef = doc(db, "tasks", taskId);
    const timestamp = new Date().toISOString();

    // Get current task to ensure it exists
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists()) {
      throw new Error("Task not found");
    }

    // Update the task with new data
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: timestamp,
    });

    return taskId;
  };

  const deleteTask = async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);

    // Get task data to find its project
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists()) {
      throw new Error("Task not found");
    }

    const taskData = taskSnap.data() as Task;
    const projectRef = doc(db, "projects", taskData.projectId);

    // Remove task from project's taskIds
    await updateDoc(projectRef, {
      taskIds: arrayRemove(taskId),
    });

    // Delete the task document
    await deleteDoc(taskRef);
  };

  return {
    createTask,
    updateTask,
    deleteTask,
  };
}
