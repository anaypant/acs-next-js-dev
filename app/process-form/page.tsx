"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { SearchParamsSuspense } from "../components/SearchParamsSuspense";

// Component that uses useSearchParams - wrapped in Suspense
function ProcessFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    // Get session_id from session (not from URL)
    if (session && (session as any).sessionId) {
    const sessionId = (session as any).sessionId;
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

export default function ProcessForm() {
  return (
    <SearchParamsSuspense>
      <ProcessFormContent />
    </SearchParamsSuspense>
  );
} 