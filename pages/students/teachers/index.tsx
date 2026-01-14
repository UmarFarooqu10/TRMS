import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import StudentLayout from "../../../components/layout/StudentLayout";
import api from "../../../services/api";

type Teacher = {
  id: number;
  name?: string;
  education: string;
  courses: string;
  averageRating: number;
};

export default function BrowseTeachers() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<Teacher[]>({
    queryKey: ["teachers", search],
    queryFn: async () => {
      const res = await api.get("/students/teachers", {
        params: { search },
      });
      return res.data.teachers;
    },
  });

  return (
    <ProtectedRoute role="STUDENT">
      <StudentLayout>
        <h1 className="text-2xl font-bold mb-4">Browse Teachers</h1>

        <input
          placeholder="Search by course or education"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 mb-6 w-full rounded"
        />

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {data?.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold">{t.courses}</h2>
                <p className="text-sm text-gray-600">{t.education}</p>
                <p className="mt-2">⭐ {t.averageRating}</p>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/students/teachers/${t.id}`}
                    className="text-blue-600"
                  >
                    View
                  </Link>
                  <Link
                    href={`/students/review/${t.id}`}
                    className="text-green-600"
                  >
                    Rate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </StudentLayout>
    </ProtectedRoute>
  );
}
