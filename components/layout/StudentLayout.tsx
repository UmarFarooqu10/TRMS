import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";

export default function StudentLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="bg-blue-700 text-white p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">
            TRMS
          </Link>
          <div className="space-x-4">
            <Link href="/students/dashboard">Dashboard</Link>
            <Link href="/students/teachers">Teachers</Link>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </nav>

      {/* Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
