"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { Search } from "lucide-react";

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
    <div className="w-80 border-r bg-muted/10">
      <div className="p-4 border-b space-y-3">
        <h2 className="font-semibold text-lg">Users</h2>
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
