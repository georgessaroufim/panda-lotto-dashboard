import { setCookie } from "../common-service/CommonService";

class I18nManager {
    constructor() {
        this.value = false;
    }

    setCookieDirValue(value) {
        setCookie('dir', value ? 'rtl' : 'ltr')
        window.location.reload()
    }

    setDirValue(value) {
        this.value = value
    }

    isRTL() {
        return this.value;
    }
}

export default new I18nManager();
