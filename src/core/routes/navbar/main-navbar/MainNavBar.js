import React, { Fragment, useContext, useState } from 'react';
import I18nManager from '../../../I18nManager/I18nManager';
import { useNavigate, useLocation } from 'react-router-dom'
import { alpha, styled, useTheme } from '@mui/material/styles';
import {
    Box, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, Avatar,
    IconButton, ListItemButton, ListItemText, ListItemIcon, InputBase, Badge, MenuItem, Menu, Collapse, Tooltip,
} from '@mui/material';
import {
    Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, AccountBox as AccountBoxIcon,
    Mail as MailIcon, Search as SearchIcon, AccountCircle, Notifications as NotificationsIcon, MoreVert as MoreIcon,
    Logout as LogoutIcon, ExpandMore, ExpandLess, Language as LanguageIcon,
} from '@mui/icons-material';
import images from '../../../constants/images';
import { RouteContext } from '../../../context/RouteContext';
import { StoreContext } from '../../../context/StoreContext';
import { MEDIA_URL } from '../../../api/Api';
import { deleteCookie } from '../../../common-service/CommonService';

const drawerWidth = 300;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const MainNavBar = ({ body }) => {
    const { navLinks, setNavLinks } = useContext(RouteContext)
    const { user } = useContext(StoreContext)
    let navigate = useNavigate()
    const { pathname } = useLocation()
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const onChangeLanguage = (e) => {
        handleMenuClose()
        e.preventDefault()
        window.location.href = (I18nManager.isRTL() ? "/en" : "/ar") + pathname
        // I18nManager.setCookieDirValue()
    }

    const onLogout = () => {
        handleMenuClose()
        sessionStorage.clear()
        deleteCookie('token')
        window.location.reload()
    }

    const onProfileClick = () => {
        handleMenuClose()
        switch (user?.user_type_id) {
            case 1:
                navigate('/patient-details/' + user?.id)
                break;
            case 2:
                navigate('/doctor-details/' + user?.id)
                break;
            case 3:
                navigate('/clinic-details/' + user?.id)
                break;
            case 4:
                navigate('/complex-clinic-details/' + user?.id)
                break;
            case 5:
                navigate('/receptionist-details/' + user?.id)
                break;
            case 6:
                navigate('/receptionist-manager-details/' + user?.id)
                break;
            case 7:
                navigate('/administrator-details/' + user?.id)
                break;
            default:
                break;
        }
    }

    const menuId = 'appbar-profile-menu';
    const renderProfileMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={onProfileClick}>
                <ListItemIcon>
                    <AccountBoxIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{I18nManager.isRTL() ? "الملف الشخصي" : "Profile"}</ListItemText>
            </MenuItem>
            <MenuItem onClick={onLogout}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{I18nManager.isRTL() ? "خروج" : "Sign out"}</ListItemText>
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'appbar-profile-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={onChangeLanguage}>
                <IconButton size="large" aria-label="show languages" color="inherit">
                    <LanguageIcon />
                </IconButton>
                <p>{I18nManager.isRTL() ? "English" : "عربي"}</p>
            </MenuItem>
            {/* <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem> */}
            <MenuItem onClick={onProfileClick}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="appbar-profile-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Avatar alt={user?.firstName || user?.namEn || user?.firstNameEn}
                        title={user?.firstName || user?.namEn || user?.firstNameEn}
                        sx={{ width: 32, height: 32 }}
                        src={user?.img ? MEDIA_URL + user?.img : null} />
                </IconButton>
                <p>{I18nManager.isRTL() ? "الملف الشخصي" : "Profile"}</p>
            </MenuItem>
            <MenuItem onClick={onLogout}>
                <IconButton
                    size="large"
                    aria-label="sign out"
                    color="inherit"
                >
                    <LogoutIcon />
                </IconButton>
                <p>{I18nManager.isRTL() ? "خروج" : "Sign out"}</p>
            </MenuItem>
        </Menu>
    );

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));

    const onListItemClick = (index) => (e) => {
        e.preventDefault()
        var tmpData = [...navLinks]
        if (tmpData[index].collapse) {
            tmpData[index].active = !tmpData[index].active
        } else {
            tmpData.forEach((element, i) => {
                element.active = index == i
                if (element?.collapse?.length > 0) {
                    element.collapse.forEach(el => {
                        el.active = false
                    })
                }
            });
        }
        setNavLinks(tmpData)
        if (navLinks[index]?.path) {
            navigate(navLinks[index].path)
        }
    }

    const onListSubItemClick = (index, subIndex) => (e) => {
        e.preventDefault()
        var tmpData = [...navLinks]
        tmpData.forEach((element, i) => {
            if (parseInt(index) !== parseInt(i)) {
                element.active = false
            }
            if (element?.collapse?.length > 0) {
                element.collapse.forEach((subElement, i) => {
                    subElement.active = subIndex == i
                });
            }
        });
        setNavLinks(tmpData)
        navigate(navLinks[index].collapse[subIndex].path)
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {I18nManager.isRTL() ? "لوحة التحكم" : "Dashboard"}
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder={(I18nManager.isRTL() ? "بحث" : "Search") + '...'}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Tooltip title={I18nManager.isRTL() ? "English" : "عربى"} onClick={onChangeLanguage}>
                            <IconButton size="large" aria-label="show language" color="inherit">
                                <LanguageIcon />
                            </IconButton>
                        </Tooltip>
                        {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton> */}
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar alt={user?.firstName || user?.namEn || user?.firstNameEn}
                                title={user?.firstName || user?.namEn || user?.firstNameEn}
                                sx={{ width: 32, height: 32 }}
                                src={user?.img ? MEDIA_URL + user?.img : null} />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderProfileMenu}
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Avatar
                        title="logo"
                        alt="logo"
                        src={images.logo}
                        sx={{ width: 40, height: 40 }}
                    />
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction == 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {navLinks.map((item, index) => (
                        <Fragment key={index}>
                            <ListItemButton selected={!item?.collapse && item?.active} onClick={onListItemClick(index)}>
                                <ListItemIcon>
                                    {item?.icon}
                                </ListItemIcon>
                                <ListItemText primary={item?.title} />
                                {item?.collapse?.length > 0 && <>
                                    {item?.active ? <ExpandLess /> : <ExpandMore />}
                                </>}
                            </ListItemButton>
                            {item?.collapse?.length > 0 &&
                                <Collapse in={item?.active} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.collapse.map((el, i) => (
                                            <ListItemButton selected={el?.active}
                                                sx={{ pl: 4 }} key={i} onClick={onListSubItemClick(index, i)}>
                                                <ListItemIcon>
                                                    {el?.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={el?.title} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>}
                        </Fragment>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {body}
            </Box>
        </Box>
    );
}

export default MainNavBar