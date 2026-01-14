import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import TeacherLayout from "../../components/layout/TeacherLayout";
import api from "../../services/api";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function TeacherReviews() {
  const { data, isLoading } = useQuery<Review[]>({
    queryKey: ["teacherReviews"],
    queryFn: async () => {
      const res = await api.get("/teachers/reviews");
      return res.data.reviews;
    },
  });

  return (
    <ProtectedRoute role="TEACHER">
      <TeacherLayout>
        <h1 className="text-2xl font-bold mb-4">Student Reviews</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {data?.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded shadow">
                <p className="font-semibold">Rating: {review.rating} ⭐</p>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </TeacherLayout>
    </ProtectedRoute>
  );
}
