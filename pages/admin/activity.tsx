import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../services/api";

type ActivityLog = {
  id: number;
  userId: number;
  action: string;
  createdAt: string;
};

export default function AdminActivity() {
  const { data, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["activityLogs"],
    queryFn: async () => {
      const res = await api.get("/admin/activity");
      return res.data.logs;
    },
  });

  return (
    <ProtectedRoute role="ADMIN">
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>

        <div className="bg-white p-4 rounded shadow overflow-auto">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">User ID</th>
                  <th className="border px-2 py-1">Action</th>
                  <th className="border px-2 py-1">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((log) => (
                  <tr key={log.id}>
                    <td className="border px-2 py-1">{log.userId}</td>
                    <td className="border px-2 py-1">{log.action}</td>
                    <td className="border px-2 py-1">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
