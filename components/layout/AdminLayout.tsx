import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { logout } = useAuth();

    const handleSignOut = () => {
        logout();
        router.push("/login");
    };

    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <Link href="/" className="p-6 text-xl font-bold block hover:bg-gray-700">TRMS Admin</Link>
                <nav className="flex-1 flex flex-col space-y-2 px-4">
                    <Link href="/admin/dashboard" className="hover:bg-gray-700 p-2 rounded">Dashboard</Link>
                    <Link href="/admin/teachers" className="hover:bg-gray-700 p-2 rounded">Teachers</Link>
                    <Link href="/admin/students" className="hover:bg-gray-700 p-2 rounded">Students</Link>
                    <Link href="/admin/activity" className="hover:bg-gray-700 p-2 rounded">Activity Logs</Link>
                </nav>
                <div className="p-4">
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                    >
                        Sign out
                    </button>
                </div>
            </aside>

            <main className="flex-1 bg-gray-100 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
}
