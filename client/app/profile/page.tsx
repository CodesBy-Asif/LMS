'use client'
import React, { FC } from 'react'
import Header from '../components/Header/Header'
import Protected from '../hooks/useProtected'
import Profile from '../components/pages/profile'
import Heading from '../utils/Heading'
import { useSelector } from 'react-redux'


type Props = {}

const page:FC<Props> = () => {
    const {user} = useSelector((state:any) => state.auth);
    const [open, setOpen] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState(99);
    const [route, setRoute] = React.useState("login");
  return (
    <>
    <Protected>
    <Heading
      title={`${user?.name}'s Profile - Edura LMS`}
      description="Edura is a free and open source learning management system."
      keywords="Edura, LMS, free, open source, learning management system"
    />
    <Header open={open} setOpen={setOpen} activeItem={activeItem} route={route} setRoute={setRoute} />
    <Profile />
    </Protected>
    </>
  )
}

export default page