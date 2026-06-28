import { redirect } from "next/navigation";
import SidebarLayout from "~/components/layout/SidebarLayout.jsx";
import QuizPage from "~/features/quiz/pages/QuizPage.jsx";
import { verifySession } from "~/lib/session.js";

export default async function Page() {
  const user = await verifySession();
  if (!user) redirect("/login");

  return (
    <SidebarLayout>
      <QuizPage />
    </SidebarLayout>
  );
}
