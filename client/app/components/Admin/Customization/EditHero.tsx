/* eslint-disable @next/next/no-img-element */
"use client";
import { styles } from "@/app/styles/styles";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import Loader from "../../Loader/Loader";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";

const EditHero = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubTitle] = useState("");
  const { data, refetch } = useGetHeroDataQuery("banner", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setTitle(data?.layout?.banner?.title);
      setSubTitle(data?.layout?.banner?.subtitle);
      setImage(data?.layout?.banner?.image?.url);
    }
  } , [data]);
  useEffect(() => {
    if (isSuccess&&!isLoading) {
      refetch();
      toast.success("Hero section updated successfully!");
    }
    if (error && "data" in error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [isSuccess, refetch, error]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (reader.readyState === 2) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    await editLayout({
      type: "banner",
      title,
      subtitle,
      image,
    });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] 800px:w-[80%] m-auto pb-10 mt-[120px] flex flex-col items-center gap-10">
          {/* Card container */}
         <div className="w-full bg-card dark:bg-muted rounded-2xl shadow-md border border-primary/20 p-6 flex flex-col 1000px:flex-row gap-8 transition-all duration-200">
  {/* Left: Image upload */}
  <div className="flex flex-col items-center w-full 1000px:w-[40%]">
    <div className="relative w-full flex items-center justify-center">
      {image ? (
        <>
          <img
            src={image}
            alt="Banner"
            className="w-full h-[250px] object-cover rounded-xl shadow-sm"
          />
          <label
            htmlFor="banner"
            className="absolute top-3 right-3 bg-card/70 dark:bg-muted/70 rounded-full p-2 cursor-pointer hover:bg-primary/80 transition"
          >
            <CiEdit className="text-text dark:text-white text-[22px]" />
          </label>
        </>
      ) : (
        <label
          htmlFor="banner"
          className="w-full h-[250px] flex flex-col items-center justify-center border-2 border-dashed border-primary rounded-xl cursor-pointer hover:border-primary/80 hover:bg-primary/5 transition"
        >
          <AiOutlineCamera className="text-primary text-[30px]" />
          <span className="text-primary mt-2">Upload banner</span>
        </label>
      )}
      <input
        type="file"
        id="banner"
        accept="image/*"
        onChange={handleUpdate}
        className="hidden"
      />
    </div>
  </div>

  {/* Right: Text inputs */}
  <div className="flex flex-col w-full 1000px:w-[60%] gap-6">
    <div>
      <label className="block text-sm font-semibold text-secondary dark:text-accent mb-2">
        Title
      </label>
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter hero title..."
        rows={3}
        className="w-full p-3 rounded-lg border border-muted dark:border-accent bg-card dark:bg-muted text-text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-secondary dark:text-accent mb-2">
        Subtitle
      </label>
      <textarea
        value={subtitle}
        onChange={(e) => setSubTitle(e.target.value)}
        placeholder="Enter hero subtitle..."
        rows={3}
        className="w-full p-3 rounded-lg border border-muted dark:border-accent bg-card dark:bg-muted text-text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
    </div>
  </div>
</div>

{/* Save Button */}
<div
  className={`${
    styles.buttomPrimary
  } !w-[200px] !h-[45px] text-white text-[16px] font-medium transition-all duration-200 ${
    data?.layout?.banner?.title !== title ||
    data?.layout?.banner?.subtitle !== subtitle ||
    data?.layout?.banner?.image?.url !== image
      ? "cursor-pointer"
      : "cursor-not-allowed"
  } rounded-full shadow-md`}
  onClick={
    data?.layout?.banner?.title !== title ||
    data?.layout?.banner?.subtitle !== subtitle ||
    data?.layout?.banner?.image?.url !== image
      ? handleEdit
      : () => null
  }
>
  Save Changes
</div>

        </div>
      )}
    </>
  );
};

export default EditHero;
