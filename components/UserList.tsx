"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Id } from "@/convex/_generated/dataModel";

interface UserListProps {
  currentUserId?: Id<"users">;
  selectedUserId?: Id<"users">;
  onSelectUser: (userId: Id<"users">) => void;
}

export function UserList({ currentUserId, selectedUserId, onSelectUser }: UserListProps) {
  const users = useQuery(api.users.getAllUsers);

  const otherUsers = users?.filter((user) => user._id !== currentUserId);

  return (
    <div className="w-80 border-r bg-muted/10">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Users</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-73px)]">
        {otherUsers?.map((user) => (
          <button
            key={user._id}
            onClick={() => onSelectUser(user._id)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors ${
              selectedUserId === user._id ? "bg-accent" : ""
            }`}
          >
            <Avatar>
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </button>
        ))}
      </ScrollArea>
    </div>
  );
}
