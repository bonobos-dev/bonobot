export interface httprequest {
  body?: any;
  query?: any;
  params?: any;
  ip?: string;
  method?: string;
  path?: string;
  headers?: {
    'Content-Type'?: string;
    Referrer?: string;
    'User-Agent'?: string;
  };
}

export type RESTController = (httpRequest: httprequest) => Promise<any>;
