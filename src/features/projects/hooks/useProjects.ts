"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project } from "../types";
import { useTeams } from "@/features/teams/hooks/useTeams";

export function useProjects(teamId?: string) {
  const { user } = useAuth();
  const { teams: myTeams } = useTeams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const teamsIds = myTeams.map((team) => team.id);

    let q = query(
      collection(db, "projects"),
      where("createdBy", "==", user.uid)
    );
    if (teamId) {
      q = query(collection(db, "projects"), where("teamId", "==", teamId));
    } else if (teamsIds.length > 0) {
      q = query(collection(db, "projects"), where("teamId", "in", teamsIds));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectList: Project[] = [];
      snapshot.forEach((doc) => {
        projectList.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(projectList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, teamId, myTeams]);

  const createProject = useCallback(
    async (name: string, description: string, teamId: string) => {
      if (!user) return;

      const project: Omit<Project, "id"> = {
        name,
        description,
        teamId,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        taskIds: [],
      };

      const docRef = await addDoc(collection(db, "projects"), project);
      return docRef.id;
    },
    [user]
  );

  const updateProject = useCallback(
    async (projectId: string, data: Partial<Project>) => {
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    },
    []
  );

  const deleteProject = useCallback(async (projectId: string) => {
    await deleteDoc(doc(db, "projects", projectId));
  }, []);

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
  };
}
