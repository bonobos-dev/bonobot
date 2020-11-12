
import https from "https";

export function createRequest(): void {

	const req = https.get('https://migdrp-request-looper.herokuapp.com/start_requests', res => {
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