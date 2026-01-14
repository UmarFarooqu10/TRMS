import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import TeacherLayout from "../../components/layout/TeacherLayout";
import api from "../../services/api";
import Link from "next/link";

type TeacherStats = {
  averageRating: number;
  totalReviews: number;
  uniqueStudents: number;
};

type TeacherProfile = {
  name?: string;
  education?: string[];
  courses?: string[];
  department?: string[];
  experienceYears?: number | null;
};

export default function TeacherDashboard() {
  const { data, isLoading } = useQuery<TeacherStats>({
    queryKey: ["teacherStats"],
    queryFn: async () => {
      const res = await api.get("/teachers/dashboard");
      const analytics = res.data?.data?.analytics ?? {};
      return {
        averageRating: analytics.avgRating ?? 0,
        totalReviews: analytics.totalReviews ?? 0,
        uniqueStudents: analytics.uniqueStudents ?? 0,
      };
    },
  });

  const profileQuery = useQuery<TeacherProfile>({
    queryKey: ["teacherProfile"],
    queryFn: async () => {
      const res = await api.get("/teachers/profile");
      return res.data?.profile ?? {};
    },
  });

  const toArray = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value === "string" && value.trim()) return [value];
    return [];
  };

  const profile = profileQuery.data || {};
  const educationList = toArray(profile.education);
  const coursesList = toArray(profile.courses);
  const departmentList = toArray(profile.department);

  return (
    <ProtectedRoute role="TEACHER">
      <TeacherLayout>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-gray-500">Average Rating</h3>
              <p className="text-3xl font-bold">{data?.averageRating ?? 0}</p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-gray-500">Total Reviews</h3>
              <p className="text-3xl font-bold">{data?.totalReviews ?? 0}</p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-gray-500">Student Impact</h3>
              <p className="text-3xl font-bold">{data?.uniqueStudents ?? 0}</p>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Profile</h2>
              <Link href="/teacher/profile" className="text-indigo-600 hover:underline text-sm">
                Edit profile
              </Link>
            </div>
            {profileQuery.isLoading ? (
              <p>Loading profile...</p>
            ) : (
              <div className="space-y-2">
                <p><span className="text-gray-500">Name:</span> {profile.name || "--"}</p>
                <p><span className="text-gray-500">Experience:</span> {profile.experienceYears ?? "--"} years</p>
                <p>
                  <span className="text-gray-500">Education:</span> {educationList.length ? educationList.join(", ") : "--"}
                </p>
                <p>
                  <span className="text-gray-500">Courses:</span> {coursesList.length ? coursesList.join(", ") : "--"}
                </p>
                <p>
                  <span className="text-gray-500">Department:</span> {departmentList.length ? departmentList.join(", ") : "--"}
                </p>
              </div>
            )}
          </div>
        </div>
      </TeacherLayout>
    </ProtectedRoute>
  );
}
