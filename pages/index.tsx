import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user, isReady } = useAuth();
  const dashboardLink = user?.role === "ADMIN"
    ? "/admin/dashboard"
    : user?.role === "TEACHER"
    ? "/teacher/dashboard"
    : user?.role === "STUDENT"
    ? "/students/dashboard"
    : null;

  const primaryCtaHref = dashboardLink || "/login";
  const secondaryCtaHref = dashboardLink || "/register";

  return (
    <main className="bg-white text-neutral-900">
      {/* ===================== NAV ===================== */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">
            TRMS
          </div>

          <nav className="flex items-center gap-8 text-sm">
            {isReady && dashboardLink ? (
              <Link
                href={dashboardLink}
                className="px-5 py-2.5 border border-neutral-900 rounded-lg hover:bg-neutral-900 hover:text-white transition"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hover:opacity-70 transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 border border-neutral-900 rounded-lg hover:bg-neutral-900 hover:text-white transition"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden">
        {/* subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] border border-neutral-200 rounded-full" />
          <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] border border-neutral-200 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-8 pt-32 pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Left */}
            <div className="lg:col-span-7">
              <h1 className="text-6xl leading-[1.05] font-semibold tracking-tight">
                Redefining how
                <br />
                <span className="font-light">
                  teaching quality
                </span>
                <br />
                is measured.
              </h1>

              <p className="mt-10 text-lg text-neutral-600 max-w-xl leading-relaxed">
                TRMS is a next-generation teacher rating system built for
                transparency, accountability, and continuous academic
                improvement — trusted by students, teachers, and institutions.
              </p>

              <div className="mt-14 flex gap-5">
                <Link
                  href={primaryCtaHref}
                  className="bg-neutral-900 text-white px-8 py-4 rounded-xl text-sm font-medium hover:opacity-90 transition"
                >
                  {dashboardLink ? "Go to dashboard" : "Access Platform"}
                </Link>

                {!dashboardLink && (
                  <Link
                    href={secondaryCtaHref}
                    className="px-8 py-4 border border-neutral-900 rounded-xl text-sm font-medium hover:bg-neutral-900 hover:text-white transition"
                  >
                    Join as Student
                  </Link>
                )}
              </div>
            </div>

            {/* Right - Metrics */}
            <div className="lg:col-span-5">
              <div className="space-y-6">
                <MetricCard label="Average Rating" value="4.6 / 5" />
                <MetricCard label="Verified Reviews" value="12,480+" />
                <MetricCard label="Student Impact" value="3,200+" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== VALUE GRID ===================== */}
      <section className="border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-8 py-32">
          <h2 className="text-4xl font-semibold tracking-tight max-w-3xl">
            Designed to balance student voice,
            <br />
            teacher growth, and administrative control.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
            <ValueCard
              title="Anonymous & Honest Feedback"
              description="Students can review teachers without bias or exposure, ensuring authentic evaluations."
            />
            <ValueCard
              title="Teacher Growth Analytics"
              description="Teachers access deep insights, trends, and averages without seeing student identities."
            />
            <ValueCard
              title="Administrative Oversight"
              description="Admins maintain system integrity with complete control over users and activities."
            />
          </div>
        </div>
      </section>

      {/* ===================== ROLES ===================== */}
      <section className="bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-8 py-32">
          <h2 className="text-4xl font-semibold tracking-tight">
            Built for every role in education.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            <RoleCard
              role="Students"
              description="Search teachers, submit reviews, and contribute to educational transparency."
              link={dashboardLink || "/register"}
            />
            <RoleCard
              role="Teachers"
              description="Track ratings, understand feedback, and improve teaching effectiveness."
              link={dashboardLink || "/login"}
            />
            <RoleCard
              role="Administrators"
              description="Manage users, oversee activity, and ensure platform reliability."
              link={dashboardLink || "/login"}
            />
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-8 py-10 flex justify-between text-sm text-neutral-500">
          <span>© {new Date().getFullYear()} TRMS</span>
          <span>Modern education infrastructure</span>
        </div>
      </footer>
    </main>
  );
}

/* ===================== COMPONENTS ===================== */

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-neutral-200 rounded-2xl p-8">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-4xl font-semibold">{value}</p>
    </div>
  );
}

function ValueCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-neutral-200 rounded-2xl p-10 hover:shadow-sm transition">
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function RoleCard({
  role,
  description,
  link,
}: {
  role: string;
  description: string;
  link: string;
}) {
  return (
    <div className="border border-neutral-200 rounded-2xl p-10 flex flex-col justify-between hover:shadow-sm transition">
      <div>
        <h3 className="text-2xl font-medium">{role}</h3>
        <p className="mt-4 text-neutral-600">{description}</p>
      </div>

      <Link
        href={link}
        className="mt-10 text-sm font-medium underline hover:opacity-70"
      >
        Continue →
      </Link>
    </div>
  );
}
