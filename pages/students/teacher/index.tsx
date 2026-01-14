import { useEffect } from "react";
import { useRouter } from "next/router";

export default function StudentsTeacherRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/students/dashboard");
  }, [router]);

  return null;
}
