'use client';
import React from 'react';
import { useGetAllOrdersQuery } from '../../../redux/features/order/orderApi';
import Heading from '@/app/utils/Heading';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import DashboardHero from '@/app/components/Admin/DashboardHero';
import AdminSidebar from '../../components/Admin/sideBar/AdminSideBar'
import AdminProtected from '@/app/hooks/useAdminProtected';

const AdminInvoicesPage = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery({});
  
  console.log(orders)
  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-600">Error loading invoices</div>;
  return (
    <AdminProtected>
      <Heading title="Admin - Invoices" description="All orders overview" keywords="invoices, admin, orders" />
      <div className='flex bg-background'>
          <div className='1500:w-[16%] w-1/5'>
              <AdminSidebar  activeTab={'Invoices'}/>
      
          </div>
          <div className='1500:w-[84%] w-4/5 h-screen overflow-y-auto'>
             <DashboardHero/>
              <div className="max-w-7xl mx-auto px-6 mt-20 py-12">
        <h1 className="text-3xl font-semibold mb-8">All Invoices</h1>
        <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3">Invoice ID</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.orders?.map((order: any) => (
                <tr key={order._id} className="border-t text-center hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4">{order.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{order.course?.name || 'N/A'}</td>
                  <td className="px-6 py-4">${order.course?.price || '0.00'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium bg-green-500 text-white`
                      }
                    >
                    paid
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
          </div>
      
      </div>
     
      <Footer />
    </AdminProtected>
  );
};

export default AdminInvoicesPage;
