import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import MyAccount from "./components/MyAccount";
import ChangePassword from "./components/ChangePassword";
import EnrolledCourses from "./components/EnrolledCourses";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import image from '../../../public/assets/avatar.png';
import { useUpdateUserPasswordMutation } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import {  useGetUserCourseMutation } from "@/redux/features/courses/courseApi";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('myAccount');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logout, setLogout] = useState(false);
  const [UpdateUserPassword, {isSuccess,error}]= useUpdateUserPasswordMutation();
  const { user } = useSelector((state: any) => state.auth);
  const [avatar, setAvatar] = useState(user?.avatar?.url || image.src);
  const [enrolledCourses , setEnrolledCourses]= useState([])
  const router = useRouter();
  const [getUserCourse] = useGetUserCourseMutation()

  const courses = async()=>{
     const {data} =  await getUserCourse({});
 setEnrolledCourses(data.courses)
  }
  useEffect(()=>{
   courses();
  },[user])
const {} = useLogoutQuery(undefined,{skip:!logout ? true:false});
  const [profileForm, setProfileForm] = useState({
    name: user?.name,
    email: user?.email,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // const enrolledCourses = [
  //   { id: 1, title: 'Advanced React Development', progress: 75, instructor: 'John Doe', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop', enrolled: 'Jan 2024' },
  //   { id: 2, title: 'UI/UX Design Fundamentals', progress: 45, instructor: 'Jane Smith', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop', enrolled: 'Feb 2024' },
  //   { id: 3, title: 'Python for Data Science', progress: 90, instructor: 'Mike Wilson', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop', enrolled: 'Dec 2023' },
  //   { id: 4, title: 'Digital Marketing Mastery', progress: 30, instructor: 'Emily Brown', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop', enrolled: 'Mar 2024' }
  // ];

  const handleSidebarClick = async (id: string) => {
    if (id === 'logout') {
      setLogout(true);
      await signOut();
      router.push('/');
      return;
    }
    if  (id==='adminDashboard')
    {
      router.push('/admin');
    }
    setActiveTab(id);
  };


  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    await UpdateUserPassword({oldPassword:passwordForm.currentPassword,newPassword:passwordForm.newPassword});
    alert('Password changed successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };
  useEffect(() => {
    if (isSuccess) {
      toast('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
    if (error) {
      toast.error('Failed to change password. Please try again.');
    }
  }, [isSuccess, error]);
  return (
    <div className="min-h-screen pt-22 md:pt-20 bg-background text-foreground">
      <div className="flex gap-6 max-w-7xl mx-auto">
        <Sidebar activeTab={activeTab} onTabClick={handleSidebarClick} role={user?.role}  />
        <main className="flex-1">
          {activeTab === 'myAccount' && (
            <MyAccount
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              avatar={avatar}
              setAvatar={setAvatar}
            />
          )}
          {activeTab === 'changePassword' && (
            <ChangePassword
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              showCurrentPassword={showCurrentPassword}
              setShowCurrentPassword={setShowCurrentPassword}
              showNewPassword={showNewPassword}
              setShowNewPassword={setShowNewPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              onPasswordChange={handlePasswordChange}
            />
          )}
          {activeTab === 'enrolledCourses' && <EnrolledCourses courses={enrolledCourses} />}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
