import { redirect } from "next/navigation";
import SidebarLayout from "~/components/layout/SidebarLayout.jsx";
import DashboardPage from "~/features/dashboard/pages/DashboardPage.jsx";
import { verifySession } from "~/lib/session.js";

export default async function Page() {
  const user = await verifySession();
  if (!user) redirect("/login");

  return (
    <SidebarLayout>
      <DashboardPage />
    </SidebarLayout>
  );
}
