import { useQuery } from "@tanstack/react-query";
import AdminLayout from "../../components/layout/AdminLayout";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import api from "../../services/api";

export default function AdminHome() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "dashboard", "counts"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      const users = res.data.users ?? [];
      const students = users.filter((u: any) => u.role === "STUDENT").length;
      const teachers = users.filter((u: any) => u.role === "TEACHER").length;
      return {
        students,
        teachers,
        reviews: 0, // placeholder until reviews endpoint exists
      };
    },
  });

  const stats = data ?? { students: 0, teachers: 0, reviews: 0 };

  return (
    <ProtectedRoute role="ADMIN">
      <AdminLayout>
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            Total Students: {isLoading ? "Loading..." : isError ? "Error" : stats.students}
          </div>
          <div className="bg-white p-4 rounded shadow">
            Total Teachers: {isLoading ? "Loading..." : isError ? "Error" : stats.teachers}
          </div>
          <div className="bg-white p-4 rounded shadow">
            Total Reviews: {isLoading ? "Loading..." : isError ? "Error" : stats.reviews}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
