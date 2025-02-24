import { useAuth } from "@/features/auth/AuthProvider";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

import { TeamInvite } from "../types";

export function useTeamInvites(teamId: string) {
  const [teamInvites, setTeamInvites] = useState([] as TeamInvite[]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !teamId) return;

    const q = query(
      collection(db, "teamInvites"),
      where("teamId", "==", teamId),
      where("used", "==", false),
      where("expiresAt", ">", new Date().toISOString())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invitesData = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as TeamInvite
      );
      setTeamInvites(invitesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [teamId, user]);

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
  };

  return { teamInvites, loading, generateInviteLink };
}
