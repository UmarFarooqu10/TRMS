import { useEffect } from "react";
import { useRouter } from "next/router";

export default function StudentsReviewsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/students/dashboard");
  }, [router]);

  return null;
}
