"use client";
import React, { useState, useEffect, useMemo, use } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSortUp,
  FaSortDown,
  FaSearch,
} from "react-icons/fa";
import { useDeleteCourseMutation, useGetAllCourseMutation } from "@/redux/features/courses/courseApi";

interface Course {
  id: number;
  title: string;
  rating: number;
  purchased: number;
  createdAt: string;
}

type SortKey = keyof Course;

const AllCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showEditModal, setShowEditModal] = useState(false);
const [editingCourse, setEditingCourse] = useState<Course | null>(null);


  const [GetAllCourses, { isLoading, isSuccess, isError, data }] =
    useGetAllCourseMutation();
    const [deleteCourse] = useDeleteCourseMutation();

  // ✅ Fetch only once on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response: any = await GetAllCourses({});
        if (response?.data?.success && Array.isArray(response.data.courses)) {
          const formattedCourses: Course[] = response.data.courses.map(
            (course: any, index: number) => ({
              id: course._id, // fallback if no id
              title: course.name || "Untitled",
              rating: course.ratting || 0,
              purchased: course.purchased || 0,
              createdAt: course.createdAt
                ? new Date(course.createdAt).toISOString().split("T")[0]
                : "N/A",
            })
          );
          setCourses(formattedCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [GetAllCourses]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) setSelectedIds([]);
    else setSelectedIds(filteredCourses.map((c) => c.id));
    setSelectAll(!selectAll);
  };

  const handleDelete = async(id: number) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    await deleteCourse(id);
  };

  const handleDeleteSelected = () => {
    setCourses((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    setSelectAll(false);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
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
  }, [courses, search, sortKey, sortOrder]);

  return (
    <div className="p-6 bg-background text-foreground rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-xl font-semibold">All Courses</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses..."
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
              {["id", "title", "rating", "purchased", "createdAt"].map(
                (key) => (
                  <th
                    key={key}
                    className="p-3 font-medium cursor-pointer select-none"
                    onClick={() => handleSort(key as SortKey)}
                  >
                    <div className="flex items-center gap-2">
                      {key === "id"
                        ? "ID"
                        : key === "title"
                        ? "Course Title"
                        : key === "rating"
                        ? "Rating"
                        : key === "purchased"
                        ? "Purchased"
                        : "Created At"}
                      {sortKey === key &&
                        (sortOrder === "asc" ? (
                          <FaSortUp size={14} />
                        ) : (
                          <FaSortDown size={14} />
                        ))}
                    </div>
                  </th>
                )
              )}
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCourses.map((course) => (
              <tr
                key={course.id}
                className={`border-t border-border hover:bg-primary/10 transition ${
                  selectedIds.includes(course.id) ? "bg-primary/10" : ""
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(course.id)}
                    onChange={() => toggleSelect(course.id)}
                    className="accent-primary"
                  />
                </td>
                <td className="p-3" title={course.id.toString()}>{course.id.toString().slice(0, 8)+"..."}</td>
                <td className="p-3 font-medium" title={course.title}>{course.title.slice(0, 20)}</td>
                <td className="p-3">{course.rating.toFixed(1)}</td>
                <td className="p-3">{course.purchased}</td>
                <td className="p-3">{course.createdAt}</td>
                <td className="p-3 text-center flex items-center justify-center gap-4">
                  <button className="text-secondary hover:text-primary transition">
                    <FaEye size={16} />
                  </button>
                  <button className="text-primary-dark hover:text-primary transition">
                    <a href={`/admin/courses/edit/${course.id}`}>

                    <FaEdit size={16}/>
                    </a>
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:text-primary transition"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-muted-foreground">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCourses;
