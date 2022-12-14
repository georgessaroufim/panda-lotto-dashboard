
import React, { useEffect, useState, useContext, lazy } from 'react'
import './App.css';
import { Route, BrowserRouter, useLocation, Routes, useNavigate, } from 'react-router-dom';
import I18nManager from './core/I18nManager/I18nManager';
import ThemeCustomization from './core/theme-customization/ThemeCustomization';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ViewContainer from './core/routes/view-container/ViewContainer';
import { getCookie, deleteCookie } from './core/common-service/CommonService';
import { setDefaultHeader, postCheckToken } from './core/api/Api';
import { StoreContext } from './core/context/StoreContext';
import { RouteContext } from './core/context/RouteContext';
import dayjs from 'dayjs'
import RequestErrorMessage from './components/_components/request-error-message/RequestErrorMessage';
import ProtectedRoute from './core/routes/protected_route/ProtectedRoute';
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
const ComingSoon = lazy(() => import('./components/_components/coming-soon/ComingSoon'));

const PreLoader = () => {
  let navigate = useNavigate()

  const { setIsLoggedIn, setUser } = useContext(StoreContext)
  const [open, setOpen] = useState(true);

  const checkToken = () => {
    const token = sessionStorage.getItem('token') || getCookie('token')
    if (token) {
      setDefaultHeader(token)
      postCheckToken().then(res => {
        const response = res.data
        if (response?.success) {
          const user = response?.success?.user
          if (user?.user_type_id !== 1) {
            setIsLoggedIn(true)
            setUser(user)
          } else {
            setOpen(false)
            alert(I18nManager.isRTL() ? "المستخدم غير مسموح به" : "User not allowed")
          }
        } else {
          setIsLoggedIn(false)
          sessionStorage.clear()
          deleteCookie('token')
          navigate('/login')
        }
        setOpen(false)
      }).catch(e => {
        setIsLoggedIn(false)
        sessionStorage.clear()
        deleteCookie('token');
        setOpen(false);
        navigate('/login')
      })
    } else {
      setIsLoggedIn(false)
      setOpen(false)
    }
  }

  useEffect(() => {
    checkToken()
    return () => {
    };
  }, []);

  return (
    <Backdrop
      sx={{ backgroundColor: '#000', color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

const App = () => {
  const { paths } = useContext(RouteContext)
  return (
    <BrowserRouter>
      <RequestErrorMessage />
      <PreLoader />
      <ThemeCustomization>
        <ViewContainer>
          <Routes>
            {paths.map((item, index) => (
              item.path.map((el) => (
                <Route key={index} path={el + (item.params.join(""))} element={item.protected ?
                  <ProtectedRoute>{item.component}</ProtectedRoute> : item.component} />
              ))
            ))}
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </ViewContainer>
      </ThemeCustomization>
    </BrowserRouter>
  );
}

export default App;
