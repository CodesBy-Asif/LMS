"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FaSortUp, FaSortDown, FaPlus } from "react-icons/fa";
import { HiMinus } from "react-icons/hi";
import { useGetallUserMutation, useUpdateRoleMutation } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  PurchasedCourses: number;
}

type SortKey = keyof User;

const Teams = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]); // only admins in table
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // for modal selection
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [GetAllUsers] = useGetallUserMutation();
  const [updateRole, { isLoading ,isSuccess, isError}] = useUpdateRoleMutation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: any = await GetAllUsers({});
        if (response?.data?.success && Array.isArray(response.data.users)) {
          const formattedUsers: User[] = response.data.users.map((user: any) => ({
            id: user._id,
            name: user.name || "No Name",
            email: user.email || "N/A",
            role: user.role || "user",
            PurchasedCourses: user.courses.length || 0,
          }));
          setUsers(formattedUsers);
          setAdmins(formattedUsers.filter(u => u.role === "admin"));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [GetAllUsers]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredAdmins = useMemo(() => {
    return admins
      .filter(user => user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()))
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
  }, [admins, search, sortKey, sortOrder]);

  const nonAdminUsers = users.filter(u => u.role !== "admin");

  // Add a single user as admin
const addSingleUser = async (user: User) => {
  try {
    // Update admins state
    setAdmins(prev => [...prev, { ...user, role: "admin" }]);
    // Update users state
    setUsers(prev =>
      prev.map(u => (u.id === user.id ? { ...u, role: "admin" } : u))
    );

    // API call to update role
    await updateRole({ userId: user.id, role: "admin" });
    setShowModal(false);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};


/**
 * Removes a user from the team and updates the state accordingly.
 * @param {number} id - The id of the user to be removed.
 */
  const removeAdmin =async(id: number) => {
    setAdmins(prev => prev.filter(u => u.id !== id));
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: "user" } : u));
    await updateRole({ userId: id, role: "user" });
    
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Role updated successfully");
    } else if (isError) {
      toast.error("Error updating role");
    }
  }, [isSuccess, isError]);

  return (
    <div className="p-6 bg-background text-foreground rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Team Members (Admins)</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          <FaPlus /> Add Member
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-primary text-white">
            <tr>
              {["id", "name", "email", "role"].map(key => (
                <th
                  key={key}
                  className="p-3 font-medium cursor-pointer select-none"
                  onClick={() => handleSort(key as SortKey)}
                >
                  {key.toUpperCase()}
                  {sortKey === key &&
                    (sortOrder === "asc" ? <FaSortUp size={14} /> : <FaSortDown size={14} />)}
                </th>
              ))}
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAdmins.map(admin => (
              <tr key={admin.id} className="border-t border-border hover:bg-primary/10 transition">
                <td className="p-3">{admin.id.toString().slice(0, 8)}...</td>
                <td className="p-3">{admin.name}</td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3">{admin.role}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => removeAdmin(admin.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                  >
                    <HiMinus size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding users */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30  flex justify-center items-center z-50">
          <div className="bg-background relative p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
          
  <button
  onClick={() => setShowModal(false)}
  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
>
  ✕
</button>
            <h3 className="text-lg font-semibold mb-4">Add Users to Team</h3>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-border rounded"
            />
          {nonAdminUsers
  .filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )
  .map(user => (
    <div key={user.id} className="flex items-center justify-between mb-2">
      <div>{user.name} ({user.email})</div>
      <div className="flex items-center gap-2">
        
        <button
          onClick={() => addSingleUser(user)}
          className="px-2 py-1 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Add
        </button>
        
      </div>
      
    </div>
  ))}

           
          </div>
          
        </div>
        
      )}
      
    </div>
  );
};

export default Teams;
