import { ReactNode } from "react";
import Link from "next/link";
import { Store, UtensilsCrossed, Settings, LogOut, Package } from "lucide-react";

export default function StoreAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/store-admin" className="flex items-center gap-2 font-semibold">
            <Store className="h-6 w-6 text-primary" />
            <span>Store Dashboard</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            <Link
              href="/store-admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <Settings className="h-4 w-4" />
              Store Profile
            </Link>
            <Link
              href="/store-admin/menu"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Menu Management
            </Link>
            <Link
              href="/store-admin/orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <Package className="h-4 w-4" />
              Orders (Phase 4)
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-destructive hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex w-full flex-col sm:pl-64">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
