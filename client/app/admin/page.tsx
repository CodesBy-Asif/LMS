'use client'
import React, { useState } from 'react'
import Heading from '../utils/Heading'
import AdminSidebar from '../components/Admin/sideBar/AdminSideBar'
import AdminContent from '../components/Admin/DashboardHero'
import AdminProtected from '../hooks/useAdminProtected'
import Dashboard from '../components/Admin/dashboard/dashboard'

type Props = {}

const page = (props: Props) => {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <AdminProtected>
    <Heading
      title="Edura - admin"
      description="Edura is a free and open source learning management system."
      keywords="Edura, LMS, free, open source, learning management system"
    />
<div className='flex bg-background'>
    <div className='1500:w-[16%] relative w-1/5'>
        <AdminSidebar  activeTab={activeTab}/>

    </div>
    <div className='1500:w-[84%] w-4/5'>
       <AdminContent/>
       <Dashboard/>
    </div>

</div>
    </AdminProtected>
  )
}

export default page