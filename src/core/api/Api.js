import axios from 'axios';

export const BASE_URL = window.location.host.startsWith('localhost') ? 'http://localhost:8000/' : 'https://api.docnow247.com/'

export const MEDIA_URL = BASE_URL.slice(0, -1)

axios.defaults.baseURL = BASE_URL + 'api/';
axios.defaults.timeout = 60000;

export function setDefaultHeader(value) {
    axios.defaults.headers.common['Authorization'] = value
}

export function postCheckToken() {
    return axios.post('checkToken')
}
export function postLogin(data) {
    return axios.post('login', data)
}
export function postRegister(data) {
    return axios.post('register', data)
}
export function postGetUsersByUserTypeId(data) {
    return axios.post('getUsersByUserTypeId', data)
}

// Uer Types
export function postGetAllUserTypes(data) {
    return axios.post('getAllUserTypes', data)
}

// Patient
export function postGetPatientById(data) {
    return axios.post('getPatientById', data)
}
export function postGetAllPatients(data) {
    return axios.post('getAllPatients', data)
}
export function postUpSertPatient(data) {
    return axios.post('upSertPatient', data)
}

// Doctor
export function postGetDoctorById(data) {
    return axios.post('getDoctorById', data)
}
export function postGetAllDoctors(data) {
    return axios.post('getAllDoctors', data)
}
export function postUpSertDoctor(data) {
    return axios.post('upSertDoctor', data)
}

// Complex Clinic
export function postGetComplexClinicById(data) {
    return axios.post('getComplexClinicById', data)
}
export function postGetAllComplexClinics(data) {
    return axios.post('getAllComplexClinics', data)
}
export function postUpSertComplexClinic(data) {
    return axios.post('upSertComplexClinic', data)
}

// Clinic
export function postGetClinicById(data) {
    return axios.post('getClinicById', data)
}
export function postGetAllClinics(data) {
    return axios.post('getAllClinics', data)
}
export function postUpSertClinic(data) {
    return axios.post('upSertClinic', data)
}

// Receptionist
export function postGetReceptionistById(data) {
    return axios.post('getReceptionistById', data)
}
export function postGetAllReceptionists(data) {
    return axios.post('getAllReceptionists', data)
}
export function postUpSertReceptionist(data) {
    return axios.post('upSertReceptionist', data)
}

// Receptionist Managers
export function postGetReceptionistManagerById(data) {
    return axios.post('getReceptionistManagerById', data)
}
export function postGetAllReceptionistManagers(data) {
    return axios.post('getAllReceptionistManagers', data)
}
export function postUpSertReceptionistManager(data) {
    return axios.post('upSertReceptionistManager', data)
}

// Administrators
export function postGetAdministratorById(data) {
    return axios.post('getAdministratorById', data)
}
export function postGetAllAdministrators(data) {
    return axios.post('getAllAdministrators', data)
}
export function postUpSertAdministrator(data) {
    return axios.post('upSertAdministrator', data)
}

// Order
export function postGetOrderById(data) {
    return axios.post('getOrderById', data)
}
export function postGetAllOrders(data) {
    return axios.post('getAllOrders', data)
}
export function postUpSertOrder(data) {
    return axios.post('upSertOrder', data)
}
export function postGetOrdersStatistic(data) {
    return axios.post('getOrdersStatistic', data)
}
export function postGetOrdersStatisticById(data) {
    return axios.post('getOrdersStatisticById', data)
}

// Offer
export function postGetOfferById(data) {
    return axios.post('getOfferById', data)
}
export function postGetAllOffers(data) {
    return axios.post('getAllOffers', data)
}
export function postUpSertOffer(data) {
    return axios.post('upSertOffer', data)
}

// Timeslot
export function postGetTimeslotById(data) {
    return axios.post('getTimeslotById', data)
}
export function postGetAllTimeslots(data) {
    return axios.post('getAllTimeslots', data)
}
export function postUpSertTimeslot(data) {
    return axios.post('upSertTimeslot', data)
}

// Coupon
export function postGetCouponById(data) {
    return axios.post('getCouponById', data)
}
export function postGetAllCoupons(data) {
    return axios.post('getAllCoupons', data)
}
export function postUpSertCoupon(data) {
    return axios.post('upSertCoupon', data)
}

// Order Status
export function postGetOrderStatusById(data) {
    return axios.post('getOrderStatusById', data)
}
export function postGetAllOrderStatuses(data) {
    return axios.post('getAllOrderStatuses', data)
}
export function postUpSertOrderStatus(data) {
    return axios.post('upSertOrderStatus', data)
}

// Order Types
export function postGetOrderTypeById(data) {
    return axios.post('getOrderTypeById', data)
}
export function postGetAllOrderTypes(data) {
    return axios.post('getAllOrderTypes', data)
}
export function postUpSertOrderType(data) {
    return axios.post('upSertOrderType', data)
}

// Nationalities
export function postGetNationalityById(data) {
    return axios.post('getNationalityById', data)
}
export function postGetAllNationalities(data) {
    return axios.post('getAllNationalities', data)
}
export function postUpSertNationality(data) {
    return axios.post('upSertNationality', data)
}

// Insurances
export function postGetInsuranceById(data) {
    return axios.post('getInsuranceById', data)
}
export function postGetAllInsurances(data) {
    return axios.post('getAllInsurances', data)
}
export function postUpSertInsurance(data) {
    return axios.post('upSertInsurance', data)
}

// Occupation
export function postGetOccupationById(data) {
    return axios.post('getOccupationById', data)
}
export function postGetAllOccupations(data) {
    return axios.post('getAllOccupations', data)
}
export function postUpSertOccupation(data) {
    return axios.post('upSertOccupation', data)
}

// Education Level
export function postGetEducationLevelById(data) {
    return axios.post('getEducationLevelById', data)
}
export function postGetAllEducationLevels(data) {
    return axios.post('getAllEducationLevels', data)
}
export function postUpSertEducationLevel(data) {
    return axios.post('upSertEducationLevel', data)
}

// General Service
export function postGetGeneralServiceById(data) {
    return axios.post('getGeneralServiceById', data)
}
export function postGetAllGeneralServices(data) {
    return axios.post('getAllGeneralServices', data)
}
export function postUpSertGeneralService(data) {
    return axios.post('upSertGeneralService', data)
}

// Service
export function postGetServiceById(data) {
    return axios.post('getServiceById', data)
}
export function postGetAllServices(data) {
    return axios.post('getAllServices', data)
}
export function postUpSertService(data) {
    return axios.post('upSertService', data)
}