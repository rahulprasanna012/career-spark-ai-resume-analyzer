
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
