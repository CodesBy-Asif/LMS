'use client';
import React from 'react';
import { useGetAllOrdersQuery } from '../../../redux/features/order/orderApi';
import Heading from '@/app/utils/Heading';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import DashboardHero from '@/app/components/Admin/DashboardHero';
import AdminSidebar from '../../components/Admin/sideBar/AdminSideBar'
import AdminProtected from '@/app/hooks/useAdminProtected';
import UserAnalytics from '@/app/components/Admin/Analytic/user';

const Page = () => {
  
   return (
    <AdminProtected>
      <Heading title="Admin - Invoices" description="All orders overview" keywords="invoices, admin, orders" />
      <div className='flex bg-background'>
          <div className='1500:w-[16%] w-1/5'>
              <AdminSidebar  activeTab={'UserAnalytics'}/>
      
          </div>
          <div className='1500:w-[84%] w-4/5 '>
            <DashboardHero/>
           <UserAnalytics/>
          </div>
      </div>
      <Footer />
    </AdminProtected>
  );
};

export default Page;
