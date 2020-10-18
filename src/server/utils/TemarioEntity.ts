
import { Id } from './CuidUtil';
import { MigdrpValidator } from './MigdrpValidator';




export interface tema {
	titulo:string,
	subtemas?:subtema[]
}

export interface subtema {
	titulo:string,
	subtemas?:subtema[]
}

export interface TemarioData {
	id?:string,
	fecha?:number,
	titulo:string,
	temas:tema[],
	

}


export class TemarioEntity {

	private temarioData: TemarioData;
   


    public constructor ( data:TemarioData ) {

		this.temarioData = data;
		this.temarioData.id= Id.makeId();
		this.temarioData.fecha = Date.now();



	}

	
	public async getTemarioData(){
		return  this.temarioData;
	}

}