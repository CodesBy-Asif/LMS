import { useEditProfileMutation, useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaCamera } from "react-icons/fa";

interface MyAccountProps {
  profileForm: any;
  setProfileForm: React.Dispatch<React.SetStateAction<any>>;
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
}

const MyAccount: React.FC<MyAccountProps> = ({
  profileForm,
  setProfileForm,
  avatar,
  setAvatar,
}) => {
  const [updateAvatar] = useUpdateAvatarMutation();
  const [name, setName] = React.useState(profileForm.name);
  const [email, setEmail] = React.useState(profileForm.email);
  const [EditProfile ,{isSuccess,error}] = useEditProfileMutation()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const oldAvatar = avatar;

    // Preview immediately
    setAvatar(URL.createObjectURL(file));

    // Wrap the upload in a toast.promise
    toast.promise(
      (async () => {
        // Convert file to Base64
        const base64String: string = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            if (reader.result) resolve(reader.result as string);
            else reject("File read failed");
          };
          reader.onerror = reject;
        });

        // Call RTK Query mutation with Base64 string
        const { data } = await updateAvatar(base64String);
        if (!data?.success) throw new Error("Avatar update failed");

        return data;
      })(),
      {
        loading: "Uploading avatar...",
        success: "Avatar updated successfully!",
        error: "Failed to update avatar.",
      }
    ).catch(() => {
      // Reset preview on error
      setAvatar(oldAvatar);
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile updated successfully!");
      setProfileForm({ name, email });
    }
    
    if (error) {
      toast.error("Failed to update profile.");
     setName(profileForm.name);
      setEmail(profileForm.email);
    }
  }, [isSuccess, error]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    await EditProfile({name,email}); 
   };

  return (
    <div className="bg-card text-foreground rounded-lg shadow-lg overflow-hidden p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-5 mb-6">
        <div className="relative">
          <img
            src={avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-background shadow-lg object-cover"
          />
          <label className="absolute bottom-0 right-0 p-2 rounded-full shadow-lg cursor-pointer bg-primary hover:bg-primary-dark transition">
            <FaCamera className="w-4 h-4 text-text-on-primary" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="flex-1 items-center self-center z-20 text-center sm:text-left mt-16 sm:mt-0">
          <h1 className="text-3xl font-bold mb-2 text-secondary">{profileForm.name}</h1>
          <div className="flex flex-col sm:flex-row gap-3 text-muted-foreground">
            <span className="flex items-center gap-2 justify-center sm:justify-start">
              <FaEnvelope className="w-4 h-4" />
              {profileForm.email}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <h2 className="text-xl font-bold mb-4 text-secondary">Personal Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) =>
               setName(e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              value={email}
          readOnly
              className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-lg font-medium bg-primary text-text-on-primary hover:bg-primary-dark transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default MyAccount;
