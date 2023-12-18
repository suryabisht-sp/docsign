"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactToastify = require("react-toastify");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var oauthResponseHtml = 'oauthResponse.html'; // only used for new tab auth

var expirationBuffer = 10 * 60; // 10 minute buffer

var sdkString = 'codeEg_react';
var urlFrag = '/restapi/v2.1'; // DocuSign specific

var log = function log(m) {
  console.log(m);
};

var oauthState = 'oauthState'; // The name of the localStorage item for the OAuth state parameter

var OAuthImplicit =
/*#__PURE__*/
function () {
  _createClass(OAuthImplicit, null, [{
    key: "generateId",
    //
    // Static methods
    //

    /**
     * Generate a psuedo random string
     * See https://stackoverflow.com/a/27747377/64904
     * @param {integer} len  length of the returned string
     */
    value: function generateId() {
      var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 40;
      // dec2hex :: Integer -> String i.e. 0-255 -> '00'-'ff'
      var arr = new Uint8Array((len || 40) / 2);

      function dec2hex(dec) {
        return "0".concat(dec.toString(16)).substr(-2);
      }

      window.crypto.getRandomValues(arr);
      return Array.from(arr, dec2hex).join('');
    } //
    // constructor for the class
    //

  }]);

  function OAuthImplicit(app) {
    _classCallCheck(this, OAuthImplicit);

    this.app = app;
    this.oauthWindow = null; // only used for new tab auth
  }
  /**
   * Handle incoming OAuth Implicit grant response
   */


  _createClass(OAuthImplicit, [{
    key: "receiveHash",
    value: function receiveHash(hash) {
      var config, accessTokenFound, hashRegex, accessTokenUrl, scopeValue, newScopeValue, newAccessTokenUrl, oauthStateValue, regex, results, accessToken, expiresIn, expires, toastId, userInfo, defaultAccountArray, defaultAccount, msg, baseUri, externalAccountId;
      return regeneratorRuntime.async(function receiveHash$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              config = window.config;
              accessTokenFound = hash && hash.substring(0, 14) === '#access_token=';

              if (accessTokenFound) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return");

            case 4:
              // EARLY RETURN
              hashRegex = /[^#.\-&=_a-zA-Z0-9]/;
              accessTokenUrl = hash; // Extract the scope parameter value

              scopeValue = accessTokenUrl.match(/scope=([^&]+)/)[1]; // Decode the URL-encoded string and replace space with hyphen

              newScopeValue = decodeURIComponent(scopeValue).replace(/%20/g, "-"); // Replace the old scope value with the new one

              newAccessTokenUrl = accessTokenUrl.replace(/scope=([^&]+)/, "scope=" + encodeURIComponent(newScopeValue));

              if (!(newAccessTokenUrl.search(hashRegex) !== -1)) {
                _context.next = 13;
                break;
              }

              console.error("Potential XSS attack via fragment (#) value: ".concat(newAccessTokenUrl));

              _reactToastify.toast.error('Potential XSS attack via the fragment value. Please login again.', {
                autoClose: 7000
              });

              return _context.abrupt("return");

            case 13:
              oauthStateValue = window.localStorage.getItem(oauthState);
              regex = /(#access_token=)(.*)(&expires_in=)(.*)(&token_type=)(.*)(&state=)(.*)/, results = regex.exec(newAccessTokenUrl), accessToken = results[2], expiresIn = results[4]; // if (!stateOk) {
              //     toast.error('State error during login. Please login again.', {
              //         autoClose: 10000});
              //     console.error(`OAuth state mismatch!! Expected state: ${oauthStateValue}; received state: ${incomingState}`);
              //     return // EARLY RETURN
              // }

              window.localStorage.clear(); // clean up

              if (config.DS_REDIRECT_AUTHENTICATION) {// Using redirect the window authentication:
                // hash was good, so erase it from the browser
                // window.history.replaceState(null, '', config.DS_APP_URL);
              } else {
                // Using new tab authentication:
                // close the tab that was used for authentication
                if (this.oauthWindow) {
                  this.oauthWindow.close();
                }
              } // calculate expires


              expires = new Date();
              expires.setTime(expires.getTime() + (expiresIn - expirationBuffer) * 1000);
              this.accessToken = accessToken;
              toastId = _reactToastify.toast.success('Completing the login process...', {
                autoClose: 7000
              }); // call /oauth/userinfo for general user info
              // This API method is common for many IdP systems.
              // But the exact format of the response tends to vary.
              // The following works for the DocuSign IdP.

              _context.next = 23;
              return regeneratorRuntime.awrap(this.fetchUserInfo());

            case 23:
              userInfo = _context.sent;
              // console.log("user info", userInfo)
              defaultAccountArray = userInfo.accounts.filter(function (acc) {
                return acc.is_default;
              });
              defaultAccount = defaultAccountArray.length > 0 && defaultAccountArray[0];

              if (defaultAccount) {
                _context.next = 31;
                break;
              }

              msg = "Problem: the user does not have a default account. Contact DocuSign Customer Service to fix.";
              log(msg);

              _reactToastify.toast.error(msg, {
                autoClose: 10000
              });

              return _context.abrupt("return");

            case 31:
              // 
              // Need to select the right proxy for the API call
              // update the baseUri setting
              baseUri = 'https://demo.docusign.net'; // let baseUri = config.DS_API_CORS_PROXIES[defaultAccount.base_uri];
              // if (!baseUri) {
              //     const msg = `Problem: no proxy for ${defaultAccount.base_uri}.`;
              //     log(msg);
              //     toast.error(msg, { autoClose: 10000 });
              //     return; 
              // }

              _context.next = 34;
              return regeneratorRuntime.awrap(this.getExternalAccountId(defaultAccount.account_id, baseUri));

            case 34:
              externalAccountId = _context.sent;

              _reactToastify.toast.dismiss(toastId);

              this.app.oAuthResults({
                accessToken: accessToken,
                expires: expires,
                name: userInfo.name,
                email: userInfo.email,
                accountId: defaultAccount.account_id,
                externalAccountId: externalAccountId,
                accountName: defaultAccount.account_name,
                baseUri: baseUri
              });

            case 37:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
    /**
     * Start the login flow by computing the Implicit grant URL
     * and either redirecting to the URL for the user or
     * creating a new browser tab for the authentication flow
     */

  }, {
    key: "startLogin",
    value: function startLogin() {
      var config = window.config;
      var oauthStateValue = OAuthImplicit.generateId();
      window.localStorage.setItem(oauthState, oauthStateValue); // store for when we come back

      var redirectUrl;

      if (config.DS_REDIRECT_AUTHENTICATION) {
        // Using redirect the window authentication:
        redirectUrl = config.DS_APP_URL;
      } else {
        // Using new tab authentication
        redirectUrl = "".concat(config.DS_APP_URL);
      } // for implicit grant


      var url = "".concat(window.config.DS_IDP, "/oauth/auth?") + "response_type=token&" + "scope=".concat(window.config.IMPLICIT_SCOPES, "&") + "client_id=".concat(window.config.DS_CLIENT_ID, "&") + "state=".concat(oauthStateValue, "&") + "redirect_uri=".concat(encodeURIComponent(redirectUrl)); //for authorisation grant
      // const url =
      //     `${window.config.DS_IDP}/oauth/auth?` +
      //     `response_type=code&` +
      //     `scope=${window.config.IMPLICIT_SCOPES}&` +
      //     `client_id=${window.config.DS_CLIENT_ID}&` +
      //     `state=${oauthStateValue}&` +
      //     `redirect_uri=${encodeURIComponent(redirectUrl)}`;

      if (config.DS_REDIRECT_AUTHENTICATION) {
        // Using redirect the window authentication:
        window.location = url;
      } else {
        // Using new tab authentication:
        // Create a new tab for authentication
        this.oauthWindow = window.open(url, "_blank");
      }
    }
    /**
     * logout of the DocuSign IdP. 
     * If SSO is used, the upstream IdP may not redirect the 
     * browser back to this app
     */

  }, {
    key: "logout",
    value: function logout() {
      var config = window.config;
      var url = "".concat(window.config.DS_IDP, "/logout?") + "response_type=token&" + "scope=".concat(config.IMPLICIT_SCOPES, "&") + "client_id=".concat(config.DS_CLIENT_ID, "&") + "redirect_uri=".concat(encodeURIComponent(config.DS_APP_URL), "&") + "response_mode=logout_redirect";
      window.location = url;
    }
    /**
     * A relatively common OAuth API endpoint for obtaining information
     * on the user associated with the accessToken
     * @returns userInfoResponse JSON 
     */

  }, {
    key: "fetchUserInfo",
    value: function fetchUserInfo() {
      var userInfoResponse, msg, _msg;

      return regeneratorRuntime.async(function fetchUserInfo$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(fetch("".concat(window.config.DS_IDP, "/oauth/userinfo"), {
                headers: new Headers({
                  Authorization: "Bearer ".concat(this.accessToken),
                  Accept: "application/json",
                  'X-DocuSign-SDK': sdkString
                })
              }));

            case 3:
              userInfoResponse = _context2.sent;
              _context2.next = 12;
              break;

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              msg = "Problem while completing login.\nPlease retry.\nError: ".concat(_context2.t0.toString());
              log(msg);

              _reactToastify.toast.error(msg, {
                autoClose: 10000
              });

              return _context2.abrupt("return", null);

            case 12:
              if (!(!userInfoResponse || !userInfoResponse.ok)) {
                _context2.next = 17;
                break;
              }

              _msg = "Problem while completing login.\nPlease retry.\nError: ".concat(userInfoResponse.statusText);
              log(_msg);

              _reactToastify.toast.error(_msg, {
                autoClose: 10000
              });

              return _context2.abrupt("return", null);

            case 17:
              _context2.next = 19;
              return regeneratorRuntime.awrap(userInfoResponse.json());

            case 19:
              return _context2.abrupt("return", _context2.sent);

            case 20:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 6]]);
    }
    /**
     * Fetch the user-friendly version of the accountId.
     * See https://developers.docusign.com/docs/esign-rest-api/reference/accounts/accounts/get/
     */

  }, {
    key: "getExternalAccountId",
    value: function getExternalAccountId(accountId, baseUri) {
      var url, response, data;
      return regeneratorRuntime.async(function getExternalAccountId$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              url = "".concat(baseUri).concat(urlFrag, "/accounts/").concat(accountId);
              _context3.next = 4;
              return regeneratorRuntime.awrap(fetch(url, {
                method: 'GET',
                headers: new Headers({
                  Authorization: "Bearer ".concat(this.accessToken),
                  Accept: "application/json",
                  'X-DocuSign-SDK': sdkString
                })
              }));

            case 4:
              response = _context3.sent;
              _context3.t0 = response && response.ok;

              if (!_context3.t0) {
                _context3.next = 10;
                break;
              }

              _context3.next = 9;
              return regeneratorRuntime.awrap(response.json());

            case 9:
              _context3.t0 = _context3.sent;

            case 10:
              data = _context3.t0;
              return _context3.abrupt("return", data.externalAccountId);

            case 14:
              _context3.prev = 14;
              _context3.t1 = _context3["catch"](0);
              return _context3.abrupt("return", null);

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[0, 14]]);
    }
  }]);

  return OAuthImplicit;
}();

var _default = OAuthImplicit;
exports["default"] = _default;