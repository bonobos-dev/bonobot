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
exports.OidcUserManager = void 0;
const MigdrpDbAdapter_1 = require("./MigdrpDbAdapter");
const TemarioEntity_1 = require("./TemarioEntity");
class OidcUserManager {
    constructor() {
        this.adapter = new MigdrpDbAdapter_1.MigdrpDbAdapter('mongo');
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersCollection = yield this.adapter.findAll('temarios');
                return usersCollection;
            }
            catch (error) {
                //console.log(error);
                throw new Error(`Error adquiriendo todos los temarios: ${error}`);
            }
        });
    }
    findById({ id: _id }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userWithId = yield this.adapter.findById({ id: _id }, 'temarios');
                return userWithId;
            }
            catch (error) {
                //console.log(error);
                throw new Error(`Error adquiriendo el temario con id: ${_id}: ${error}`);
            }
        });
    }
    findByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userWithUsername = yield this.adapter.findByQuery({ title: title }, 'temarios');
                return userWithUsername;
            }
            catch (error) {
                //console.log(error);
                throw new Error(`Error adquiriendo el temario de: ${title}: ${error}`);
            }
        });
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataObj = yield new TemarioEntity_1.TemarioEntity(data).getTemarioData();
                const inserted = yield this.adapter.insertOne(dataObj, 'temarios');
                return inserted;
            }
            catch (error) {
                throw new Error(`Error agregando temario: ${error}`);
            }
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const removed = yield this.adapter.removeById({ id }, 'temarios');
                return removed;
            }
            catch (error) {
                throw new Error(`Error removing ${id} User: ${error}`);
            }
        });
    }
    edit(_a) {
        var { id } = _a, data = __rest(_a, ["id"]);
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const found = yield this.adapter.findById({ id }, 'temarios');
                if (found !== null) {
                    const userObj = new TemarioEntity_1.TemarioEntity(found);
                    const dataObj = yield userObj.getTemarioData();
                    const inserted = yield this.adapter.updateOne(dataObj, 'temarios');
                    return inserted;
                }
                else {
                    throw new Error(`El temario ${id} no existe en la base de datos.`);
                }
            }
            catch (error) {
                throw new Error(`Error editando el temario: ${error}`);
            }
        });
    }
}
exports.OidcUserManager = OidcUserManager;
