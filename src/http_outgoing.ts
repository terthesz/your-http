import { Socket } from 'net';
import { verifyCookie } from './utils';

const kHeaders = Symbol('kHeaders');
const kCookies = Symbol('kCookies');

function OutgoingMessage(this: any, socket: Socket) {
  this.socket = socket;

  this.protocol = 'HTTP/1.1';
  this.statusCode = null;
  this.statusMessage = null;
  this[kHeaders] = {};
  this[kCookies] = [];
  this.body = null;
  this.server = 'The greatest http server in the world.';
  this.lastModified = new Date();

  this.canBeSent = false;
  this.wasSent = false;
}

Object.defineProperty(OutgoingMessage.prototype, 'headers', {
  get: function() {
    return this[kHeaders];
  },
  set: function(val) {
    this[kHeaders] = val;
  }
});

Object.defineProperty(OutgoingMessage.prototype, 'cookies', {
  get: function() {
    return this[kCookies];
  }
});

OutgoingMessage.prototype.status = function status(this: any, code: number) {
  if (this.wasSent) throw 'Cannot change response after it was already send.';

  const statusCode = STATUS_CODES[code];

  if (!statusCode) throw 'Invalid Code.';

  this.statusCode = code;
  this.statusMessage = statusCode;

  this.canBeSent = true;

  return this;
}

OutgoingMessage.prototype.write = function write(this: any, message: string | number | object) {
  if (typeof message != 'string') message = message.toString();
  if (!this.statusCode) this.status(200);

  this.headers['Content-Type'] = 'text';
  this.headers['Content-Length'] = message.length;

  this.body = message;
  
  return this;
}

OutgoingMessage.prototype.json = function json(this: any, message: object) {
  if (!this.statusCode) this.status(200);
  if (typeof message != 'object') throw 'invalid JSON.';

  this.headers['Content-Type'] = 'application/json';
  this.headers['Content-Length'] = JSON.stringify(message).length;

  this.body = JSON.stringify(message);

  return this;
}

OutgoingMessage.prototype.send = function send(this: any, arg: any) {
  const functions: { [key: string]: any } = {
    number: "status",
    object: "json"
  }

  if (functions[typeof arg]) this[functions[typeof arg]](arg);
  else this.write(arg);
}

OutgoingMessage.prototype.setCookie = function setCookie(this: any, key: string, value: string, settings: { [key: string]: any } = {}) {
  verifyCookie(settings);
  this[kCookies].push({
    name: key,
    value,
    settings
  });
}

OutgoingMessage.prototype.setHeader = function setHeader(this: any, key: string, value: string) {
  // TODO: Header verification
  this[kHeaders][key] = value;
  this.rawHeaders.push(key + ": " + value);
}

const STATUS_CODES: { [key: number]: string } = {
  100: 'Continue',                   // RFC 7231 6.2.1
  101: 'Switching Protocols',        // RFC 7231 6.2.2
  102: 'Processing',                 // RFC 2518 10.1 (obsoleted by RFC 4918)
  103: 'Early Hints',                // RFC 8297 2
  200: 'OK',                         // RFC 7231 6.3.1
  201: 'Created',                    // RFC 7231 6.3.2
  202: 'Accepted',                   // RFC 7231 6.3.3
  203: 'Non-Authoritative Information', // RFC 7231 6.3.4
  204: 'No Content',                 // RFC 7231 6.3.5
  205: 'Reset Content',              // RFC 7231 6.3.6
  206: 'Partial Content',            // RFC 7233 4.1
  207: 'Multi-Status',               // RFC 4918 11.1
  208: 'Already Reported',           // RFC 5842 7.1
  226: 'IM Used',                    // RFC 3229 10.4.1
  300: 'Multiple Choices',           // RFC 7231 6.4.1
  301: 'Moved Permanently',          // RFC 7231 6.4.2
  302: 'Found',                      // RFC 7231 6.4.3
  303: 'See Other',                  // RFC 7231 6.4.4
  304: 'Not Modified',               // RFC 7232 4.1
  305: 'Use Proxy',                  // RFC 7231 6.4.5
  307: 'Temporary Redirect',         // RFC 7231 6.4.7
  308: 'Permanent Redirect',         // RFC 7238 3
  400: 'Bad Request',                // RFC 7231 6.5.1
  401: 'Unauthorized',               // RFC 7235 3.1
  402: 'Payment Required',           // RFC 7231 6.5.2
  403: 'Forbidden',                  // RFC 7231 6.5.3
  404: 'Not Found',                  // RFC 7231 6.5.4
  405: 'Method Not Allowed',         // RFC 7231 6.5.5
  406: 'Not Acceptable',             // RFC 7231 6.5.6
  407: 'Proxy Authentication Required', // RFC 7235 3.2
  408: 'Request Timeout',            // RFC 7231 6.5.7
  409: 'Conflict',                   // RFC 7231 6.5.8
  410: 'Gone',                       // RFC 7231 6.5.9
  411: 'Length Required',            // RFC 7231 6.5.10
  412: 'Precondition Failed',        // RFC 7232 4.2
  413: 'Payload Too Large',          // RFC 7231 6.5.11
  414: 'URI Too Long',               // RFC 7231 6.5.12
  415: 'Unsupported Media Type',     // RFC 7231 6.5.13
  416: 'Range Not Satisfiable',      // RFC 7233 4.4
  417: 'Expectation Failed',         // RFC 7231 6.5.14
  418: 'I\'m a Teapot',              // RFC 7168 2.3.3
  421: 'Misdirected Request',        // RFC 7540 9.1.2
  422: 'Unprocessable Entity',       // RFC 4918 11.2
  423: 'Locked',                     // RFC 4918 11.3
  424: 'Failed Dependency',          // RFC 4918 11.4
  425: 'Too Early',                  // RFC 8470 5.2
  426: 'Upgrade Required',           // RFC 2817 and RFC 7231 6.5.15
  428: 'Precondition Required',      // RFC 6585 3
  429: 'Too Many Requests',          // RFC 6585 4
  431: 'Request Header Fields Too Large', // RFC 6585 5
  451: 'Unavailable For Legal Reasons', // RFC 7725 3
  500: 'Internal Server Error',      // RFC 7231 6.6.1
  501: 'Not Implemented',            // RFC 7231 6.6.2
  502: 'Bad Gateway',                // RFC 7231 6.6.3
  503: 'Service Unavailable',        // RFC 7231 6.6.4
  504: 'Gateway Timeout',            // RFC 7231 6.6.5
  505: 'HTTP Version Not Supported', // RFC 7231 6.6.6
  506: 'Variant Also Negotiates',    // RFC 2295 8.1
  507: 'Insufficient Storage',       // RFC 4918 11.5
  508: 'Loop Detected',              // RFC 5842 7.2
  509: 'Bandwidth Limit Exceeded',
  510: 'Not Extended',               // RFC 2774 7
  511: 'Network Authentication Required' // RFC 6585 6
};

export { OutgoingMessage };