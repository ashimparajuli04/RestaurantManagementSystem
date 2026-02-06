"use client";

import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {Plus} from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading user info...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="w-full h-screen">
      <div className="w-full bg-nj-cream flex justify-end">
        <Button className="flex items-center justify-center my-5 mr-5">
          <Plus className="" />
          Create Order
        </Button>
      </div>
    </div>
  );
}
