import { ReactNode } from "react";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserInitials } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isAuthenticated } = await getServerSession();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold">Social App</h1>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {user && getUserInitials(user.name, user.username)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Dashboard
            </Link>
            <Link
              href="/friends"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Friends
            </Link>
            <Link
              href="/friends/requests"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Friend Requests
            </Link>
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Profile
            </Link>

            <hr className="my-4" />

            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </form>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
