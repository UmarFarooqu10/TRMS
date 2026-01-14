import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-800 text-white flex flex-col">
        <Link href="/" className="p-6 text-xl font-bold block hover:bg-indigo-700">TRMS</Link>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/teacher/dashboard" className="block p-2 rounded hover:bg-indigo-700">
            Dashboard
          </Link>
          <Link href="/teacher/profile" className="block p-2 rounded hover:bg-indigo-700">
            Profile
          </Link>
          <Link href="/teacher/reviews" className="block p-2 rounded hover:bg-indigo-700">
            Reviews
          </Link>
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

      {/* Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
