import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const user = await login(data.email, data.password);
      alert("Login successful!");

      if (user.role === "ADMIN") router.push("/admin/dashboard");
      if (user.role === "TEACHER") router.push("/teacher/dashboard");
      if (user.role === "STUDENT") router.push("/students/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <label className="block mb-2">Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full border p-2 mb-4 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <label className="block mb-2">Password</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="w-full border p-2 mb-4 rounded"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to home
          </Link>
        </div>
      </form>
    </div>
  );
}
