import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import StudentLayout from "../../../components/layout/StudentLayout";
import api from "../../../services/api";

export default function TeacherProfile() {
  const { teacherId } = useRouter().query;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["teacherProfile", teacherId],
    queryFn: async () => {
      const res = await api.get(`/teachers/public/${teacherId}`);
      return res.data;
    },
    enabled: !!teacherId,
  });

  const reviewsQuery = useQuery({
    queryKey: ["teacherReviews", teacherId],
    queryFn: async () => {
      const res = await api.get(`/teachers/public/${teacherId}/reviews`);
      return res.data?.reviews ?? [];
    },
    enabled: !!teacherId,
  });

  const teacher = (data as any)?.teacher ?? data ?? {};
  const toArray = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value === "string" && value.trim()) return [value];
    return [];
  };
  const courses = toArray(teacher.courses);
  const education = toArray(teacher.education);

  return (
    <ProtectedRoute role="STUDENT">
      <StudentLayout>
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p className="text-red-600">Unable to load teacher profile.</p>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
              <h1 className="text-2xl font-bold mb-2">Courses</h1>
              <p>{courses.length ? courses.join(", ") : "--"}</p>

              <h2 className="mt-4 font-semibold">Education</h2>
              <p>{education.length ? education.join(", ") : "--"}</p>

              <h2 className="mt-4 font-semibold">Average Rating</h2>
              <p>⭐ {teacher.averageRating ?? "--"}</p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-3">Reviews</h2>
              {reviewsQuery.isLoading ? (
                <p>Loading reviews...</p>
              ) : reviewsQuery.isError ? (
                <p className="text-red-600">Unable to load reviews.</p>
              ) : (reviewsQuery.data ?? []).length === 0 ? (
                <p className="text-gray-600">No reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {(reviewsQuery.data ?? []).map((rev: any, idx: number) => (
                    <div key={idx} className="border rounded p-3">
                      <p className="font-semibold">Rating: {rev.rating} ⭐</p>
                      {rev.comment && <p className="text-gray-700">{rev.comment}</p>}
                      <p className="text-xs text-gray-500">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </StudentLayout>
    </ProtectedRoute>
  );
}
