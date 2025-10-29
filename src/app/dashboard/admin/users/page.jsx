"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaTrash, FaBan } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (userId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be blocked!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/users/block/${userId}`, {
        method: "PATCH",
      });
      if (res.ok) {
        Swal.fire("Done!", "User has been done you wanted.", "success");
        fetchUsers();
      } else {
        Swal.fire("Error!", "Failed to block user.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleDelete = async (userId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        Swal.fire("Deleted!", "User has been deleted.", "success");
        fetchUsers();
      } else {
        Swal.fire("Error!", "Failed to delete user.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5">Manage Users</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse min-w-[600px]">
            <thead className="">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Verified</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.emailVerified ? "Yes" : "No"}</td>
                  <td className="p-3">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <Button
                      onClick={() => handleBlock(user._id)}
                      className={`${
                        user.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      } text-white`}
                      title={user.isBlocked ? "Unblock User" : "Block User"}
                    >
                      <FaBan />
                      <span className="ml-2 hidden md:inline">
                        {user.isBlocked ? "Unblock" : "Block"}
                      </span>
                    </Button>

                    <Button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      title="Delete User"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
