"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigdrpValidator = void 0;
const validator_1 = __importDefault(require("validator"));
class MigdrpValidator {
    static isEmail(param) {
        return validator_1.default.isEmail(param);
    }
    static isMobilePhone(param) {
        return validator_1.default.isMobilePhone(param, ['es-MX', 'en-US']);
    }
    static isPostalCode(param) {
        return validator_1.default.isPostalCode(param, ['MX']);
    }
    static isCompany(param) {
        if (!(/^[A-Za-zÀ-ÖØ-öø-ÿ-'. ]+$/.test(param))) {
            return false;
        }
        return true;
    }
    static isName(param) {
        if (!(/^[A-Za-zÀ-ÖØ-öø-ÿ-'. ]+$/.test(param))) {
            return false;
        }
        return true;
    }
}
exports.MigdrpValidator = MigdrpValidator;
