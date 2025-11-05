'use client';
import React from 'react';
import Heading from '@/app/utils/Heading';
import Footer from '@/app/components/Footer/Footer';
import DashboardHero from '@/app/components/Admin/DashboardHero';
import AdminSidebar from '../../components/Admin/sideBar/AdminSideBar'
import AdminProtected from '@/app/hooks/useAdminProtected';
import OrderAnalytics from '@/app/components/Admin/Analytic/order';

const Page = () => {
  
   return (
    <AdminProtected>
      <Heading title="Admin - Invoices" description="All orders overview" keywords="invoices, admin, orders" />
      <div className='flex bg-background'>
          <div className='1500:w-[16%] w-1/5'>
              <AdminSidebar  activeTab={'OrderAnalytics'}/>
      
          </div>
          <div className='1500:w-[84%] w-4/5 '>
            <DashboardHero/>
           <OrderAnalytics/>
          </div>
      </div>
      <Footer />
    </AdminProtected>
  );
};

export default Page;
