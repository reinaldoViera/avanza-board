"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Team, TeamMember } from "../types";
import { useAuth } from "@/features/auth/AuthProvider";
import { nanoid } from "nanoid";

export function useTeams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "teams"),
      where(`members.${user.uid}`, "!=", null)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Team[];
      setTeams(teamsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createTeam = async (name: string, description: string) => {
    if (!user) return null;

    const teamRef = doc(collection(db, "teams"));
    const inviteCode = nanoid(10);

    const newTeam: Omit<Team, "id"> = {
      name,
      description,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inviteCode,
      members: {
        [user.uid]: {
          userId: user.uid,
          email: user.email || "",
          role: "owner",
          joinedAt: new Date().toISOString(),
        },
      },
    };

    await setDoc(teamRef, newTeam);
    return teamRef.id;
  };

  const updateTeam = async (teamId: string, data: Partial<Team>) => {
    const teamRef = doc(db, "teams", teamId);
    await updateDoc(teamRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  const generateInviteLink = async (teamId: string) => {
    const inviteCode = nanoid(10);
    const inviteRef = doc(collection(db, "teamInvites"));

    await setDoc(inviteRef, {
      teamId,
      code: inviteCode,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      createdBy: user?.uid,
      createdAt: new Date().toISOString(),
      used: false,
    });

    return `${window.location.origin}/teams/join/${inviteCode}`;
  };

  const joinTeamWithCode = async (inviteCode: string) => {
    if (!user) return false;

    const invitesQuery = query(
      collection(db, "teamInvites"),
      where("code", "==", inviteCode),
      where("used", "==", false)
    );

    const invitesSnapshot = await getDocs(invitesQuery);
    if (invitesSnapshot.empty) {
      throw new Error("Invalid or expired invite code");
    }

    const invite = invitesSnapshot.docs[0].data();
    if (new Date(invite.expiresAt) < new Date()) {
      throw new Error("Invite link has expired");
    }

    const teamRef = doc(db, "teams", invite.teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error("Team not found");
    }

    const team = teamDoc.data() as Team;
    const isAlreadyMember = team.members[user.uid] !== undefined;

    if (isAlreadyMember) {
      throw new Error("You are already a member of this team");
    }

    const newMember = {
      id: nanoid(10),
      userId: user.uid,
      email: user.email || "",
      role: "member",
      joinedAt: new Date().toISOString(),
    };

    await updateDoc(teamRef, {
      members: { ...team.members, [user.uid]: newMember },
      updatedAt: new Date().toISOString(),
    });

    await updateDoc(doc(db, "teamInvites", invitesSnapshot.docs[0].id), {
      used: true,
    });

    return true;
  };

  const updateMemberRole = async (
    teamId: string,
    userId: string,
    newRole: TeamMember["role"]
  ) => {
    const teamRef = doc(db, "teams", teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error("Team not found");
    }

    const team = teamDoc.data() as Team;
    const updatedMembers = { ...team.members };
    updatedMembers[userId].role = newRole;

    await updateDoc(teamRef, {
      members: updatedMembers,
      updatedAt: new Date().toISOString(),
    });
  };

  const removeMember = async (teamId: string, userId: string) => {
    const teamRef = doc(db, "teams", teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error("Team not found");
    }

    const team = teamDoc.data() as Team;
    const updatedMembers = { ...team.members };
    delete updatedMembers[userId];

    await updateDoc(teamRef, {
      members: updatedMembers,
      updatedAt: new Date().toISOString(),
    });
  };

  return {
    teams,
    loading,
    createTeam,
    updateTeam,
    generateInviteLink,
    joinTeamWithCode,
    updateMemberRole,
    removeMember,
  };
}
