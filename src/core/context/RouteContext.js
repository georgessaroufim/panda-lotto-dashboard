import React, { createContext, useEffect, useContext, useState, lazy } from 'react'
import { StoreContext } from './StoreContext'
import {
    BallotOutlined as BallotOutlinedIcon, AnalyticsOutlined as AnalyticsOutlinedIcon,
    MedicalServicesOutlined as MedicalServicesOutlinedIcon, Healing as HealingIcon, Elderly as ElderlyIcon,
    Masks as MasksIcon, LocalOffer as LocalOfferIcon, DateRangeOutlined as DateRangeOutlinedIcon,
    FormatListBulletedOutlined as FormatListBulletedOutlinedIcon, LocalHospitalOutlined as LocalHospitalOutlinedIcon,
    SchoolOutlined as SchoolOutlinedIcon, WorkOutlineOutlined as WorkOutlineOutlinedIcon,
    FactCheckOutlined as FactCheckOutlinedIcon, ManageAccounts as ManageAccountsIcon, MergeType as MergeTypeIcon,
    EnhancedEncryption as EnhancedEncryptionIcon, Flag as FlagIcon, SupportAgent as SupportAgentIcon,
    Workspaces as WorkspacesIcon,
} from '@mui/icons-material';
import I18nManager from '../I18nManager/I18nManager';
const AdministratorDetails = lazy(() => import('../../components/administrators/administrator-details/AdministratorDetails'));
const ComingSoon = lazy(() => import('../../components/_components/coming-soon/ComingSoon'));
const ReceptionistManagerDetails = lazy(() => import('../../components/receptionist-managers/receptionist-manager-details/ReceptionistManagerDetails'));
const ReceptionistManagers = lazy(() => import('../../components/receptionist-managers/ReceptionistManagers'));
const Reports = lazy(() => import('../../components/reports/Reports'));
const ReceptionistDetails = lazy(() => import('../../components/receptionists/receptionist-details/ReceptionistDetails'));
const Receptionists = lazy(() => import('../../components/receptionists/Receptionists'));
const Nationalities = lazy(() => import('../../components/lookups/nationalities/Nationalities'));
const NationalityDetails = lazy(() => import('../../components/lookups/nationalities/nationality-details/NationalityDetails'));
const InsuranceDetails = lazy(() => import('../../components/lookups/insurances/insurance-details/InsuranceDetails'));
const Insurances = lazy(() => import('../../components/lookups/insurances/Insurances'));
const OrderTypeDetails = lazy(() => import('../../components/lookups/order-types/order-type-details/OrderTypeDetails'));
const OrderTypes = lazy(() => import('../../components/lookups/order-types/OrderTypes'));
const UserManagement = lazy(() => import('../../components/user-management/UserManagement'));
const ComplexClinicDetails = lazy(() => import('../../components/complex-clinics/complex-clinic-details/ComplexClinicDetails'));
const ComplexClinics = lazy(() => import('../../components/complex-clinics/ComplexClinics'));
const GeneralServiceDetails = lazy(() => import('../../components/lookups/general-services/general-service-details/GeneralServiceDetails'));
const TimeslotDetails = lazy(() => import('../../components/timeslots/timeslot-details/TimeslotDetails'));
const Timeslots = lazy(() => import('../../components/timeslots/Timeslots'));
const ServiceDetails = lazy(() => import('../../components/lookups/general-services/services/service-details/ServiceDetails'));
const EducationLevelDetails = lazy(() => import('../../components/lookups/education-levels/education-level-details/EducationLevelDetails'));
const OccupationDetails = lazy(() => import('../../components/lookups/occupations/occupation-details/OccupationDetails'));
const OrderStatusDetails = lazy(() => import('../../components/lookups/order-statuses/order-status-details/OrderStatusDetails'));
const OfferCouponDetails = lazy(() => import('../../components/offers-coupons/offer-coupon-details/OfferCouponDetails'));
const PatientDetails = lazy(() => import('../../components/patients/patient-details/PatientDetails'));
const DoctorDetails = lazy(() => import('../../components/doctors/doctor-details/DoctorDetails'));
const ClinicDetails = lazy(() => import('../../components/clinics/clinic-details/ClinicDetails'));
const OrderDetails = lazy(() => import('../../components/orders/order-details/OrderDetails'));
const Services = lazy(() => import('../../components/lookups/general-services/services/Services'));
const GeneralServices = lazy(() => import('../../components/lookups/general-services/GeneralServices'));
const EducationLevels = lazy(() => import('../../components/lookups/education-levels/EducationLevels'));
const Occupations = lazy(() => import('../../components/lookups/occupations/Occupations'));
const OrderStatuses = lazy(() => import('../../components/lookups/order-statuses/OrderStatuses'));
const OffersCoupons = lazy(() => import('../../components/offers-coupons/OffersCoupons'));
const Orders = lazy(() => import('../../components/orders/Orders'));
const Clinics = lazy(() => import('../../components/clinics/Clinics'));
const Doctors = lazy(() => import('../../components/doctors/Doctors'));
const Patients = lazy(() => import('../../components/patients/Patients'));
const Login = lazy(() => import('../../components/login/Login'));

export const RouteContext = createContext();

const RouteProvider = ({ children }) => {
    const { user } = useContext(StoreContext)
    // added showRoutes because it's not rendered after changing navLinks and paths
    const [showRoutes, setShowRoutes] = useState(false)
    const [paths, setPaths] = useState([
        {
            blacklisted_by: [],
            protected: false,
            path: ["/تسجيل-الدخول", "/login"],
            params: [],
            component: <Login />,
        },
        {
            blacklisted_by: [],
            protected: true,
            path: ["/قريبا", "/coming-soon"],
            params: [],
            component: <ComingSoon />,
        },
        {
            blacklisted_by: [2, 3, 4, 5],
            protected: true,
            path: ["/", "/التقارير", "/reports"],
            params: [],
            component: <Reports />,
        },
        {
            blacklisted_by: [],
            protected: true,
            path: ["/الطلبات", "/orders"],
            params: [],
            component: <Orders />,
        },
        {
            blacklisted_by: [],
            protected: true,
            path: ["/تفاصيل-الطلب", "/order-details"],
            params: ["/:id"],
            component: <OrderDetails />,
        },
        {
            blacklisted_by: [2, 3, 5],
            protected: true,
            path: ["/مجمع-العيادات", "/complex-clinics"],
            params: [],
            component: <ComplexClinics />,
        },
        {
            blacklisted_by: [2, 3, 5],
            protected: true,
            path: ["/تفاصيل-مجمع-العيادات", "/complex-clinic-details"],
            params: ["/:id"],
            component: <ComplexClinicDetails />,
        },
        {
            blacklisted_by: [2, 5],
            protected: true,
            path: ["/العيادات", "/clinics"],
            params: [],
            component: <Clinics />,
        },
        {
            blacklisted_by: [2, 5],
            protected: true,
            path: ["/تفاصيل-العيادة", "/clinic-details"],
            params: ["/:id"],
            component: <ClinicDetails />,
        },
        {
            blacklisted_by: [2, 5],
            protected: true,
            path: ["/الأطباء", "/doctors"],
            params: [],
            component: <Doctors />,
        },
        {
            blacklisted_by: [5],
            protected: true,
            path: ["/تفاصيل-الطبيب", "/doctor-details"],
            params: ["/:id"],
            component: <DoctorDetails />,
        },
        {
            blacklisted_by: [],
            protected: true,
            path: ["/المرضى", "/patients"],
            params: [],
            component: <Patients />,
        },
        {
            blacklisted_by: [],
            protected: true,
            path: ["/تفاصيل-المريض", "/patient-details"],
            params: ["/:id"],
            component: <PatientDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5],
            protected: true,
            path: ["/موظفو-الاستقبال", "/receptionists"],
            params: [],
            component: <Receptionists />,
        },
        {
            blacklisted_by: [2, 3, 4],
            protected: true,
            path: ["/تفاصيلموظفالاستقبال", "/receptionist-details"],
            params: ["/:id"],
            component: <ReceptionistDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5],
            protected: true,
            path: ["/مديري-الاستقبال", "/receptionist-managers"],
            params: [],
            component: <ReceptionistManagers />,
        },
        {
            blacklisted_by: [2, 3, 4, 5,],
            protected: true,
            path: ["/تفاصيل-مدير-الاستقبال", "/receptionist-manager-details"],
            params: ["/:id"],
            component: <ReceptionistManagerDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/تفاصيل-المسؤول", "/administrator-details"],
            params: ["/:id"],
            component: <AdministratorDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5],
            protected: true,
            path: ["/العروض-و-القسائم", "/offers-coupons"],
            params: [],
            component: <OffersCoupons />,
        },
        {
            blacklisted_by: [2, 3, 4, 5],
            protected: true,
            path: ["/تفاصيل-العرض", "/offer-details"],
            params: ["/:type", "/:id"],
            component: <OfferCouponDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5],
            protected: true,
            path: ["/تفاصيل-القسيمة", "/coupon-details"],
            params: ["/:type", "/:id"],
            component: <OfferCouponDetails />,
        },
        {
            blacklisted_by: [5],
            protected: true,
            path: ["/المواعيد", "/timeslots"],
            params: [],
            component: <Timeslots />,
        },
        {
            blacklisted_by: [5],
            protected: true,
            path: ["/تفاصيل-الموعد", "/timeslot-details"],
            params: ["/:id"],
            component: <TimeslotDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5],
            protected: true,
            path: ["/إدارة-المستخدم", "/user-management"],
            params: [],
            component: <UserManagement />,
        },
        // data
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/حالات-الطلبات", "/order-statuses"],
            params: [],
            component: <OrderStatuses />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/تفاصيل-حالة-الطلب", "/order-status-details"],
            params: ["/:id"],
            component: <OrderStatusDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/أنواع-الطلبات", "/order-types"],
            params: [],
            component: <OrderTypes />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/تفاصيل-أنواع-الطلب", "/order-type-details"],
            params: ["/:id"],
            component: <OrderTypeDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/التأمينات", "/insurances"],
            params: [],
            component: <Insurances />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/تفاصيل-التأمين", "/insurance-details"],
            params: ["/:id"],
            component: <InsuranceDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/الجنسيات", "/nationalities"],
            params: [],
            component: <Nationalities />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/تفاصيل-الجنسية", "/nationality-details"],
            params: ["/:id"],
            component: <NationalityDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/المهن", "/occupations"],
            params: [],
            component: <Occupations />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/تفاصيل-المهن", "/occupation-details"],
            params: ["/:id"],
            component: <OccupationDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/مستويات-التعليم", "/education-levels"],
            params: [],
            component: <EducationLevels />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/تفاصيل-مستوى-التعليم", "/education-level-details"],
            params: ["/:id"],
            component: <EducationLevelDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/خدمات-عامة", "/general-services"],
            params: [],
            component: <GeneralServices />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/تفاصيل-الخدمة-العامة", "/general-service-details"],
            params: ["/:id"],
            component: <GeneralServiceDetails />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/الخدمات", "/services"],
            params: ["/:id"],
            component: <Services />,
        },
        {
            blacklisted_by: [2, 3, 4, 5, 6],
            protected: true,
            path: ["/تفاصيل-الخدمة", "/service-details"],
            params: ["/:type/:id"],
            component: <ServiceDetails />,
        },
        // content only for admin
    ]
    )
    const [navLinks, setNavLinks] = useState([
        { title: I18nManager.isRTL() ? "التقارير" : "Reports", icon: <AnalyticsOutlinedIcon />, path: '/reports', blacklisted_by: [2, 3, 4, 5], active: false },
        { title: I18nManager.isRTL() ? "الطلبات" : "Orders", icon: <FactCheckOutlinedIcon />, path: '/orders', blacklisted_by: [], active: false },
        { title: I18nManager.isRTL() ? "مجمع عيادات" : "Complex Clinics", icon: <LocalHospitalOutlinedIcon />, path: '/complex-clinics', blacklisted_by: [2, 3, 4, 5], active: false },
        { title: I18nManager.isRTL() ? "العيادات" : "Clinics", icon: <HealingIcon />, path: '/clinics', blacklisted_by: [2, 3, 5], active: false },
        { title: I18nManager.isRTL() ? "الأطباء" : "Doctors", icon: <MasksIcon />, path: '/doctors', blacklisted_by: [2, 5], active: false },
        { title: I18nManager.isRTL() ? "المرضى" : "Patients", icon: <ElderlyIcon />, path: '/patients', blacklisted_by: [], active: false },
        { title: I18nManager.isRTL() ? "العروض/القسائم" : "Offers/Coupons", icon: <LocalOfferIcon />, path: '/offers-coupons', blacklisted_by: [2, 3, 4, 5], active: false },
        { title: I18nManager.isRTL() ? "المواعيد" : "Timeslots", icon: <DateRangeOutlinedIcon />, path: '/timeslots', blacklisted_by: [5], active: false },
        {
            title: I18nManager.isRTL() ? "البيانات" : "Data", icon: <FormatListBulletedOutlinedIcon />, blacklisted_by: [2, 3, 4, 5, 6], active: false,
            collapse: [
                { title: I18nManager.isRTL() ? "الجنسيات" : "Nationalities", icon: <FlagIcon />, path: '/nationalities', blacklisted_by: [], active: false },
                { title: I18nManager.isRTL() ? "حالات الطلبات" : "Order Statuses", icon: <BallotOutlinedIcon />, path: '/order-statuses', blacklisted_by: [], active: false },
                { title: I18nManager.isRTL() ? "أنواع الطلبات" : "Order Types", icon: <MergeTypeIcon />, path: '/order-types', blacklisted_by: [], active: false },
                { title: I18nManager.isRTL() ? "المهن" : "Occupations", icon: <WorkOutlineOutlinedIcon />, path: '/occupations', blacklisted_by: [], active: false },
                { title: I18nManager.isRTL() ? "التأمينات" : "Insurances", icon: <EnhancedEncryptionIcon />, path: '/insurances', blacklisted_by: [], active: false },
                { title: I18nManager.isRTL() ? "مستويات التعليم" : "Education Levels", icon: <SchoolOutlinedIcon />, path: '/education-levels', blacklisted_by: [], active: false },
                { title: I18nManager.isRTL() ? "خدمات عامة" : "General Services", icon: <MedicalServicesOutlinedIcon />, path: '/general-services', blacklisted_by: [], active: false },
            ],
        },
        { title: I18nManager.isRTL() ? "الأمور المالية" : "Financial", icon: <FormatListBulletedOutlinedIcon />, path: '/coming-soon', blacklisted_by: [], active: false },
        { title: I18nManager.isRTL() ? "المحتوى" : "Content", icon: <FormatListBulletedOutlinedIcon />, path: '/coming-soon', blacklisted_by: [2, 3, 4, 5, 6], active: false },
        {
            title: I18nManager.isRTL() ? "موظفو الاستقبال" : "Receptionist", icon: <SupportAgentIcon />, blacklisted_by: [2, 3, 4, 5], active: false,
            collapse: [
                { title: I18nManager.isRTL() ? "مديري الاستقبال" : "Receptionist Managers", icon: <WorkspacesIcon />, path: '/receptionist-managers', blacklisted_by: [], active: false },
                { title: I18nManager.isRTL() ? "موظفو الاستقبال" : "Receptionists", icon: <SupportAgentIcon />, path: '/receptionists', blacklisted_by: [], active: false },
            ],
        },
        { title: I18nManager.isRTL() ? "إدارة المستخدم" : "User Management", icon: <ManageAccountsIcon />, path: '/user-management', blacklisted_by: [2, 3, 4, 5, 6], active: false },
    ]);

    useEffect(() => {
        if (user?.id) {
            var tmp_paths = [...paths]
            tmp_paths.forEach((element, index) => {
                if (element.blacklisted_by.includes(user?.user_type_id)) {
                    tmp_paths.splice(index, 1)
                }
            });
            setPaths(tmp_paths)

            var tmp_navLinks = [...navLinks]
            tmp_navLinks.forEach((element, index) => {
                if (element.blacklisted_by.includes(user?.user_type_id)) {
                    tmp_navLinks.splice(index, 1)
                }
            });
            setNavLinks(tmp_navLinks)
            setShowRoutes(true)
        }
        return () => { }
    }, [user, showRoutes])

    return (
        <RouteContext.Provider value={{
            paths, setPaths,
            navLinks, setNavLinks,
        }}>
            {children}
        </RouteContext.Provider>
    )
}

export default RouteProvider