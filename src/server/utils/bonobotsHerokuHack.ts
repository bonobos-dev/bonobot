
import https from "https";

export function createRequest(): void {
	console.log('Heroku hack initiated...');
	const req = https.get(process.env.HACK_URI, res => {
		console.log(`statusCode: ${res.statusCode} response: `);
    
		res.on('data', d => {
			process.stdout.write(d)

		})
	})

	req.on('error', error => {
		console.error(error)
  })
  
	req.end()

	setTimeout( ()=>{
		createRequest();
  } , 300000);
  

}