//
//HTTP_Request2用HTTP_Client
//
//更新履歴：<br>
//2011/08/18 上杉勝史 作成
//
//@package Base
//@subpackage HTTP
//@author katsushi
//@since 2011/08/18
//@filesource
//@uses HTTP_Request2
//
//
//
//メール送信クラスライブラリ
//
//@package Base
//@subpackage HTTP
//@author katsushi
//@since 2011/08/18
//

require("HTTP/Request2.php");

require("HttpClientCookieManager2.php");

//
//__construct
//
//@author houshiyama
//@since 2011/08/18
//
//@param mixed $config
//@access public
//@return void
//
//
//get
//
//@author houshiyama
//@since 2011/08/18
//
//@param mixed $url
//@param mixed $param
//@access public
//@return void
//
//
//post
//
//@author houshiyama
//@since 2011/08/18
//
//@param mixed $url
//@param mixed $param
//@access public
//@return void
//
//
//currentResponse
//
//@author houshiyama
//@since 2011/08/18
//
//@access public
//@return void
//
//
//setDefaultHeader
//
//@author houshiyama
//@since 2011/08/24
//
//@param mixed $name
//@param mixed $value
//@access public
//@return void
//
//
//getDefaultHeader
//
//@author morihara
//@since 2011/09/09
//
//@access public
//@return array
//
//
//getCookieManager
//
//@author morihara
//@since 2011/09/09
//
//@access public
//@return HTTP_Client_CookieManager
//
//
//setRequestParameter
//
//@author houshiyama
//@since 2011/08/25
//
//@param mixed $name
//@param mixed $value
//@access public
//@return void
//
//
//setMaxRedirects
//
//@author houshiyama
//@since 2011/08/25
//
//@param mixed $value
//@access public
//@return void
//
//
//_notify
//
//@author houshiyama
//@since 2011/08/24
//
//@param mixed $event
//@param mixed $data
//@access protected
//@return void
//
//
//&_createRequest
//
//@author houshiyama
//@since 2011/08/25
//
//@param mixed $url
//@param mixed $method
//@param array $headers
//@access public
//@return void
//
//
//_performRequest
//
//@author houshiyama
//@since 2011/08/24
//
//@param mixed $request
//@access private
//@return void
//
//
//_getMetaRedirect
//
//@author houshiyama
//@since 2011/08/25
//
//@param mixed $responses
//@access protected
//@return void
//
//
//_redirectUrl
//
//@author houshiyama
//@since 2011/08/25
//
//@param mixed $url
//@param mixed $location
//@access protected
//@return void
//
//
//_pushResponse
//
//@author houshiyama
//@since 2011/08/24
//
//@param mixed $request
//@access protected
//@return void
//
//
//setAuth
//
//@author web
//@since 2013/06/18
//
//@param mixed $user
//@param mixed $pass
//@access public
//@return void
//
class HTTP_Client {
    constructor(config = undefined, defaultRequestParams = undefined, defaultHeaders = undefined, cookieManager = undefined) {
        this._defaultHeaders = Array();
        this._defaultRequestParams = Array();
        this._redirectCount = 0;
        this._listeners = Array();
        this._isHistoryEnabled = true;
        this._idx = 0;
        this._maxRedirects = 5;
        this._propagate = Array();
        this._config = config;

        if (!!cookieManager && cookieManager instanceof HTTP_Client_CookieManager) {
            this._cookieManager = cookieManager;
        } else {
            this._cookieManager = new HTTP_Client_CookieManager();
        }

        if (defaultHeaders) {
            this.setDefaultHeader(defaultHeaders);
        }

        if (undefined !== defaultRequestParams) {
            this.setRequestParameter(defaultRequestParams);
        }
    }

    get(url, param = undefined, headers = Array()) {
        var request = this._createRequest(url, HTTP_Request2.METHOD_GET, headers);

        if (!!param) {
            var getparams = http_build_query(param);
            request.setUrl(url + "?" + getparams);
        }

        return this._performRequest(request);
    }

    post(url, param, preEncoded = false, files = Array(), headers = Array()) //filesは無効になっているので注意
    //preEncodedも無効になっている
    {
        var request = this._createRequest(url, HTTP_Request2.METHOD_POST, headers);

        if (Array.isArray(param)) {
            for (var name in param) {
                var value = param[name];
                request.addPostParameter(name, value);
            }
        } else {
            request.setBody(param);
        }

        return this._performRequest(request);
    }

    currentResponse() {
        return this._response;
    }

    setDefaultHeader(name, value = undefined) {
        if (Array.isArray(name)) {
            this._defaultHeaders = array_merge(this._defaultHeaders, name);
        } else {
            this._defaultHeaders[name] = value;
        }
    }

    getDefaultHeader() {
        return this._defaultHeaders;
    }

    getCookieManager() {
        return this._cookieManager;
    }

    setRequestParameter(name, value = undefined) {
        if (Array.isArray(name)) {
            this._defaultRequestParams = array_merge(this._defaultRequestParams, name);
        } else {
            this._defaultRequestParams[name] = value;
        }
    }

    setMaxRedirects(value) {
        this._maxRedirects = value;
    }

    _notify(event, data = undefined) {
        for (var id of Object.values(Object.keys(this._listeners))) {
            this._listeners[id].update(this, event, data);
        }
    }

    _createRequest(url, method = HTTP_Request2.METHOD_GET, headers = Array()) {
        var request = new HTTP_Request2(url, method);

        if (!!this._user && !!this._pass) {
            request.setAuth(this._user, this._pass);
        }

        request.setCookieJar();
        var cookieJar = request.getCookieJar();
        var cookies = cookieJar.getMatching(request.getUrl());
        request.setConfig(this._config);
        {
            let _tmp_0 = this._defaultHeaders;

            for (var name in _tmp_0) {
                var value = _tmp_0[name];
                request.setHeader(name, value);
            }
        }

        for (var name in headers) {
            var value = headers[name];
            request.setHeader(name, value);
        }

        this._cookieManager.passCookies(request);

        {
            let _tmp_1 = this._propagate;

            for (var id in _tmp_1) {
                var propagate = _tmp_1[id];

                if (propagate) {
                    request.attach(this._listeners[id]);
                }
            }
        }
        return request;
    }

    _performRequest(request) //If this is not a redirect, notify the listeners of new request
    {
        if (0 == this._redirectCount && "" != request.getUrl()) {
            this._notify("request", request.getUrl());
        }

        var responses = request.send();

        if (PEAR.isError(responses)) {
            this._redirectCount = 0;
            return err;
        }

        this._pushResponse(request, responses);

        var code = responses.getStatus();

        if (this._maxRedirects > 0) {
            if (-1 !== [300, 301, 302, 303, 307].indexOf(code)) {
                var location;

                if ("" == (location = responses.getHeader("Location"))) {
                    this._redirectCount = 0;
                    return PEAR.raiseError("No 'Location' field on redirect");
                }

                if (undefined === (redirectUrl = this._redirectUrl(responses.getEffectiveUrl(), location))) {
                    this._redirectCount = 0;
                    return code;
                }
            } else if (200 <= code && code < 300) {
                redirectUrl = this._getMetaRedirect(responses);
            }
        }

        if (!!redirectUrl) //we access the private properties directly, as there are no accessors for them
            {
                if (++this._redirectCount > this._maxRedirects) {
                    this._redirectCount = 0;
                    return PEAR.raiseError("Too many redirects");
                }

                this._notify("httpRedirect", redirectUrl);

                switch (request.getMethod()) {
                    case HTTP_REQUEST2.METHOD_POST:
                        if (302 == code || 303 == code || code < 300 || 301 == code && "undefined" !== typeof HTTP_CLIENT_QUIRK_MODE) {
                            return this.get(redirectUrl);
                        } else if (!!request._postData || !!request._postFiles) {
                            var postFiles = Array();
                            {
                                let _tmp_2 = request._postFiles;

                                for (var name in _tmp_2) {
                                    var data = _tmp_2[name];
                                    postFiles.push([name, data.name, data.type]);
                                }
                            }
                            return this.post(redirectUrl, request._postData, true, postFiles);
                        } else {
                            return this.post(redirectUrl, request._body, true);
                        }

                    case HTTP_REQUEST2.METHOD_HEAD:
                        return 303 == code ? this.get(redirectUrl) : this.head(redirectUrl);

                    case HTTP_REQUEST2.METHOD_GET:
                    default:
                        return this.get(redirectUrl);
                }
            } else {
            this._redirectCount = 0;

            if (400 >= code) //some result processing should go here
                {
                    this._notify("httpSuccess");

                    this.setDefaultHeader("Referer", request.getUrl());
                } else {
                this._notify("httpError");
            }
        }

        return code;
    }

    _getMetaRedirect(responses) //Non-HTML response or empty response body
    //We do finally have an url... Now check that it's:
    //a) HTTP, b) not to the same page
    {
        var body;

        if ("text/html" != responses.getHeader("content-type").substr(0, 9) || "" == (body = responses.getBody())) {
            return undefined;
        }

        if (!preg_match("!<meta\\s+([^>]*http-equiv\\s*=\\s*(\"Refresh\"|'Refresh'|Refresh)[^>]*)>!is", body, matches)) {
            return undefined;
        }

        if (!preg_match("!content\\s*=\\s*(\"[^\"]+\"|'[^']+'|\\S+)!is", matches[1], urlMatches)) {
            return undefined;
        }

        var parts = ("'" == urlMatches[1].substr(0, 1) || "\"" == urlMatches[1].substr(0, 1) ? urlMatches[1].substr(1, -1) : urlMatches[1]).split(";");

        if (!parts[1] || !preg_match("/url\\s*=\\s*(\"[^\"]+\"|'[^']+'|\\S+)/is", parts[1], urlMatches)) {
            return undefined;
        }

        var url = "'" == urlMatches[1].substr(0, 1) || "\"" == urlMatches[1].substr(0, 1) ? urlMatches[1].substr(1, -1) : urlMatches[1];
        var previousUrl = responses.getEffectiveUrl();

        var redirectUrl = this._redirectUrl(responses.getEffectiveUrl(), html_entity_decode(url));

        return undefined === redirectUrl || redirectUrl == previousUrl ? undefined : redirectUrl;
    }

    _redirectUrl(url, location) //If it begins with a scheme (as defined in RFC 2396) then it is absolute URI
    {
        if (preg_match("/^([a-zA-Z][a-zA-Z0-9+.-]*):/", location, matches)) //Bug #5759: we shouldn't try to follow non-HTTP redirects
            {
                if ("http" == matches[1].toLowerCase() || "https" == matches[1].toLowerCase()) {
                    return location;
                } else {
                    return undefined;
                }
            } else {
            if ("/" == location[0]) {
                url.path = Net_URL.resolvePath(location);
            } else if ("/" == url.path.substr(-1)) {
                url.path = Net_URL.resolvePath(url.path + location);
            } else {
                var dirname = DIRECTORY_SEPARATOR == dirname(url.path) ? "/" : dirname(url.path);
                url.path = Net_URL.resolvePath(dirname + "/" + location);
            }

            url.querystring = Array();
            url.anchor = "";
            return url.getUrl();
        }
    }

    _pushResponse(request, responses) {
        this._cookieManager.updateCookies(request, responses);

        this._response = {
            url: responses.getEffectiveUrl(),
            code: responses.getStatus(),
            headers: responses.getHeader(),
            body: responses.getBody()
        };
    }

    setAuth(user, pass) {
        this._user = user;
        this._pass = pass;
    }

};