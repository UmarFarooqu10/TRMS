import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import TeacherLayout from "../../components/layout/TeacherLayout";
import api from "../../services/api";

type ProfileForm = {
  name: string;
  experienceYears?: number;
  education: { value: string }[];
  courses: { value: string }[];
  department: { value: string }[];
};

export default function TeacherProfile() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, control } = useForm<ProfileForm>({
    defaultValues: {
      name: "",
      experienceYears: undefined,
      education: [{ value: "" }],
      courses: [{ value: "" }],
      department: [{ value: "" }],
    },
  });

  const educationFields = useFieldArray({ control, name: "education" });
  const courseFields = useFieldArray({ control, name: "courses" });
  const departmentFields = useFieldArray({ control, name: "department" });

  const profileQuery = useQuery({
    queryKey: ["teacherProfile"],
    queryFn: async () => {
      const res = await api.get("/teachers/profile");
      const profile = res.data?.profile || {};
      reset({
        name: profile.name || "",
        experienceYears: profile.experienceYears ?? undefined,
        education: (profile.education || [""].filter(Boolean)).map((v: string) => ({ value: v })) || [{ value: "" }],
        courses: (profile.courses || [""].filter(Boolean)).map((v: string) => ({ value: v })) || [{ value: "" }],
        department: (profile.department || [""].filter(Boolean)).map((v: string) => ({ value: v })) || [{ value: "" }],
      });
      return profile;
    },
    retry: false,
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const payload = {
        name: data.name,
        experienceYears: data.experienceYears ?? null,
        education: data.education.map((e) => e.value).filter((v) => v?.trim()),
        courses: data.courses.map((c) => c.value).filter((v) => v?.trim()),
        department: data.department.map((d) => d.value).filter((v) => v?.trim()),
      };
      return api.put("/teachers/profile", payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacherProfile"] }),
  });

  return (
    <ProtectedRoute role="TEACHER">
      <TeacherLayout>
        <h1 className="text-2xl font-bold mb-4">Update Profile</h1>

        <form
          onSubmit={handleSubmit((data) => updateProfile.mutate(data))}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <div>
            <label className="block font-semibold">Name</label>
            <input
              {...register("name")}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Experience (years)</label>
            <input
              type="number"
              min={0}
              {...register("experienceYears", { valueAsNumber: true })}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Education</label>
            <div className="space-y-2">
              {educationFields.fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`education.${idx}.value` as const)}
                    className="border p-2 w-full rounded"
                  />
                  {educationFields.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => educationFields.remove(idx)}
                      className="px-3 py-2 bg-gray-200 rounded"
                    >
                      –
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => educationFields.insert(idx + 1, { value: "" })}
                    className="px-3 py-2 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold">Courses Taught</label>
            <div className="space-y-2">
              {courseFields.fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`courses.${idx}.value` as const)}
                    className="border p-2 w-full rounded"
                  />
                  {courseFields.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => courseFields.remove(idx)}
                      className="px-3 py-2 bg-gray-200 rounded"
                    >
                      –
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => courseFields.insert(idx + 1, { value: "" })}
                    className="px-3 py-2 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold">Department</label>
            <div className="space-y-2">
              {departmentFields.fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`department.${idx}.value` as const)}
                    className="border p-2 w-full rounded"
                  />
                  {departmentFields.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => departmentFields.remove(idx)}
                      className="px-3 py-2 bg-gray-200 rounded"
                    >
                      –
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => departmentFields.insert(idx + 1, { value: "" })}
                    className="px-3 py-2 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </button>
          {profileQuery.isLoading && <p className="text-sm text-gray-500">Loading profile...</p>}
          {updateProfile.isSuccess && <p className="text-sm text-green-600">Profile updated.</p>}
        </form>
      </TeacherLayout>
    </ProtectedRoute>
  );
}
