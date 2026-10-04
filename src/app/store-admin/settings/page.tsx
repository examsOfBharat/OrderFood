import { getStoreProfile } from "../actions";
import { StoreProfileForm } from "../StoreProfileForm";

export default async function StoreAdminPage() {
  const store = await getStoreProfile();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Profile</h1>
        <p className="text-muted-foreground">
          Manage your store's information, working hours, and delivery settings.
        </p>
      </div>

      <StoreProfileForm initialData={store} />
    </div>
  );
}
