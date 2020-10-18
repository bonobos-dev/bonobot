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
exports.TemarioEntity = void 0;
const CuidUtil_1 = require("./CuidUtil");
class TemarioEntity {
    constructor(data) {
        this.temarioData = data;
        this.temarioData.id = CuidUtil_1.Id.makeId();
        this.temarioData.fecha = Date.now();
    }
    getTemarioData() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.temarioData;
        });
    }
}
exports.TemarioEntity = TemarioEntity;
