"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { Search, UserX } from "lucide-react";

interface UserListProps {
  currentUserId?: Id<"users">;
  selectedUserId?: Id<"users">;
  onSelectUser: (userId: Id<"users">) => void;
}

export function UserList({ currentUserId, selectedUserId, onSelectUser }: UserListProps) {
  const [search, setSearch] = useState("");
  const users = useQuery(api.users.getAllUsers);

  const otherUsers = users
    ?.filter((user) => user._id !== currentUserId)
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-137px)]">
        {otherUsers?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <UserX className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg mb-2">
              {search ? "No users found" : "No other users yet"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {search ? "Try a different search term" : "Invite others to start chatting"}
            </p>
          </div>
        ) : (
          otherUsers?.map((user) => (
            <button
              key={user._id}
              onClick={() => onSelectUser(user._id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors border-b ${
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
          ))
        )}
      </ScrollArea>
    </>
  );
}
