import { auth } from "@/auth";
import { NavbarClient } from "./NavbarClient";

export async function GlobalNavbar() {
  const session = await auth();
  return <NavbarClient session={session} />;
}
