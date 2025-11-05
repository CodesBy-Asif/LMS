"use client";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/styles";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";

const EditCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const { data, isLoading, refetch } = useGetHeroDataQuery("categories", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();

  // Sync categories from backend
  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(
        data.layout.categories.map((cat: any) => ({
          ...cat,
          tempId: cat._id || `${Date.now()}-${Math.random()}`,
        }))
      );
    }
  }, [data]);

  // Handle success/error messages
  useEffect(() => {
    if (layoutSuccess) {
      refetch();
      toast.success("Categories updated successfully!");
    }
    if (error && "data" in error) {
      toast.error((error as any)?.data?.message);
    }
  }, [layoutSuccess, error, refetch]);

  // Handle input change
  const handleCategoriesAdd = (id: string, value: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat._id === id || cat.tempId === id ? { ...cat, title: value } : cat
      )
    );
  };

  // Add a new empty category
  const newCategoriesHandler = () => {
    if (categories.some((c) => c.title.trim() === "")) {
      toast.error("Please fill existing category titles before adding a new one.");
      return;
    }

    setCategories((prev) => [
      ...prev,
      { title: "", tempId: `${Date.now()}-${Math.random()}` },
    ]);
  };

  // ✅ Check if there are any actual changes
  const areCategoriesUnchanged = (original: any[], current: any[]) => {
    if (!original || !current) return true;
    const originalTitles = original.map((o) => o.title.trim());
    const currentTitles = current.map((c) => c.title.trim());
    return JSON.stringify(originalTitles) === JSON.stringify(currentTitles);
  };

  const isAnyCategoryTitleEmpty = (categories: any[]) =>
    categories.some((cat) => cat.title.trim() === "");

  // ✅ Save button enabled only if there are changes and no empty titles
  const canSave =
    !areCategoriesUnchanged(data?.layout?.categories || [], categories) &&
    !isAnyCategoryTitleEmpty(categories);

  // ✅ Save changes
  const editCategoriesHandler = async () => {
    if (!canSave) return;

    await editLayout({
      type: "categories",
      categories: categories.map(({ title, _id }) =>
        _id ? { title, _id } : { title }
      ),
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="w-[95%] md:w-[80%] mx-auto mt-[100px] mb-16">
      <h1 className={`${styles.title} text-center mb-8`}>
        Manage Course Categories
      </h1>

      <div className="space-y-4">
        {categories.map((item, index) => (
          <div
            key={index} // ✅ using index as key
            className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 rounded-2xl p-4 transition hover:shadow-lg"
          >
            <input
              className="flex-1 bg-transparent border-none outline-none text-[18px] dark:text-white text-black placeholder:text-gray-400"
              value={item.title}
              onChange={(e) =>
                handleCategoriesAdd(item._id || item.tempId, e.target.value)
              }
              placeholder="Enter category title..."
            />
            <AiOutlineDelete
              className="text-red-500 hover:text-red-600 text-[22px] cursor-pointer ml-3 transition"
              onClick={() =>
                setCategories((prev) => prev.filter((_, i) => i !== index))
              } // ✅ delete using index
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <IoMdAddCircleOutline
          className="text-primary text-[35px] hover:scale-110 transition-transform cursor-pointer"
          onClick={newCategoriesHandler}
        />
      </div>

      <div className="flex justify-end mt-8">
        <button
          disabled={!canSave}
          onClick={editCategoriesHandler}
          className={`px-6 py-2 rounded-xl text-white font-semibold transition-all 
            ${
              canSave
                ? "bg-primary hover:bg-primary/90 shadow-md"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditCategories;
