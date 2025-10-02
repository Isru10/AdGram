
import { type User, columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { headers } from "next/headers"; // Import headers for server-side fetch

// This Server Component will fetch the data for our table.
async function getUsers(): Promise<User[]> {
  try {
    // We must forward the headers (containing the session cookie)
    // to our internal API route to stay authenticated.
    const headerList = await headers();
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/users`, {
      headers: new Headers(headerList),
      cache: 'no-store', // Ensure data is always fresh
    });

    if (!res.ok) {
      // If the API returns an error (e.g., 403 Forbidden), we'll log it.
      console.error("Failed to fetch users:", await res.text());
      return []; // Return an empty array to prevent the page from crashing.
    }

    return res.json();
  } catch (error) {
    console.error("An error occurred while fetching users:", error);
    return [];
  }
}

export default async function ManageUsersPage() {
  const data = await getUsers();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
        <p className="text-foreground">
          A list of all the users in your marketplace.
        </p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}