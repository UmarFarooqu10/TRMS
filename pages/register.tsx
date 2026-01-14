import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { authService } from "../services/auth.service";

type RegisterFormInputs = {
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await authService.registerStudent(data);
      alert("Registration successful! Please login.");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Student Registration</h2>

        <label className="block mb-2">Email (Edu Account)</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full border p-2 mb-4 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <label className="block mb-2">Password</label>
        <input
          type="password"
          {...register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" } })}
          className="w-full border p-2 mb-4 rounded"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Register
        </button>

        <div className="mt-4 text-center">
          <Link href="/" className="text-green-700 hover:underline">
            Back to home
          </Link>
        </div>
      </form>
    </div>
  );
}
