"use client";
import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArrowLeftRight, LogOut, User2 } from "lucide-react";
import Link from "next/link";

export default function UserDropdown() {
  const { user, logout } = useAuth();

  async function onLogout() {
    await logout();
    window.location.reload();
  }

  if (user?.email) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon-sm"} variant={"secondary"} className="size-7">
            <User2 className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64 p-2" align="end">
          <DropdownMenuLabel className="flex min-w-0 flex-col py-0 px-1 mb-2">
            <span className="truncate text-sm font-medium text-foreground mb-0.5">
              {user?.user_metadata.name}
            </span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {user?.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuItem className="gap-3 px-1 relative">
            <User2
              size={20}
              className="text-muted-foreground/70"
              aria-hidden="true"
            />
            <span>Profile</span>
            <Link href="/account" className="absolute inset-0" />
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-3 px-1">
            <ArrowLeftRight
              size={20}
              className="text-muted-foreground/70"
              aria-hidden="true"
            />
            <span>Transactions</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-3 px-1" onClick={onLogout}>
            <LogOut
              size={20}
              className="text-muted-foreground/70"
              aria-hidden="true"
            />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <Button
        size={"icon-sm"}
        variant={"secondary"}
        className="size-7 relative"
      >
        <User2 className="size-4" />
        <Link href="/auth/login" className="absolute inset-0" />
      </Button>
    );
  }
}
