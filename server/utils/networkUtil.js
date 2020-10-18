"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostUrl = void 0;
function getHostUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.ASSETS_URI;
    }
    else if (process.env.NODE_ENV === 'development') {
        return `http://localhost:${process.env.PORT}`;
    }
}
exports.getHostUrl = getHostUrl;
