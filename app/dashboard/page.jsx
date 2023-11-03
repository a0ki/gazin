import { getServerSession } from "next-auth";
import Dashboard from "../components/dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession();
    if (!session && !session.data)
        return redirect('/');

    return <Dashboard />;
}