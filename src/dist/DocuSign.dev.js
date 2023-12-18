"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactToastify = require("react-toastify");

var _anchorfields = _interopRequireDefault(require("./assets/anchorfields.pdf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var docName = 'anchorfields.pdf';
var sdkString = 'codeEg_react';
var urlFrag = '/restapi/v2.1'; // DocuSign specific

/**
 * Asset files
 * Add assets (eg PDF files) to the top level public directory.
 * (NOT under /src.) They will be included with the packaged app.
 *
 */

var DocuSign =
/*#__PURE__*/
function () {
  //
  // constructor for the class
  //
  function DocuSign(app) {
    _classCallCheck(this, DocuSign);

    this.app = app;
    this.sendEnvelope = this.sendEnvelope.bind(this);
  } //
  // Instance methods
  //

  /**
   * Send an envelope, return results or error
   */


  _createClass(DocuSign, [{
    key: "sendEnvelope",
    value: function sendEnvelope(chk) {
      var reader, base64File, envelopeRequest, url, response, data, result, headers, availableApiReqHeader, availableApiRequests, apiResetHeader, apiRequestsReset, traceId, errorMsg;
      return regeneratorRuntime.async(function sendEnvelope$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              reader = new FileReader();
              _context.next = 3;
              return regeneratorRuntime.awrap(new Promise(function (resolve) {
                reader.onloadend = resolve;
                reader.readAsDataURL(chk);
              }));

            case 3:
              base64File = reader.result.split(',')[1];
              envelopeRequest = {
                emailSubject: 'Please sign the attached document',
                status: 'sent',
                recipients: {
                  signers: [{
                    email: this.app.state.formEmail,
                    name: this.app.state.formName,
                    recipientId: '1',
                    tabs: {
                      signHereTabs: [{
                        anchorString: '/sn1/',
                        anchorXOffset: '20',
                        anchorUnits: 'pixels'
                      }]
                    }
                  }]
                },
                documents: [{
                  name: docName,
                  fileExtension: 'pdf',
                  documentId: '1',
                  documentBase64: base64File
                }]
              };
              _context.prev = 5;
              url = "".concat(this.app.state.baseUri).concat(urlFrag) + "/accounts/".concat(this.app.state.accountId) + "/envelopes";
              _context.next = 9;
              return regeneratorRuntime.awrap(fetch(url, {
                method: 'POST',
                body: JSON.stringify(envelopeRequest),
                headers: new Headers({
                  Authorization: "Bearer ".concat(this.app.state.accessToken),
                  Accept: "application/json",
                  'Content-Type': 'application/json',
                  'X-DocuSign-SDK': sdkString
                })
              }));

            case 9:
              response = _context.sent;
              _context.t0 = response && response.ok;

              if (!_context.t0) {
                _context.next = 15;
                break;
              }

              _context.next = 14;
              return regeneratorRuntime.awrap(response.json());

            case 14:
              _context.t0 = _context.sent;

            case 15:
              data = _context.t0;
              headers = response.headers;
              availableApiReqHeader = headers.get('X-RateLimit-Remaining');
              availableApiRequests = availableApiReqHeader ? parseInt(availableApiReqHeader, 10) : undefined;
              apiResetHeader = headers.get('X-RateLimit-Reset');
              apiRequestsReset = apiResetHeader ? new Date(parseInt(apiResetHeader, 10) * 1000) : undefined;
              traceId = headers.get('X-DocuSign-TraceToken') || undefined;

              if (!response.ok) {
                _context.next = 26;
                break;
              }

              result = {
                success: true,
                errorMsg: undefined,
                envelopeId: data.envelopeId,
                availableApiRequests: availableApiRequests,
                apiRequestsReset: apiRequestsReset,
                traceId: traceId
              };
              _context.next = 37;
              break;

            case 26:
              _context.t1 = response;

              if (!_context.t1) {
                _context.next = 31;
                break;
              }

              _context.next = 30;
              return regeneratorRuntime.awrap(response.text());

            case 30:
              _context.t1 = _context.sent;

            case 31:
              _context.t2 = _context.t1;
              _context.t3 = undefined;
              _context.t4 = availableApiRequests;
              _context.t5 = apiRequestsReset;
              _context.t6 = traceId;
              result = {
                success: false,
                errorMsg: _context.t2,
                envelopeId: _context.t3,
                availableApiRequests: _context.t4,
                apiRequestsReset: _context.t5,
                traceId: _context.t6
              };

            case 37:
              return _context.abrupt("return", result);

            case 40:
              _context.prev = 40;
              _context.t7 = _context["catch"](5);
              // Unfortunately we don't have access to the real
              // networking problem!
              // See https://medium.com/to-err-is-aaron/detect-network-failures-when-using-fetch-40a53d56e36
              errorMsg = _context.t7.message === 'Failed to fetch' ? 'Networking error—check your Internet and DNS connections' : _context.t7.message;
              return _context.abrupt("return", {
                success: false,
                errorMsg: errorMsg,
                envelopeId: undefined,
                availableApiRequests: undefined,
                apiRequestsReset: undefined,
                traceId: undefined
              });

            case 44:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[5, 40]]);
    }
    /**
     * Get envelope's status, return results or error
     */

  }, {
    key: "getEnvelope",
    value: function getEnvelope() {
      var url, response, data, result, headers, availableApiReqHeader, availableApiRequests, apiResetHeader, apiRequestsReset, traceId, errorMsg;
      return regeneratorRuntime.async(function getEnvelope$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              url = "".concat(this.app.state.baseUri).concat(urlFrag) + "/accounts/".concat(this.app.state.accountId) + "/envelopes/".concat(this.app.state.responseEnvelopeId);
              _context2.next = 4;
              return regeneratorRuntime.awrap(fetch(url, {
                method: 'GET',
                headers: new Headers({
                  Authorization: "Bearer ".concat(this.app.state.accessToken),
                  Accept: "application/json",
                  'Content-Type': 'application/json',
                  'X-DocuSign-SDK': sdkString
                })
              }));

            case 4:
              response = _context2.sent;
              _context2.t0 = response && response.ok;

              if (!_context2.t0) {
                _context2.next = 10;
                break;
              }

              _context2.next = 9;
              return regeneratorRuntime.awrap(response.json());

            case 9:
              _context2.t0 = _context2.sent;

            case 10:
              data = _context2.t0;
              headers = response.headers;
              availableApiReqHeader = headers.get('X-RateLimit-Remaining');
              availableApiRequests = availableApiReqHeader ? parseInt(availableApiReqHeader, 10) : undefined;
              apiResetHeader = headers.get('X-RateLimit-Reset');
              apiRequestsReset = apiResetHeader ? new Date(parseInt(apiResetHeader, 10) * 1000) : undefined;
              traceId = headers.get('X-DocuSign-TraceToken') || undefined;

              if (!response.ok) {
                _context2.next = 21;
                break;
              }

              result = {
                success: true,
                errorMsg: undefined,
                resultsEnvelopeJson: data,
                availableApiRequests: availableApiRequests,
                apiRequestsReset: apiRequestsReset,
                traceId: traceId
              };
              _context2.next = 32;
              break;

            case 21:
              _context2.t1 = response;

              if (!_context2.t1) {
                _context2.next = 26;
                break;
              }

              _context2.next = 25;
              return regeneratorRuntime.awrap(response.text());

            case 25:
              _context2.t1 = _context2.sent;

            case 26:
              _context2.t2 = _context2.t1;
              _context2.t3 = undefined;
              _context2.t4 = availableApiRequests;
              _context2.t5 = apiRequestsReset;
              _context2.t6 = traceId;
              result = {
                success: false,
                errorMsg: _context2.t2,
                resultsEnvelopeJson: _context2.t3,
                availableApiRequests: _context2.t4,
                apiRequestsReset: _context2.t5,
                traceId: _context2.t6
              };

            case 32:
              return _context2.abrupt("return", result);

            case 35:
              _context2.prev = 35;
              _context2.t7 = _context2["catch"](0);
              // Unfortunately we don't have access to the real
              // networking problem!
              // See https://medium.com/to-err-is-aaron/detect-network-failures-when-using-fetch-40a53d56e36
              errorMsg = _context2.t7.message === 'Failed to fetch' ? 'Networking error—check your Internet and DNS connections' : _context2.t7.message;
              return _context2.abrupt("return", {
                success: false,
                errorMsg: errorMsg,
                resultsEnvelopeJson: undefined,
                availableApiRequests: undefined,
                apiRequestsReset: undefined,
                traceId: undefined
              });

            case 39:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 35]]);
    }
  }]);

  return DocuSign;
}();

var _default = DocuSign;
exports["default"] = _default;