//HTTP_Request2用HTTP_Client_CookieManager
export default class HTTP_Client_CookieManager {
    private _cookies: any[];
    _serializeSessionCookies: boolean;
    constructor() {
        this._cookies = Array();
        this._serializeSessionCookies = false;
    }

    HTTP_Client_CookieManager(serializeSession = false) {
        this.serializeSessionCookies(serializeSession);
    }

    serializeSessionCookies(serialize) {
        // this._serializeSessionCookies = Bool(serialize);
    }

    passCookies(request) {
        // if (!!this._cookies) //We do not check cookie's "expires" field, as we do not store deleted
        //     {
        //         var url = request.getUrl();
        //         var cookies = Array();

        //         for (var cookie of Object.values(this._cookies)) {
        //             if (this._domainMatch(url.getHost(), cookie.domain) && 0 === strpos(url.path, cookie.path) && (!cookie.secure || url.protocol == "https")) {
        //                 cookies[cookie.name][cookie.path.length] = cookie.value;
        //             }
        //         }

        //         {
        //             let _tmp_0 = this._cookies;

        //             for (var name in _tmp_0) {
        //                 var values = _tmp_0[name];
        //                 request.addCookie(values.name, values.value);
        //             }
        //         }

        //         for (var name in cookies) {
        //             var values = cookies[name];
        //             krsort(values);

        //             for (var value of Object.values(values)) {
        //                 request.addCookie(name, value);
        //             }
        //         }
        //     }

        return true;
    }

    addCookie(cookie) {
        var hash = this._makeHash(cookie.name, cookie.domain, cookie.path);

        this._cookies[hash] = cookie;
    }

    updateCookies(request, responses) {
        // var cookies;

        // if (false !== (cookies = responses.getCookies())) {
        //     var url = request.getUrl();

        //     for (var cookie of Object.values(cookies)) //use the current domain by default
        //     {
        //         if (!(undefined !== cookie.domain)) {
        //             cookie.domain = url.host;
        //         }

        //         if (!cookie.path) {
        //             cookie.path = DIRECTORY_SEPARATOR == dirname(url.path) ? "/" : dirname(url.path);
        //         }

        //         if (this._domainMatch(url.getHost(), cookie.domain)) //if value is empty or the time is in the past the cookie is deleted, else added
        //             {
        //                 var hash = this._makeHash(cookie.name, cookie.domain, cookie.path);

        //                 if (cookie.value.length && (!(undefined !== cookie.expires) || strtotime(cookie.expires) > Date.now() / 1000)) {
        //                     this._cookies[hash] = cookie;
        //                 } else if (undefined !== this._cookies[hash]) {
        //                     delete this._cookies[hash];
        //                 }
        //             }
        //     }
        // }
    }

    _makeHash(name, domain, path) {
        // return md5(name + "\r\n" + domain + "\r\n" + path);
        return "";
    }

    _domainMatch(requestHost, cookieDomain) {
        // if (requestHost == cookieDomain) {
        //     return true;
        // }

        // if (preg_match("/^(?:\\d{1,3}\\.){3}\\d{1,3}$/", requestHost)) {
        //     return false;
        // }

        // if ("." != cookieDomain[0]) {
        //     cookieDomain = "." + cookieDomain;
        // }

        // if (substr_count(cookieDomain, ".") < 2) {
        //     return false;
        // }

        return ("." + requestHost).substr(-cookieDomain.length) == cookieDomain;
    }

    reset() {
        this._cookies = Array();
    }

    __sleep() {
        // if (!this._serializeSessionCookies) {
        //     {
        //         let _tmp_1 = this._cookies;

        //         for (var hash in _tmp_1) {
        //             var cookie = _tmp_1[hash];

        //             if (!cookie.expires) {
        //                 delete this._cookies[hash];
        //             }
        //         }
        //     }
        // }

        return ["_cookies", "_serializeSessionCookies"];
    }

    __wakeup() {
        // {
        //     let _tmp_2 = this._cookies;

        //     for (var hash in _tmp_2) {
        //         var cookie = _tmp_2[hash];

        //         if (!!cookie.expires && strtotime(cookie.expires) < Date.now() / 1000) {
        //             delete this._cookies[hash];
        //         }
        //     }
        // }
    }

    getCookies() {
        return this._cookies;
    }

};
