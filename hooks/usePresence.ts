"use client";

import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function usePresence(userId: Id<"users"> | undefined) {
  const updatePresence = useMutation(api.presence.updatePresence);

  useEffect(() => {
    if (!userId) return;

    updatePresence({ userId });
    const interval = setInterval(() => {
      updatePresence({ userId });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [userId, updatePresence]);
}
