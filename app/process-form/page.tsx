"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProcessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    // Get session_id from session (not from URL)
    if (session && session.sessionId) {
    const sessionId = session.sessionId;
    const authType = searchParams.get("authType");

    if (sessionId) {
      document.cookie = `session_id=${sessionId}; path=/; SameSite=Lax`;
    }

    if (authType === "new") {
      router.replace("/new-user");
    } else {
      router.replace("/dashboard");
    }
  }
  }, [router, searchParams, session, status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Processing your login...</h2>
    </div>
  );
} 