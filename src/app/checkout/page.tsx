import { CheckoutClient } from "./CheckoutClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserAddress } from "./actions";

export default async function CheckoutPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const savedAddress = await getUserAddress();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-sans">
      <CheckoutClient savedAddress={savedAddress} userId={(session.user as any).id} />
    </div>
  );
}
