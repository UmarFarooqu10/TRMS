import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import StudentLayout from "../../components/layout/StudentLayout";
import api from "../../services/api";

type Teacher = {
  id: number;
  name?: string;
  courses: string | string[];
  averageRating: number;
};

type ReviewForm = {
  rating: number;
  comment: string;
};

type StudentReview = {
  id: number;
  teacherId: number;
  teacherName?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function StudentsDashboard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReviewForm>({
    defaultValues: { rating: 5, comment: "" },
  });

  const ratingValue = watch("rating", 5);

  const setSelection = (
    teacherId: number,
    teacherName?: string,
    mode: "create" | "edit" = "create",
    defaults?: ReviewForm
  ) => {
    setSelectedTeacherId(teacherId);
    setSelectedTeacherName(teacherName || "");
    setIsEditing(mode === "edit");
    reset({
      rating: defaults?.rating ?? 5,
      comment: defaults?.comment ?? "",
    });
  };

  const teachersQuery = useQuery<Teacher[]>({
    queryKey: ["teachers", search],
    queryFn: async () => {
      const res = await api.get("/teachers", { params: { page: 1, limit: 6 } });
      const teachers: Teacher[] = res.data.teachers ?? res.data ?? [];

      const normalizeCourses = (courses: string | string[] | undefined) => {
        if (Array.isArray(courses)) return courses;
        if (typeof courses === "string" && courses.trim()) return [courses];
        return [];
      };

      const normalized = teachers.map((t) => ({
        ...t,
        courses: normalizeCourses(t.courses),
      }));

      if (!search.trim()) return normalized.slice(0, 6);
      const term = search.toLowerCase();
      return normalized
        .filter((t) => {
          const nameHit = (t.name || "").toLowerCase().includes(term);
          const courseHit = (t.courses as string[]).some((c) => c.toLowerCase().includes(term));
          return nameHit || courseHit;
        })
        .slice(0, 6);
    },
  });

  const myReviewsQuery = useQuery<StudentReview[]>({
    queryKey: ["myReviews"],
    queryFn: async () => {
      const res = await api.get("/students/reviews");
      return res.data.reviews ?? [];
    },
  });

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: ["teachers"] });
    queryClient.invalidateQueries({ queryKey: ["myReviews"] });
  };

  const reviewMutation = useMutation({
    mutationFn: async (payload: ReviewForm & { teacherId: number }) => {
      return api.post(`/students/review/${payload.teacherId}`, {
        rating: payload.rating,
        comment: payload.comment,
      });
    },
    onSuccess: () => {
      reset();
      setSelectedTeacherId(null);
      setSelectedTeacherName("");
      setIsEditing(false);
      invalidateLists();
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async (payload: ReviewForm & { teacherId: number }) => {
      return api.patch(`/students/review/${payload.teacherId}`, {
        rating: payload.rating,
        comment: payload.comment,
      });
    },
    onSuccess: () => {
      reset();
      setSelectedTeacherId(null);
      setSelectedTeacherName("");
      setIsEditing(false);
      invalidateLists();
    },
  });

  const submitReview = (data: ReviewForm) => {
    if (!selectedTeacherId) return;
    const payload = { teacherId: selectedTeacherId, ...data };
    if (isEditing) {
      updateReviewMutation.mutate(payload);
    } else {
      reviewMutation.mutate(payload);
    }
  };

  const StarPicker = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="text-2xl leading-none focus:outline-none"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <span className={star <= value ? "text-yellow-500" : "text-gray-300"}>
            {star <= value ? "★" : "☆"}
          </span>
        </button>
      ))}
    </div>
  );

  const StarLine = ({ value }: { value: number }) => (
    <div className="flex items-center gap-1 text-yellow-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>{star <= value ? "★" : "☆"}</span>
      ))}
    </div>
  );

  return (
    <ProtectedRoute role="STUDENT">
      <StudentLayout>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-gray-600">
              Search teachers, view their profiles, submit reviews, or jump back into your coursework.
            </p>
          </div>

          <section className="bg-white p-6 rounded shadow space-y-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Search Teachers</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by course or education"
                className="border p-3 rounded"
              />
            </div>

            {teachersQuery.isLoading && <p>Loading teachers...</p>}
            {teachersQuery.isError && (
              <p className="text-red-600">Unable to load teachers. Please try again.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {teachersQuery.data?.map((teacher) => (
                <div key={teacher.id} className="border rounded p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-lg">{teacher.name || `Teacher #${teacher.id}`}</p>
                      <p className="text-sm text-gray-600">
                        {(Array.isArray(teacher.courses) ? teacher.courses : []).join(", ") || "Courses not set"}
                      </p>
                    </div>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      ⭐ {teacher.averageRating ?? 0}
                    </span>
                  </div>

                  <div className="flex gap-3 text-sm">
                    <Link className="text-blue-700" href={`/students/teachers/${teacher.id}`}>
                      View profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        const existing = myReviewsQuery.data?.find((r) => r.teacherId === teacher.id);
                        if (existing) {
                          setSelection(teacher.id, teacher.name, "edit", {
                            rating: existing.rating,
                            comment: existing.comment || "",
                          });
                        } else {
                          setSelection(teacher.id, teacher.name, "create");
                        }
                      }}
                      className="text-green-700 hover:underline"
                    >
                      {myReviewsQuery.data?.some((r) => r.teacherId === teacher.id) ? "Edit review" : "Write review"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Your Reviews</h2>
                <p className="text-sm text-gray-600">See and edit what you have already shared.</p>
              </div>
              {myReviewsQuery.isLoading && <span className="text-sm text-gray-500">Loading...</span>}
            </div>

            {myReviewsQuery.isError && (
              <p className="text-red-600 text-sm">Could not load your reviews right now.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {myReviewsQuery.data?.map((review) => (
                <div key={review.id} className="border rounded p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-lg">{review.teacherName || `Teacher #${review.teacherId}`}</p>
                      <p className="text-xs text-gray-500">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <StarLine value={review.rating} />
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-700 whitespace-pre-line">{review.comment}</p>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Link className="text-blue-700" href={`/students/teachers/${review.teacherId}`}>
                      View profile
                    </Link>
                    <button
                      type="button"
                      className="text-green-700 hover:underline"
                      onClick={() =>
                        setSelection(review.teacherId, review.teacherName || undefined, "edit", {
                          rating: review.rating,
                          comment: review.comment || "",
                        })
                      }
                    >
                      Edit review
                    </button>
                  </div>
                </div>
              ))}

              {myReviewsQuery.data && myReviewsQuery.data.length === 0 && (
                <p className="text-sm text-gray-600">You have not posted any reviews yet.</p>
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{isEditing ? "Edit your review" : "Review a teacher"}</h2>
                <p className="text-sm text-gray-600">
                  {isEditing
                    ? "Update your rating and comment for this teacher."
                    : "Select a teacher above, then submit your rating and feedback."}
                </p>
              </div>
              {selectedTeacherId ? (
                <span className="text-sm text-green-700 font-semibold">
                  {selectedTeacherName || `Teacher #${selectedTeacherId}`}
                </span>
              ) : (
                <span className="text-sm text-gray-500">No teacher selected</span>
              )}
            </div>

            <form onSubmit={handleSubmit(submitReview)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">Rating</label>
                  <div className="flex items-center gap-3">
                    <StarPicker
                      value={Number(ratingValue) || 0}
                      onChange={(val) => setValue("rating", val, { shouldValidate: true })}
                    />
                    <input
                      type="hidden"
                      {...register("rating", {
                        required: "Rating is required",
                        min: 1,
                        max: 5,
                        valueAsNumber: true,
                      })}
                      value={ratingValue}
                      readOnly
                    />
                    <span className="text-sm text-gray-600">{ratingValue || 0} / 5</span>
                  </div>
                  {errors.rating && (
                    <p className="text-red-600 text-sm">{errors.rating.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold">Comment</label>
                  <textarea
                    {...register("comment", { maxLength: { value: 500, message: "Keep it under 500 characters" } })}
                    className="border p-3 rounded w-full min-h-[96px]"
                    placeholder="What stood out about this teacher?"
                  />
                  {errors.comment && (
                    <p className="text-red-600 text-sm">{errors.comment.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!selectedTeacherId || reviewMutation.isLoading || updateReviewMutation.isLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
                >
                  {reviewMutation.isLoading || updateReviewMutation.isLoading
                    ? "Saving..."
                    : isEditing
                      ? "Save changes"
                      : "Submit review"}
                </button>
                {!selectedTeacherId && (
                  <span className="text-sm text-gray-600">Pick a teacher first.</span>
                )}
                {(reviewMutation.isSuccess || updateReviewMutation.isSuccess) && (
                  <span className="text-sm text-green-700">Saved!</span>
                )}
                {(reviewMutation.isError || updateReviewMutation.isError) && (
                  <span className="text-sm text-red-700">Could not save review. Try again.</span>
                )}
              </div>
            </form>
          </section>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}
