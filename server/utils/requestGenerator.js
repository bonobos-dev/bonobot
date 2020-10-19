"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequest = void 0;
const https_1 = __importDefault(require("https"));
function createRequest() {
    const req = https_1.default.get('https://migdrp-request-looper.herokuapp.com/start_requests', res => {
        console.log(`statusCode: ${res.statusCode} response: `);
        res.on('data', d => {
            process.stdout.write(d);
        });
    });
    req.on('error', error => {
        console.error(error);
    });
    req.end();
    setTimeout(() => {
        createRequest();
    }, 300000);
}
exports.createRequest = createRequest;
