import express, { Request, Response, NextFunction } from 'express';
import { bot } from '../server';
import { GuildData } from '../interfaces';

import DiscordStrategy from 'passport-discord';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import { stringlength } from './validationUtils';

const authenticationMiddleware = express.Router();
const authorizationMiddleware = express.Router();
const bonobotMastersMiddleware = express.Router();

const scopes = ['identify'];
const prompt = 'consent';

const mongoStore = MongoStore(session);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_APP_CLIENT_ID,
      clientSecret: process.env.DISCORD_APP_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_OAUTH2_REDIRECT_URL,
      scope: scopes,
    },
    function (accessToken, refreshToken, profile, done) {
      console.info(`User (${profile.username} - ${profile.id}) Login On API: `);
      //console.log('Passport auth acces token:', accessToken);
      //console.log('Passport auth refresh token:', refreshToken);

      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

authenticationMiddleware.use(
  session({
    secret: 'j(WvwoFi(^k3R8zu',
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ url: process.env.MONGODB_URI }),
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);

authenticationMiddleware.use(passport.initialize());

authenticationMiddleware.use(passport.session());

authenticationMiddleware.get('/', passport.authenticate('discord', { scope: scopes, prompt: prompt, session: false }));

authenticationMiddleware.get('/callback', async (req: Request, res: Response) => {
  try {
    if (req.query.code && stringlength(req.query.code as string, { max: 30, min: 30 })) res.send(generateHtmlCodeTemplate(req.query.code as string));
    else
      res.json({
        status: 'fail',
        statusCode: 404,
        message: 'No authorization code provided from discord API. Please check your developer credentials.',
      });
  } catch (exception) {
    console.log('Error on Bonobot OAuth2 callback route.');
    res.json({
      status: 'fail',
      statusCode: 400,
      message: exception.message,
    });
  }
});

const discordAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('discord', { failureRedirect: '/unauthorized' }, function (err, user, info) {
    if (err) {
      return res.json({
        status: 'fail',
        statusCode: err.status,
        message: `${err.name}: ${err.message}`,
      });
    }

    //authentication error
    if (!user) {
      return res.json({ error: info.message || 'Invalid Token' });
    }

    //success
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return next();
    });
  })(req, res, next);
};

authenticationMiddleware.get('/auth', passport.authenticate('discord', { failureRedirect: '/unauthorized' }), (req, res) => res.redirect('/info'));

authenticationMiddleware.get('/logout', function (req, res) {
  req.logout();
  res.status(200).json({
    status: 'OK',
    statusCode: 200,
    message: 'You have been successfully loged out of the bonobot REST API.',
  });
});

authenticationMiddleware.get('/info', checkAuth, function (req, res) {
  res.status(200).json({
    status: 'OK',
    statusCode: 200,
    message: 'You have been successfully authorized to use the bonobot REST API.',
    user: req.user,
  });
});

authenticationMiddleware.get('/unauthorized', (res: Response) => {
  res.json({
    status: 'fail',
    statusCode: 401,
    message: 'Sorry but you are not authorized.',
  });
});

authorizationMiddleware.use(checkAuth, authorizaeUser);

bonobotMastersMiddleware.use(checkAuth, authorizeMasters);

export async function authorizeMasters(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user)
      res.json({
        status: 'fail',
        statusCode: 401,
        message: 'User information not found. Please try again.',
      });

    if (req.method === 'PATCH' || req.method === 'POST') {
      let data: GuildData | GuildData[] = req.body;
      if (!Array.isArray(data)) data = [data];

      for (let n = 0; n < data.length; n++) {
        const currentGuildId = data[n].id;
        const currentMemberId = (req.user as any).id as string;
        if (!currentGuildId) throw new Error(`Guild id must be provided.`);

        const guildWithBonobotInside = bot.client.guilds.resolve(currentGuildId);
        if (!guildWithBonobotInside) throw new Error(`Bonobot must be a member of the guild provided.`);

        const memberInsideGuild = await guildWithBonobotInside.members.fetch(currentMemberId);
        if (!memberInsideGuild) throw new Error(`Sorry but you are not a member of the guild ${currentGuildId}. You must be a member of the guilds that you register on the bonobot REST API`);

        const memberAdminRoles = memberInsideGuild.roles.cache.find((role) => role.permissions.has(['ADMINISTRATOR']));
        if (!memberAdminRoles) throw new Error(`You must have administrator permissions on the guilds that you register or modify on the bonobot's REST API.`);

        if (req.method === 'POST') {
          data[n].createdBy = {
            id: (req.user as any).id,
            username: (req.user as any).username,
            discriminator: (req.user as any).discriminator,
          };
        }

        data[n].modifiedBy = {
          id: (req.user as any).id,
          username: (req.user as any).username,
          discriminator: (req.user as any).discriminator,
        };

        data[n].masters = [];
        data[n].masters.push((req.user as any).id as string);
      }

      req.body = data;
    }

    next();
  } catch (exception) {
    console.log('EXCEPTION on bonobots masters authorization middleware: ', exception.message);

    res.status(500).json({
      status: 'fail',
      statusCode: 500,
      message: `There was an error authorizing your user.  ${exception.message}`,
    });
  }
}

function checkAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) return next();
  res.json({
    status: 'fail',
    statusCode: 401,
    message: 'Sorry but you are not authenticated. Please login.',
  });
}

export async function authorizaeUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.user)
    res.json({
      status: 'fail',
      statusCode: 401,
      message: 'User information not found.',
    });

  const mainGuild = bot.config.mainGuild;
  const currentMemberId = (req.user as any).id as string;

  const mainGuildApiRoles = bot.config.mainGuildData.apiRoles;
  if (mainGuildApiRoles.length === 0) throw new Error(`No roles are allowed in the main guild. Please contact an administrator to allow some roles.`);

  const memberInsideGuild = await mainGuild.members.fetch(currentMemberId);
  if (!memberInsideGuild) throw new Error(`Sorry but you are not a member of the main bonobot guild`);

  const memberAdminRoles = memberInsideGuild.roles.cache.some((role) => mainGuildApiRoles.includes(role.id));
  if (!memberAdminRoles) throw new Error(`You are not authorized to use this api.`);

  if (req.method === 'PATCH' || req.method === 'POST') {
    let data: any = req.body;
    if (!Array.isArray(data)) data = [data];

    for (let n = 0; n < data.length; n++) {
      if (req.method === 'POST') {
        data[n].createdBy = {
          id: (req.user as any).id,
          username: (req.user as any).username,
          discriminator: (req.user as any).discriminator,
        };
      }

      data[n].modifiedBy = {
        id: (req.user as any).id,
        username: (req.user as any).username,
        discriminator: (req.user as any).discriminator,
      };
    }

    req.body = data;
  }
  next();
}

function generateHtmlCodeTemplate(authCode: string) {
  return /* html */ `
  <!DOCTYPE html>
  <html lang="en">
    <head>
        <title>Bonobot v1.0</title>
        
        <link href="https://fonts.googleapis.com/css?family=Roboto%20Mono" rel="stylesheet">

        <base href="/">
        <meta charset="utf-8">
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="author" content="Authors of Bonobos Dev">
        <meta name="description" content="Bonobot v1.0, oficial discord bot from Comunidad Bonóbica.">

        <meta property="og:image" content="/img/bb_discordbackcolor.png">
        <meta property="og:description" content="Bonobot v1.0, oficial discord bot from Comunidad Bonóbica.">
        <meta property="og:url" content="https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg" />
        <meta property="og:title" content="Bonobot v1.0" />
        <meta property="og:type" content="website" />

        <link rel="icon" type="image/png" href="/img/bb-logo.png" sizes="64x64">

        <style> 
          body {
            font-family:Roboto Mono;
            margin: 0; 
            padding: 0; 
            background-color: #2f3136; 
            overflow-x: hidden;
            overflow-y: hidden;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            -webkit-animation: fadein 700ms ease forwards;
                    animation: fadein 700ms ease forwards;
          } 

          img{
            margin-top: 2%;
            width:300px;
          }
          
          h2{
            color:#ffffff;
            text-align:center;
            font-size:20px;
            font-weight:lighter;
            padding:10px;
            margin:0;
          }

          p{
            color: #ffffff;
            font-size: 13px;
            font-weight: 100;
            padding: 45px 0px;
            width: 500px;
            margin: 0;
            text-align: center;
          }

          .code{
            padding:15px 40px;
            background-color:#444444;
            border-radius: 13px;
            width: fit-content;
            -webkit-box-shadow: inset 0px 0px 11px 2px rgba(0,0,0,0.57);
            box-shadow: inset 0px 0px 11px 2px rgba(0,0,0,0.57);
          }

          ::-moz-selection { /* Code for Firefox */
            color: #ffffff;
            background: #a83df1;
          }

          ::selection {
            color: #ffffff;
            background: #a83df1;
          }

          @-webkit-keyframes fadein {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes fadein {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

        </style>
        
    </head>
    <body>
        <img src='/img/bb_discordbackcolor.png'>
        <h2>Wellcome to Bonobot v1.0</h2>
        <p> Please use this authorization code from discord OAuth2 API to authenticate your user in the bonobot's REST API on the /api/auth endpoint. Insert the code as a query parameter called code. (https://bonoboturl.com/api/auth?code=yourAuthorizationCode)</p>
        <p class='code'> ${authCode} </p>
    </body>
  </html>
  `;
}

export { authenticationMiddleware, authorizationMiddleware, bonobotMastersMiddleware };
