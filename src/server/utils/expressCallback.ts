import { Response, Request } from 'express';
import { RESTController, httprequest } from '../interfaces';

export function expressCallback(controlador: RESTController) {
  return (req: Request, res: Response): void => {
    //console.log('Express callback called');
    //console.log("check body: ",req.body);
    //console.log("check params: ",req.params);
    //console.log("check query: ",req.query);

    const httpRequest: httprequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referrer: req.get('referrer'),
        'User-Agent': req.get('User-Agent'),
      },
    };

    controlador(httpRequest)
      .then((httpResponse: any) => {
        if (httpResponse.headers) {
          res.set(httpResponse.headers);
        }
        res.type('json');
        res.status(httpResponse.statusCode).send(httpResponse.body);
      })
      .catch((exception) => res.status(500).send({ error: `Unexpected error. ${exception.message}` }));
  };
}
