import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  if (!session) return redirect("/login");
  return <div>Protected Content</div>;
}
