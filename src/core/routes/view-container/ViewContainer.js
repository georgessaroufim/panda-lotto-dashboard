import React, { Fragment, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import MainNavBar from '../navbar/main-navbar/MainNavBar'
const Footer = React.lazy(() => import('../footer/Footer'))

const ViewContainer = ({ children }) => {
    const { pathname } = useLocation();
    const { isLoggedIn } = useContext(StoreContext)
    const [show, setShow] = useState(false)

    useEffect(() => {
        const paths = ['/login', '/تسجيل-الدخول'];
        if (paths.includes(pathname)) {
            setShow(false)
        } else {
            setShow(true)
        }
    }, [pathname]);

    return (
        <Fragment>
            {(show && isLoggedIn) ? <MainNavBar body={children} /> : children}
            <Footer />
        </Fragment>
    )
}

export default ViewContainer