import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const CheckAndShow = ({children}) => {

    const locaton = useLocation();

    const [show,setShow] = useState(false);

    useEffect(() => {

        if (locaton.pathname ==="/login" || locaton.pathname === "/register" || locaton.pathname === '/userprofile' || 
        locaton.pathname === '/admindashboard' || locaton.pathname === '/sellcoins' || locaton.pathname === '/auctionresults' || 
        locaton.pathname.startsWith("/auction/") ) {
            setShow(false);
        } else setShow(true);
    },[locaton]);


  return (
    <>{show && children}</>
  )
}

export default CheckAndShow