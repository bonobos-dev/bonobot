"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
//import  { webpackDevDependencies } from '../webpackDevDependencies';
//import webpack from "webpack";
const router = express_1.default.Router();
const ENV_PATH = process.env.NODE_ENV === 'production' ? 'dist' : 'src/public';
console.log('From global router: ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    router.get(['/'], (req, res, next) => {
        res.sendFile(path_1.default.join(__dirname + `../../../${ENV_PATH}/index.html`));
    });
}
else if (process.env.NODE_ENV === 'development') {
    /*
        router.get('/', function (req, res, next) {
            var filename = path.join(webpackDevDependencies.compiler.outputPath,'index.html');
    
            (webpackDevDependencies.compiler.outputFileSystem as unknown as webpack.InputFileSystem).readFile(filename, function(err:any, result:any){
                if (err) {
                    return next(err);
                }
                res.set('content-type','text/html');
                res.send(result);
                res.end();
            });
        });
        
    */
}
router.use('/dist', express_1.default.static(path_1.default.join(__dirname, `../../${ENV_PATH}`)));
router.use('/img', express_1.default.static(path_1.default.join(__dirname, `../../${ENV_PATH}/assets/img`)));
router.use('/audio', express_1.default.static(path_1.default.join(__dirname, `../../${ENV_PATH}/assets/audio`)));
router.post("/api/data/tester", (_req, res) => {
    res.header("Content-Type", 'application/json');
    res.json({
        "message": "ok"
    });
    console.log("check body: ", _req.body);
    console.log("check params: ", _req.params);
    console.log("check query: ", _req.query);
});
router.get("/api/envtest", (_req, res) => {
    res.send("Running the application on <<< " + process.env.NODE_ENV + " environment >>>");
});
exports.default = router;
