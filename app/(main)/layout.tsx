"use client";
import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import Navigation from "./_components/navigation";
import ModalProvider from "@/components/providers/modalProvider";
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [tab, setTab] = useState<string>("editor");

  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <Tabs
      defaultValue="editor"
      className="h-full flex dark:bg-[#1F1F1F]"
      onValueChange={(value) => setTab(value)}
    >
      <Navigation />
      <ModalProvider />
      <main
        className={cn(
          "flex-1 h-full overflow-y-hidden",
          tab === "editor" && "overflow-y-auto"
        )}
      >
        {children}
      </main>
    </Tabs>
  );
};

export default MainLayout;
