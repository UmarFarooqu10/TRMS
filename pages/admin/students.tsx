import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../services/api";

type Student = {
  id: number;
  email: string;
  status: string;
  createdAt: string;
};

export default function AdminStudents() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch students
  const { data, isLoading } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return res.data.users.filter((u: any) => u.role === "STUDENT");
    },
  });

  // Add student
  const addStudent = useMutation({
    mutationFn: async () => api.post("/admin/students", { email, password }),
    onSuccess: () => {
      setErrorMessage(null);
      setEmail("");
      setPassword("");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to add student";
      setErrorMessage(message);
    },
  });

  // Deactivate student
  const deactivateStudent = useMutation({
    mutationFn: async (id: number) => api.patch(`/admin/users/${id}/deactivate`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students"] }),
  });

  const formValid = email.trim().length > 0 && password.trim().length >= 8;

  return (
    <ProtectedRoute role="ADMIN">
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-4">Manage Students</h1>

        {/* Add Student */}
        <div className="mb-6 p-4 bg-white rounded shadow space-y-2">
          <h2 className="font-semibold">Add Student</h2>
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={() => addStudent.mutate()}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={!formValid || addStudent.isPending}
          >
            {addStudent.isPending ? "Adding..." : "Add Student"}
          </button>
        </div>

        {/* Students Table */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Students List</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((s) => (
                  <tr key={s.id}>
                    <td className="border px-2 py-1">{s.id}</td>
                    <td className="border px-2 py-1">{s.email}</td>
                    <td className="border px-2 py-1">{s.status}</td>
                    <td className="border px-2 py-1">
                      {s.status === "ACTIVE" && (
                        <button
                          onClick={() => deactivateStudent.mutate(s.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
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
