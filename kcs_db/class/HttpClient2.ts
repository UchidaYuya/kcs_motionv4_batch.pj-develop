//HTTP_Request2用HTTP_Client

import HTTP_Client_CookieManager from './HttpClientCookieManager2';
const fetch = require('node-fetch');

export default class HTTP_Client {
    _defaultHeaders:{ [key: string]: any } = {} ;
    _defaultRequestParams: { [key: string]: any } = {};
    _redirectCount: number;
    _listeners: any[];
    _isHistoryEnabled: boolean;
    _idx: number;
    _maxRedirects: number;
    _propagate: any[];
    _config: { [key: string]: any };
    _cookieManager: HTTP_Client_CookieManager;
    _response: any;
    _user: any;
    _pass: any;
    head: any;
    constructor(config:{ [key: string]: any }, defaultRequestParams:{ [key: string]: any } | undefined = undefined, defaultHeaders:{ [key: string]: any } | undefined = undefined, cookieManager: HTTP_Client_CookieManager | undefined = undefined) {
        if(defaultHeaders){
            this._defaultHeaders = defaultHeaders;
        }
        if(defaultRequestParams)
        {
            this._defaultRequestParams = defaultRequestParams;
        }
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
            this.setDefaultHeaderA(defaultHeaders);
        }

        if (undefined !== defaultRequestParams) {
            this.setRequestParameterA(defaultRequestParams);
        }
    }

    async get(url:string, params: any, headers: any = undefined) {
        const request = this._createRequest(url, "GET", headers, params);
        return await this._performRequest(request);
    }

    async post(url:string, params: any , preEncoded:boolean =  false, files: any = undefined, headers: any = undefined) //filesは無効になっているので注意
    {
        const request = this._createRequest(url, "POST", headers, params);
        return await this._performRequest(request);
    }

    currentResponse() {
        return this._response;
    }

    setDefaultHeaderA(name:{ [key: string]: any }) {
        this._defaultHeaders = {...this._defaultHeaders , ...name};
    }

    setDefaultHeader(name:string , value:string="") {
        // if (Array.isArray(name)) {
        //     //this._defaultHeaders = this._defaultHeaders.concat(name);
        //     this._defaultHeaders = {...this._defaultHeaders , ...name};
        // } else if(name instanceof string) {
        //     this._defaultHeaders[name] = value;
        // }
        this._defaultHeaders[name] = value;
    }

    getDefaultHeader() {
        return this._defaultHeaders;
    }

    getCookieManager() {
        return this._cookieManager;
    }

    setRequestParameterA(name:{ [key: string]: any }) {
        this._defaultRequestParams = {...this._defaultRequestParams , ...name};
    }

    setRequestParameter(name:string, value:string) {
        // if (Array.isArray(name)) {
        //     this._defaultRequestParams = this._defaultRequestParams.concat(name);
        // } else {
        //     this._defaultRequestParams[name] = value;
        // }
        this._defaultRequestParams[name] = value;
    }

    setMaxRedirects(value) {
        this._maxRedirects = value;
    }

    _notify(event, data = undefined) {
        for (var id of Object.values(Object.keys(this._listeners))) {
            this._listeners[id].update(this, event, data);
        }
    }

    _createRequest(url, method, headers, params) {
        let options : any = {};
        options.method = method;
        if(headers){
            options.headers = headers;
        }

        if(params){
          //  options.body = new URLSearchParams(params);
        }

        return fetch(url, options);
    }

    async _performRequest(request) //If this is not a redirect, notify the listeners of new request
    {
        const response = await request;
        const data = await response.json();

        return response.status;
    }

    _getMetaRedirect(responses) //Non-HTML response or empty response body
    {
        // if ("text/html" != responses.getHeader("content-type").substr(0, 9) || "" == (body = responses.getBody())) {
        //     return undefined;
        // }

        // var matches = body.match("!<meta\\s+([^>]*http-equiv\\s*=\\s*(\"Refresh\"|'Refresh'|Refresh)[^>]*)>!is")
        // if (!matches) {
        //     return undefined;
        // }

        // var urlMatches = matches[1].match("!content\\s*=\\s*(\"[^\"]+\"|'[^']+'|\\S+)!is");
        // if (!urlMatches) {
        //     return undefined;
        // }

        // var parts = ("'" == urlMatches[1].substr(0, 1) || "\"" == urlMatches[1].substr(0, 1) ? urlMatches[1].substr(1, -1) : urlMatches[1]).split(";");

        // var urlMatches = parts[1].match("/url\\s*=\\s*(\"[^\"]+\"|'[^']+'|\\S+)/is");
        // if (!parts[1] || !urlMatches) {
        //     return undefined;
        // }

        // var url = "'" == urlMatches[1].substr(0, 1) || "\"" == urlMatches[1].substr(0, 1) ? urlMatches[1].substr(1, -1) : urlMatches[1];
        // var previousUrl = responses.getEffectiveUrl();

        // var redirectUrl = this._redirectUrl(responses.getEffectiveUrl(), html_entity_decode(url));

        // return undefined === redirectUrl || redirectUrl == previousUrl ? undefined : redirectUrl;
    }

    _redirectUrl(url, location) //If it begins with a scheme (as defined in RFC 2396) then it is absolute URI
    {
        // var matches = location.match("/^([a-zA-Z][a-zA-Z0-9+.-]*):/");
        // if (matches) //Bug #5759: we shouldn't try to follow non-HTTP redirects
        //     {
        //         if ("http" == matches[1].toLowerCase() || "https" == matches[1].toLowerCase()) {
        //             return location;
        //         } else {
        //             return undefined;
        //         }
        //     } else {
        //     if ("/" == location[0]) {
        //         url.path = Net_URL.resolvePath(location);
        //     } else if ("/" == url.path.substr(-1)) {
        //         url.path = Net_URL.resolvePath(url.path + location);
        //     } else {
        //         var dirname = DIRECTORY_SEPARATOR == dirname(url.path) ? "/" : dirname(url.path);
        //         url.path = Net_URL.resolvePath(dirname + "/" + location);
        //     }

        //     url.querystring = Array();
        //     url.anchor = "";
        //     return url.getUrl();
        // }
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
