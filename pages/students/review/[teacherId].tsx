import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import StudentLayout from "../../../components/layout/StudentLayout";
import api from "../../../services/api";

type ReviewForm = {
  rating: number;
  comment: string;
};

export default function SubmitReview() {
  const { teacherId } = useRouter().query;
  const { register, handleSubmit } = useForm<ReviewForm>();

  const submitReview = useMutation({
    mutationFn: async (data: ReviewForm) =>
      api.post(`/students/review/${teacherId}`, data),
  });

  return (
    <ProtectedRoute role="STUDENT">
      <StudentLayout>
        <h1 className="text-2xl font-bold mb-4">Submit Review</h1>

        <form
          onSubmit={handleSubmit((data) => submitReview.mutate(data))}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <div>
            <label className="block font-semibold">Rating (1–5)</label>
            <input
              type="number"
              min={1}
              max={5}
              {...register("rating", { required: true })}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Comment</label>
            <textarea
              {...register("comment")}
              className="border p-2 w-full rounded"
            />
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Submit Review
          </button>
        </form>
      </StudentLayout>
    </ProtectedRoute>
  );
}
