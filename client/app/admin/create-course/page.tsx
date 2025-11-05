'use client'
import React from 'react'
import AdminSidebar from '../../components/Admin/sideBar/AdminSideBar'
import Heading from '@/app/utils/Heading'
import DashboardHero from '@/app/components/Admin/DashboardHero'
import CreateCourse from '../../components/Admin/Course/CreateCourse'
import AdminProtected from '@/app/hooks/useAdminProtected'

type Props = {}

function page({}: Props) {

  return (
    <AdminProtected>

    <Heading
      title="Edura - admin"
      description="Edura is a free and open source learning management system."
      keywords="Edura, LMS, free, open source, learning management system"
      />
<div className='flex bg-background'>
    <div className='1500:w-[16%] w-1/5'>
        <AdminSidebar  activeTab={'create-course'}/>

    </div>
    <div className='1500:w-[84%] w-4/5 h-screen overflow-y-auto'>
       <DashboardHero/>
       <CreateCourse/>
    </div>

</div>
    </AdminProtected>
  )
}

export default page