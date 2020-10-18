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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigdrpDb = void 0;
const mongodb_1 = require("mongodb");
var MigdrpDbType;
(function (MigdrpDbType) {
    MigdrpDbType["MongoDb"] = "mongodb";
})(MigdrpDbType || (MigdrpDbType = {}));
class MigdrpDb {
    constructor(type) {
        this.setType(type);
    }
    setType(type) {
        if (type === 'mongo') {
            this.type = MigdrpDbType.MongoDb;
        }
        else {
            throw new Error('Invalid type for MigdrpDb');
        }
    }
    initDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.type === MigdrpDbType.MongoDb) {
                const url = process.env.MONGODB_OIDC_URI;
                //console.log( 'url is: ', url);
                const client = new mongodb_1.MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
                if (!client.isConnected()) {
                    yield client.connect();
                }
                return client.db(client.db.name);
            }
        });
    }
}
exports.MigdrpDb = MigdrpDb;
