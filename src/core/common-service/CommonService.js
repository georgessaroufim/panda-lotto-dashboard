import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function setCookie(cname, cvalue) {
    const exdays = 30;
    var secure = '';
    if (window.location.protocol == 'https') {
        secure = "secure;";
    }
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + secure + expires + "; path=/";
}

export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

export function deleteCookie(cname) {
    document.cookie = cname + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/"
}

export function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
}

export function removeWhiteSpaceFromString(text) {
    return text?.replace(/\s/g, '')
}

export const fullNameValidation = (value) => {
    // check if there is numbers
    if (/\d/.test(value)) {
        return false
    } else {
        if (value.includes('  ')) {
            value = value.trimEnd()
        }
        if (value.trimEnd().split(' ').length > 1) {
            return true || value.match(/^[a-zA-Z]+(?:\s[a-zA-Z]+)+$/) ? true : false
        } else {
            return false || value.match(/^[a-zA-Z]+(?:\s[a-zA-Z]+)+$/) ? true : false
        }
    }
}

export const emailValidation = (value) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
}

export function getPhoneNumberDetails(phone) {
    const phoneNumber = parsePhoneNumberFromString(phone)
    return {
        isValid: phoneNumber?.isValid(),
        country: phoneNumber?.country,
        countryCode: phoneNumber?.countryCallingCode,
        format: phoneNumber?.formatInternational(),
        formatNational: phoneNumber?.formatNational(),
    }
}

export const checkFormErrors = (formErrors) => {
    return Object.values(formErrors).every(item => item == true)
}

export const getOrderStatusColor = (val) => {
    return (val?.id == 1 ? "primary" : val?.id == 2 ? "success" :
        val?.id == 3 ? "warning" : val?.id == 4 ? "info" :
            val?.id == 5 ? "error" : val?.id == 6 ? "primary" : "secondary")
}

export const getNumberWithFloat = (number, decimal = 2, showTrailingZero = false) => {
    if (showTrailingZero) {
        return number?.toFixed(decimal)
    } else {
        return parseFloat(number?.toFixed(decimal))
    }
}