"use client";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/session";

interface LogoutButtonProps {
  onClick: () => void;
}

export const LogoutButton = ({ onClick }: LogoutButtonProps) => {
  return (
    <Button
      onClick={() => {
        logout();
        onClick();
      }}
      variant="destructive"
      className="text-sm"
    >
      Déconnexion
    </Button>
  );
};
