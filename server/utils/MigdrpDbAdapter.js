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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigdrpDbAdapter = void 0;
const CuidUtil_1 = require("./CuidUtil");
const MigdrpDb_1 = require("./MigdrpDb");
class MigdrpDbAdapter {
    constructor(dbType) {
        this.DB = new MigdrpDb_1.MigdrpDb(dbType);
    }
    findAll(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield this.DB.initDb();
                const query = {};
                const result = db.collection(collection).find(query);
                return (yield result.toArray()).map((_a) => {
                    var { _id: id } = _a, found = __rest(_a, ["_id"]);
                    return (Object.assign({ id }, found));
                });
            }
            catch (error) {
                throw new Error(`Error finding all on ${collection}: ${error}`);
            }
        });
    }
    findById({ id: _id }, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield this.DB.initDb();
                const result = db.collection(collection).find({ _id });
                const found = yield result.toArray();
                if (found.length === 0) {
                    return null;
                }
                const _a = found[0], { _id: id } = _a, info = __rest(_a, ["_id"]);
                return Object.assign({ id }, info);
            }
            catch (error) {
                throw new Error(`Error finding id ${_id} on ${collection} collection: ${error}`);
            }
        });
    }
    findByName({ name: name }, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield this.DB.initDb();
                const result = db.collection(collection).find({ name });
                const found = yield result.toArray();
                if (found.length === 0) {
                    return null;
                }
                const _a = found[0], { _id: id } = _a, info = __rest(_a, ["_id"]);
                return Object.assign({ id }, info);
            }
            catch (error) {
                throw new Error(`Error finding name ${name} on ${collection} collection: ${error}`);
            }
        });
    }
    findMany(_a, collection) {
        var query = __rest(_a, []);
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield this.DB.initDb();
                const result = db.collection(collection).find(Object.assign({}, query));
                return (yield result.toArray()).map((_a) => {
                    var { _id: id } = _a, found = __rest(_a, ["_id"]);
                    return (Object.assign({ id }, found));
                });
            }
            catch (error) {
                throw new Error(`Error finding ${query} on ${collection} collection: ${error}`);
            }
        });
    }
    insertOne(_a, collection) {
        var { id: _id = CuidUtil_1.Id.makeId() } = _a, data = __rest(_a, ["id"]);
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield this.DB.initDb();
                const result = yield db.collection(collection).insertOne(Object.assign({ _id }, data));
                const _b = result.ops[0], { _id: id } = _b, insertedInfo = __rest(_b, ["_id"]);
                return Object.assign({ id }, insertedInfo);
            }
            catch (error) {
                throw new Error(`Error inserting ${_id} on ${collection} collection: ${error}`);
            }
        });
    }
    updateOne(_a, collection) {
        var { id: _id } = _a, data = __rest(_a, ["id"]);
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield this.DB.initDb();
                const result = yield db.collection(collection).updateOne({ _id }, { $set: Object.assign({}, data) });
                return result.modifiedCount > 0 ? Object.assign({ id: _id }, data) : null;
            }
            catch (error) {
                throw new Error(`Error updating ${_id} on ${collection} collection: ${error}`);
            }
        });
    }
    removeById({ id: _id }, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield this.DB.initDb();
                const result = yield db.collection(collection).deleteOne({ _id });
                return result.deletedCount;
            }
            catch (error) {
                throw new Error(`Error removing ${_id} on ${collection} collection: ${error}`);
            }
        });
    }
    removeByQuery(_a, collection) {
        var query = __rest(_a, []);
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield this.DB.initDb();
                const newQuery = Object.assign({}, query);
                const result = yield db.collection(collection).deleteMany(newQuery);
                return result.deletedCount;
            }
            catch (error) {
                throw new Error(`Error removing ${query} on ${collection} collection: ${error}`);
            }
        });
    }
    findByQuery(_a, collection) {
        var query = __rest(_a, []);
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield this.DB.initDb();
                const newQuery = Object.assign({}, query);
                const result = db.collection(collection).find(newQuery);
                return (yield result.toArray()).map((_a) => {
                    var { _id: id } = _a, found = __rest(_a, ["_id"]);
                    return (Object.assign({ id }, found));
                });
            }
            catch (error) {
                throw new Error(`Error finding ${query} on ${collection} collection: ${error}`);
            }
        });
    }
}
exports.MigdrpDbAdapter = MigdrpDbAdapter;
