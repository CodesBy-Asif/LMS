'use client'
import React from 'react'
import AdminSidebar from '../../components/Admin/sideBar/AdminSideBar'
import Heading from '@/app/utils/Heading'
import DashboardHero from '@/app/components/Admin/DashboardHero'
import Teams from '../../components/Admin/teams/teams'
import AdminProtected from '@/app/hooks/useAdminProtected'

type Props = {}

function page({}: Props) {

  return (
    <AdminProtected>
    <Heading
      title="Edura| courses - admin"
      description="Edura is a free and open source learning management system."
      keywords="Edura, LMS, free, open source, learning management system"
    />
<div className='flex bg-background'>
    <div className='1500:w-[16%] w-1/5'>
        <AdminSidebar  activeTab={'team'}/>

    </div>
    <div className='1500:w-[84%] w-4/5 h-screen overflow-y-auto'>
       <DashboardHero/>
       <Teams/>
    </div>

</div>
    </AdminProtected>
  )
}

export default page