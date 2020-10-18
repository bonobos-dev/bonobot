import { MongoClient, Db, FindOneOptions } from 'mongodb'; 

import { MigdrpDbAdapter } from './MigdrpDbAdapter'; 

import { TemarioData, TemarioEntity } from './TemarioEntity';



export class OidcUserManager {
	
	private adapter = new MigdrpDbAdapter('mongo');
	
	public constructor(){}

	public async findAll() {
		try {
			const usersCollection = await this.adapter.findAll('temarios');
			return  usersCollection;

		} catch ( error ) {
			//console.log(error);
			throw new Error(`Error adquiriendo todos los temarios: ${error}`);
		}
	}

	public async findById( { id: _id }:{ id:string }  ){
		try {
			const userWithId = await this.adapter.findById( { id: _id } , 'temarios');
			return  userWithId;

		} catch ( error ) {
			//console.log(error);
			throw new Error(`Error adquiriendo el temario con id: ${ _id }: ${error}`);
		}

	}

	public async findByTitle( title:string  ){
		try {
			const userWithUsername = await this.adapter.findByQuery( { title: title } , 'temarios');
			return  userWithUsername;

		} catch ( error ) {
			//console.log(error);
			throw new Error(`Error adquiriendo el temario de: ${ title }: ${error}`);
		}

	}


	public async add( data:TemarioData ){
		try {
            const  dataObj = await new TemarioEntity( data ).getTemarioData();
            const  inserted = await this.adapter.insertOne(dataObj, 'temarios');
            return inserted;

        }catch (error){
			throw new Error(`Error agregando temario: ${error}`);
        }
	}

	public async remove( id:string ){
        try {
            const  removed = await this.adapter.removeById({id}, 'temarios');
            return removed;

        }catch (error){
			throw new Error(`Error removing ${id} User: ${error}`);
        }
	}
	
	public async edit( { id, ...data }:{ id:string }){
        try {
            const found = await this.adapter.findById({id}, 'temarios');
            if (found !== null){
				const userObj =  new TemarioEntity(found);
				const dataObj = await userObj.getTemarioData();
                const inserted =  await this.adapter.updateOne(dataObj as any, 'temarios');
                return inserted;
            }else {
                throw new Error(`El temario ${id} no existe en la base de datos.`);
            }

        }catch (error){
			throw new Error(`Error editando el temario: ${error}`);
        }
	}
	

	


}


