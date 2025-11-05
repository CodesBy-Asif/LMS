"use client";
import React, { useState, useEffect, useMemo } from "react";
import {

  FaTrash,
  FaSortUp,
  FaSortDown,
  FaSearch,
} from "react-icons/fa";
import { useDeleteUserMutation, useGetallUserMutation } from "@/redux/features/user/userApi";
import { HiMail } from "react-icons/hi";
import { AiTwotoneReconciliation } from "react-icons/ai";
import toast from "react-hot-toast";
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  PurchasedCourses: number;
}

type SortKey = keyof User;

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [GetAllUsers, { isLoading, isSuccess, isError, data }] =
    useGetallUserMutation();

    const [DeleteUser, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, data: dataDelete }] =
    useDeleteUserMutation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: any = await GetAllUsers({});
        if (response?.data?.success && Array.isArray(response.data.users)) {
          const formattedUsers: User[] = response.data.users.map(
            (user: any) => ({
              id: user._id,
              name: user.name || "No Name",
              email: user.email || "N/A",
              role: user.role || "User",
              PurchasedCourses: user.courses.length || 0,
            })
          );
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [GetAllUsers]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) setSelectedIds([]);
    else setSelectedIds(filteredUsers.map((u) => u.id));
    setSelectAll(!selectAll);
  };

  const handleDelete = async(id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    await DeleteUser({userId:id});
  };

  const handleDeleteSelected = async() => {
    setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
    setSelectedIds([]);
    setSelectAll(false);
    await Promise.all(selectedIds.map((id) => DeleteUser({userId:id})));
  };
  useEffect(() => {
    if (isSuccessDelete) {
      toast.success("User Deleted Successfully");
    }
    if (isErrorDelete) {
      toast.error("Error deleting user");
    }
  }, [isSuccessDelete, isErrorDelete]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        } else {
          return sortOrder === "asc"
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        }
      });
  }, [users, search, sortKey, sortOrder]);

  return (
    <div className="p-6 bg-background text-foreground rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-xl font-semibold">All Users</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-primary-dark transition"
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="accent-primary"
                />
              </th>
              {["id", "name", "email", "role", "Courses Purchased"].map((key) => (
                <th
                  key={key}
                  className="p-3 font-medium cursor-pointer select-none"
                  onClick={() => handleSort(key as SortKey)}
                >
                  <div className="flex items-center gap-2">
                    {key === "id"
                      ? "ID"
                      : key === "name"
                      ? "Name"
                      : key === "email"
                      ? "Email"
                      : key === "role"
                      ? "Role"
                      : "Courses Purchased"}
                    {sortKey === key &&
                      (sortOrder === "asc" ? (
                        <FaSortUp size={14} />
                      ) : (
                        <FaSortDown size={14} />
                      ))}
                  </div>
                </th>
              ))}
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className={`border-t border-border hover:bg-primary/10 transition ${
                  selectedIds.includes(user.id) ? "bg-primary/10" : ""
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="accent-primary"
                  />
                </td>
                <td className="p-3" title={user.id.toString()}>
                  {user.id.toString().slice(0, 8) + "..."}
                </td>
                <td className="p-3 font-medium" title={user.name}>
                  {user.name.slice(0, 20)}
                </td>
                <td className="p-3" title={user.email}>
                  {user.email.slice(0, 25)}
                </td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.PurchasedCourses}</td>
                <td className="p-3 text-center flex items-center justify-center gap-4">
                  
                  <button className="text-primary-dark hover:text-primary transition">
                    <HiMail size={20} href={`mailto:${user.email}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-primary transition"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
