import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer'
import Navbar from '../Navbar'
import ScrollToTop from '../ScrollToTop'
import ChatWidget from '../Chatbot/ChatWidget'


const Layout = () => {
  return (
    <>  
        <ScrollToTop/>
        <Navbar/>
        <Outlet/>
        <Footer/>
        <ChatWidget />
    </>
  )
}

export default Layout
