//
//HTTP_Request2用HTTP_Client_CookieManager
//
//更新履歴：<br>
//2011/08/24 宝子山浩平 作成
//
//@package Base
//@subpackage HTTP
//@author housiyama
//@since 2011/08/24
//@filesource
//

//
//HTTP_Client_CookieManager
//
//@author houshiyama
//@since 2011/08/24
//
//@param mixed $serializeSession
//@access public
//@return void
//
//
//serializeSessionCookies
//
//@author houshiyama
//@since 2011/08/24
//
//@param mixed $serialize
//@access public
//@return void
//
//
//passCookies
//
//@author houshiyama
//@since 2011/08/24
//
//@param mixed $request
//@access public
//@return void
//
//
//addCookie
//
//@author houshiyama
//@since 2011/08/24
//
//@param mixed $cookie
//@access public
//@return void
//
//
//updateCookies
//
//@author houshiyama
//@since 2011/08/24
//
//@param mixed $request
//@param mixed $responses
//@access public
//@return void
//
//
//_makeHash
//
//@author houshiyama
//@since 2011/08/24
//
//@param mixed $name
//@param mixed $domain
//@param mixed $path
//@access private
//@return void
//
//
//_domainMatch
//
//@author houshiyama
//@since 2011/08/24
//
//@param mixed $requestHost
//@param mixed $cookieDomain
//@access protected
//@return void
//
//
//reset
//
//@author houshiyama
//@since 2011/08/24
//
//@access public
//@return void
//
//
//__sleep
//
//@author houshiyama
//@since 2011/08/24
//
//@access public
//@return void
//
//
//__wakeup
//
//@author houshiyama
//@since 2011/08/24
//
//@access protected
//@return void
//
//
//getCookies
//
//@author morihara
//@since 2011/09/09
//
//@access public
//@return array
//
class HTTP_Client_CookieManager {
    constructor() {
        this._cookies = Array();
        this._serializeSessionCookies = false;
    }

    HTTP_Client_CookieManager(serializeSession = false) {
        this.serializeSessionCookies(serializeSession);
    }

    serializeSessionCookies(serialize) {
        this._serializeSessionCookies = Bool(serialize);
    }

    passCookies(request) {
        if (!!this._cookies) //We do not check cookie's "expires" field, as we do not store deleted
            //cookies in the array and our client does not work long enough for other
            //cookies to expire.
            //cookies with longer paths go first
            {
                var url = request.getUrl();
                var cookies = Array();

                for (var cookie of Object.values(this._cookies)) {
                    if (this._domainMatch(url.getHost(), cookie.domain) && 0 === strpos(url.path, cookie.path) && (!cookie.secure || url.protocol == "https")) {
                        cookies[cookie.name][cookie.path.length] = cookie.value;
                    }
                }

                {
                    let _tmp_0 = this._cookies;

                    for (var name in _tmp_0) {
                        var values = _tmp_0[name];
                        request.addCookie(values.name, values.value);
                    }
                }

                for (var name in cookies) {
                    var values = cookies[name];
                    krsort(values);

                    for (var value of Object.values(values)) {
                        request.addCookie(name, value);
                    }
                }
            }

        return true;
    }

    addCookie(cookie) {
        var hash = this._makeHash(cookie.name, cookie.domain, cookie.path);

        this._cookies[hash] = cookie;
    }

    updateCookies(request, responses) {
        var cookies;

        if (false !== (cookies = responses.getCookies())) {
            var url = request.getUrl();

            for (var cookie of Object.values(cookies)) //use the current domain by default
            {
                if (!(undefined !== cookie.domain)) {
                    cookie.domain = url.host;
                }

                if (!cookie.path) {
                    cookie.path = DIRECTORY_SEPARATOR == dirname(url.path) ? "/" : dirname(url.path);
                }

                if (this._domainMatch(url.getHost(), cookie.domain)) //if value is empty or the time is in the past the cookie is deleted, else added
                    {
                        var hash = this._makeHash(cookie.name, cookie.domain, cookie.path);

                        if (cookie.value.length && (!(undefined !== cookie.expires) || strtotime(cookie.expires) > Date.now() / 1000)) {
                            this._cookies[hash] = cookie;
                        } else if (undefined !== this._cookies[hash]) {
                            delete this._cookies[hash];
                        }
                    }
            }
        }
    }

    _makeHash(name, domain, path) {
        return md5(name + "\r\n" + domain + "\r\n" + path);
    }

    _domainMatch(requestHost, cookieDomain) {
        if (requestHost == cookieDomain) {
            return true;
        }

        if (preg_match("/^(?:\\d{1,3}\\.){3}\\d{1,3}$/", requestHost)) {
            return false;
        }

        if ("." != cookieDomain[0]) {
            cookieDomain = "." + cookieDomain;
        }

        if (substr_count(cookieDomain, ".") < 2) {
            return false;
        }

        return ("." + requestHost).substr(-cookieDomain.length) == cookieDomain;
    }

    reset() {
        this._cookies = Array();
    }

    __sleep() {
        if (!this._serializeSessionCookies) {
            {
                let _tmp_1 = this._cookies;

                for (var hash in _tmp_1) {
                    var cookie = _tmp_1[hash];

                    if (!cookie.expires) {
                        delete this._cookies[hash];
                    }
                }
            }
        }

        return ["_cookies", "_serializeSessionCookies"];
    }

    __wakeup() {
        {
            let _tmp_2 = this._cookies;

            for (var hash in _tmp_2) {
                var cookie = _tmp_2[hash];

                if (!!cookie.expires && strtotime(cookie.expires) < Date.now() / 1000) {
                    delete this._cookies[hash];
                }
            }
        }
    }

    getCookies() {
        return this._cookies;
    }

};