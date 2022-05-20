import I18nManager from "../I18nManager/I18nManager"

export const inputValidation = {
    mobileNo: {
        ar: 'قمت بإدخال غير صحيح ادخل رمز البلد ثم رقم جوالك',
        en: 'Invalid! please enter country calling code first.'
    },
    firstName: {
        ar: 'قمت بإدخال غير صحيح لا تستخدم رموز أو أحرف من لغتين مختلفتين',
        en: 'You have entered invalid entry, don’t use symbols or letters from two different languages.'
    },
    lastName: {
        ar: 'قمت بإدخال غير صحيح لا تستخدم رموز أو أحرف من لغتين مختلفتين',
        en: 'You have entered invalid entry, don’t use symbols or letters from two different languages.'
    },
    fullName: {
        ar: 'قم بإدخال اسمين على الأقل',
        en: 'Enter at least two words'
    },
    email: {
        ar: 'عنوان البريد الإلكتروني غير صالح',
        en: 'Invalid email address'
    },
    comapnyName: {
        ar: 'أدخل أربعة أحرف على الأقل',
        en: 'Enter at least four letters'
    },
    subject: {
        ar: 'أدخل أربعة أحرف على الأقل',
        en: 'Enter at least four letters'
    },
    password: {
        ar: 'يجب أن تحتوي كلمة المرور على 8 خانة على الأقل',
        en: 'Password must contain at least 8 characters'
    },
    user_name: {
        ar: 'يجب أن يتكون الاسم من 2 إلى 50 حرفًا',
        en: 'Name must contain 2 to 30 characters'
    },
    dateTime: {
        ar: 'التاريخ والوقت غير صالح',
        en: 'Invalid datetime format'
    },
    price: {
        ar: 'سعر غير صالح',
        en: 'Invalid price'
    },
    coupon_code: {
        ar: 'الرمز غير صالح',
        en: 'Invalid code'
    }
}

export const daysOfTheWeek = [
    { title: I18nManager.isRTL() ? "الأحد" : "Sunday" },
    { title: I18nManager.isRTL() ? "الأثنين" : "Monday" },
    { title: I18nManager.isRTL() ? "الثلاثاء" : "Tuesday" },
    { title: I18nManager.isRTL() ? "الأربعاء" : "Wednesday" },
    { title: I18nManager.isRTL() ? "الخميس" : "Thursday" },
    { title: I18nManager.isRTL() ? "الجمعه" : "Friday" },
    { title: I18nManager.isRTL() ? "السبت" : "Saturday" },
]