
import React, { FC, useState, useEffect } from 'react';
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,

} from '@heroicons/react/24/outline';
import ThemeToggle from "../ThemeToggle";
import CustomModel from '../../utils/CustomModel';
import Login from '../Auth/Login';
import SignUp from '../Auth/SignUp';
import OTPVerification from '../Auth/OTPVerification';
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation"; // ✅ Next.js navigation
import { HiOutlineUser } from 'react-icons/hi';
import avatar from '../../../public/assets/avatar.png';
import { useLogoutQuery, useSocialLoginMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route:string;
  setRoute:(route: string) => void;
};

const Header: FC<Props> = ({ open, setOpen, activeItem,route,setRoute }) => {
  const navItems = ['Home', 'Courses', 'About', 'Policy', 'FAQ'];
  const [SidebarOpen,setSidebarOpen]=useState(false);
  const {user} = useSelector((state:any) => state.auth);
  const [logout ,setlogout] = useState(false);    
  
  const [socailLogin,{isSuccess,isError,error}] = useSocialLoginMutation();
const router = useRouter();
const {} = useLogoutQuery(undefined,{skip:!logout?true:false});

const {data}= useSession();
  useEffect(()=>{
  if(!user){
    if(data){
      socailLogin({email:data?.user?.email,avatar:data?.user?.image,name:data.user?.name});
      setRoute("")
      setOpen(false)
    }

    if(data !== null || isSuccess){ 
      setRoute("")
      setOpen(false)
    }
    // if(data===null && !isSuccess && ){
    //   setlogout(true);
    // }
    if(isError) {
      if("data" in error) {
        const errordata = error as any;
        const message = errordata.data.message || "Something went wrong";
        toast.error(message);
      }
    }
    
  }},[data,user,])

    const handleAvatarClick = () => {
    if (user) {
    router.push("/profile")
    } else {
      setRoute("Login");
      setOpen(true);
    }
  };
  

  return (
    <header className="bg-background dark:bg-background shadow-md fixed top-0 w-full z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-foreground">EDURA</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`/${item=="Home"?"":item.toLocaleLowerCase()}`}
                className={`text-foreground hover:text-primary font-medium ${
                  activeItem === index ? 'text-primary underline' : ''
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Mobile Menu + Theme Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Theme Toggle */}
          <ThemeToggle/>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!SidebarOpen)}
              className="text-foreground hover:text-primary focus:outline-none"
            >
              {SidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Profile + Theme */}
          <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle/>

          {user ? (
            <img
              src={user?.avatar ?user.avatar.url:avatar.src}
              alt="User Avatar"
              onClick={handleAvatarClick}
              className={`w-10 h-10 rounded-full border-2 ${user?"border-primary":"border-secondary"} cursor-pointer`}
              />
              ):
              <HiOutlineUser onClick={handleAvatarClick} className={`w-10 h-10 rounded-full border-2 p-1 ${user?"border-primary":"border-secondary"} cursor-pointer`}/>
              }
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 transform transition-transform duration-300 md:hidden z-50 flex flex-col justify-between bg-sidebar text-foreground ${
          SidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex justify-between items-center px-6 h-16 border-b border-border">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col mt-4 space-y-2 px-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={`text-left px-3 py-2 rounded hover:bg-muted hover:text-foreground font-medium ${
                  activeItem === index ? 'bg-accent text-primary' : ''
                }`}
                onClick={() => setOpen(false)}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Bottom: Profile + Copyright */}
        <div>
          {user && (
          <div className="flex items-center space-x-3 mb-2 px-4 py-3">
             
            <img
              src={user?.image?user.image:avatar.src}
              alt="User Avatar"
              onClick={handleAvatarClick}
              className={`w-10 h-10 rounded-full border-2 ${user?"border-primary":"border-secondary"} cursor-pointer`}
              />
            
            <span className="font-medium">{user?.name?user.name:"John Doe"}</span>
          </div>)}
          <div className="px-4 py-2 border-t border-border">
            <p className="text-sm text-muted-foreground">EDURA © 2025</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {SidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {
        route==="Sign-up" && (
          <>
          
          { open && <CustomModel open={open} setOpen={setOpen} activeItem={activeItem} Component={SignUp} setRoute={setRoute}/>}

          
          </>
        )
      }
      {
        route==="Login" && (
          <>
          { open && <CustomModel open={open} setOpen={setOpen} activeItem={activeItem} Component={Login} setRoute={setRoute}/>}
          
          </>
        )
      }
       {
        route==="Verification" && (
          <>
          
          { open && <CustomModel open={open} setOpen={setOpen} activeItem={activeItem} Component={OTPVerification} setRoute={setRoute}/>}

          
          </>
        )
      }

    </header>
  );
};

export default Header;
