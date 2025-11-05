'use client';

import Header from '@/app/components/Header/Header';
import Heading from '@/app/utils/Heading';
import React, { useState } from 'react';
import Detail from './detail';
import Footer from '@/app/components/Footer/Footer';
import { useGetSingleCourseQuery } from '@/redux/features/courses/courseApi';
import Loader from '@/app/components/Loader/Loader';
import { useSelector } from 'react-redux';
import AdminProtected from '@/app/hooks/useAdminProtected';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  // ✅ Extract id correctly
  const { id } = React.use(params);
  // ✅ RTK Query hook usage
  const { data, isLoading } = useGetSingleCourseQuery(id);

  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState('Login');


  if (isLoading) {
    return <Loader/>
  }


  return (
    <AdminProtected>
      <Heading
        title="Course Access"
        description="edura"
        keywords="asd"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={route}
        setRoute={setRoute}
      />
      <Detail id={id} course={data} />
      <Footer />
    </AdminProtected>
  );
};

export default Page;
