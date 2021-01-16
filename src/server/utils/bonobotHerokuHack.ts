import https from 'https';

export function startHerokuHackRequest(): void {
  console.log('Heroku hack initiated...');
  const req = https.get(process.env.HACK_URI, (res) => {
    console.log(`statusCode: ${res.statusCode} response: `);

    res.on('data', (d) => {
      process.stdout.write(d);
      console.log('');
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.end();

  setTimeout(() => {
    startHerokuHackRequest();
  }, 300000);
}
