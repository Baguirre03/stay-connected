import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { isAuthenticated } = await getServerSession();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Social App
          </h1>
          <p className="text-xl text-gray-600">Connect with friends</p>
        </div>

        <div className="flex flex-col space-y-4">
          <Link
            href="/login"
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="py-2 px-4 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-md shadow border border-gray-300"
          >
            Create an account
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          A social networking app built with Next.js and NestJS
        </p>
      </div>
    </main>
  );
}
