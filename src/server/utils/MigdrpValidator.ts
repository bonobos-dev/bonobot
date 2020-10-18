import lib from 'validator';



export class MigdrpValidator {

	public static isEmail( param:string ){
		return lib.isEmail(param);
	}

	public static isMobilePhone( param:string ){
		return lib.isMobilePhone(param,['es-MX','en-US'])
	}

	public static isPostalCode( param:string ){
		return lib.isPostalCode(param, <any>['MX'])
	}

	public static isCompany( param:string ) {
		if (!(/^[A-Za-zÀ-ÖØ-öø-ÿ-'. ]+$/.test(param))) {
			return false;
		}
		return true;
	}

	public static isName( param:string )  {
		if (!(/^[A-Za-zÀ-ÖØ-öø-ÿ-'. ]+$/.test(param))) {
			return false;
		}
		return true;
	}

}

