"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const globalRouter_1 = __importDefault(require("./routes/globalRouter"));
//import { webpackDevDependencies } from './webpackDevDependencies';
const bot_1 = require("./bot");
const requestGenerator_1 = require("./utils/requestGenerator");
const app = express_1.default();
const PORT = process.env.PORT || 2503;
let server = require("http").Server(app);
console.log('La aplicación está corriendo en el entorno: <<< ' + process.env.NODE_ENV + ' >>>');
const initServer = () => __awaiter(void 0, void 0, void 0, function* () {
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    if (process.env.NODE_ENV === 'production') {
        console.log("Production proxy: (http to https)");
        // Uncoment when uploading to a secure domain....  (https)
        /*

        app.enable('trust proxy');
    
        app.use((req, res, next) => {
            if (req.secure) {
                next();
            } else if (req.method === 'GET' || req.method === 'HEAD') {
                res.redirect(url.format({
                    protocol: 'https',
                    host: req.get('host'),
                    pathname: req.originalUrl,
                }));
            } else {
                res.status(400).json({
                    error: 'invalid_request',
                    error_description: 'Please only use https for this domain',
                });
            }
        });

        */
    }
    else if (process.env.NODE_ENV === 'development') {
        //app.use(webpackDevDependencies.middleware);
    }
    bot_1.initBot();
    requestGenerator_1.createRequest();
    app.use('/', globalRouter_1.default);
    server.listen(PORT, () => {
        console.log(`La aplicación está corriendo en: <<< port ${PORT} >>> `);
    });
});
initServer().catch((_err) => {
    if (server && server.listening)
        server.close();
    console.log(_err);
    process.exitCode = 1;
});
