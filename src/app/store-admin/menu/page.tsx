import { getCategories, getMenuItems } from "../actions";
import { MenuClient } from "./MenuClient";

export default async function MenuManagementPage() {
  const categories = await getCategories();
  const items = await getMenuItems();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
        <p className="text-muted-foreground">
          Manage your menu categories and items.
        </p>
      </div>

      <MenuClient initialCategories={categories} initialItems={items} />
    </div>
  );
}
