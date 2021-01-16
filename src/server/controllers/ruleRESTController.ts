import { RuleUseCases } from '../usecases';
import { RuleData, RESTController } from '../interfaces';

export class RuleRESTController {
  private cases = new RuleUseCases();

  public POST: RESTController = async (httpRequest) => {
    try {
      //console.debug(`POST Request recibed from (${httpRequest.ip}). Body: `, httpRequest.body);

      if (!Array.isArray(httpRequest.body)) {
        const { source = {}, ...data }: RuleData = httpRequest.body;
        source.ip = httpRequest.ip;
        source.browser = httpRequest.headers['User-Agent'];
        if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
        const uploaded = (await this.cases.add({ ...data, source })) as RuleData;
        return {
          headers: {
            'Content-Type': 'application/json',
            'Last-Modified': new Date(Date.now()).toUTCString(),
          },
          statusCode: 201,
          body: {
            status: 'ok',
            message: 'The rule was successfully registered.',
            data: uploaded,
          },
        };
      } else {
        if (httpRequest.body.length === 0) {
          return {
            headers: {
              'Content-Type': 'application/json',
              'Last-Modified': new Date(Date.now()).toUTCString(),
            },
            statusCode: 304,
            body: {
              status: 'ok',
              message: 'Nothing changed.',
              data: [],
            },
          };
        } else if (httpRequest.body.length > 0) {
          const rules: RuleData[] = [];
          for (let n = 0; n < httpRequest.body.length; n++) {
            const { source = {}, ...data }: RuleData = httpRequest.body[n];
            source.ip = httpRequest.ip;
            source.browser = httpRequest.headers['User-Agent'];
            if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
            rules.push({ ...data, source });
          }
          const uploaded = (await this.cases.add(rules)) as RuleData[];
          return {
            headers: {
              'Content-Type': 'application/json',
              'Last-Modified': new Date(Date.now()).toUTCString(),
            },
            statusCode: 201,
            body: {
              status: 'ok',
              count: uploaded.length,
              message: `${httpRequest.body.length === 1 ? 'Rule was' : 'Rules were'} successfully registered.`,
              data: uploaded,
            },
          };
        }
      }
    } catch (exception) {
      console.warn(exception);
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          status: 'fail',
          message: exception.message,
        },
      };
    }
  };

  public GET: RESTController = async (httpRequest) => {
    try {
      //console.debug(`GET Request recibed from (${httpRequest.ip}). Body: `, httpRequest.body);

      const headers = {
        'Content-Type': 'application/json',
      };

      let found: RuleData[];

      if (httpRequest.params.id) found = await this.cases.findById(httpRequest.params.id);
      if (httpRequest.params.name) found = await this.cases.findByName(httpRequest.params.name);

      return {
        headers,
        statusCode: 200,
        body: {
          status: 'ok',
          message: 'Rule Found.',
          data: found,
        },
      };
    } catch (exception) {
      console.warn(exception);
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          status: 'fail',
          message: exception.message,
        },
      };
    }
  };

  public LIST: RESTController = async (httpRequest) => {
    try {
      //console.debug(`GET Request recibed from (${httpRequest.ip}). Body & Quey: `, { body: httpRequest.body, query: httpRequest.query });
      const headers = {
        'Content-Type': 'application/json',
      };

      const Query: RuleData = {
        id: httpRequest.query.id || httpRequest.body.id,
        name: httpRequest.query.name || httpRequest.body.name,
        createdBy: httpRequest.query.createdBy || httpRequest.body.createdBy,
        modifiedBy: httpRequest.query.createdBy || httpRequest.body.createdBy,
        severity: httpRequest.query.severity || httpRequest.body.severity,
      };

      Object.keys(Query).forEach((key) => (Query[key] === undefined ? delete Query[key] : {}));

      //console.log('Validation check List query', Query);

      let found: RuleData[];

      if (Object.keys(Query).length !== 0 && Query.constructor === Object) found = await this.cases.findByQuery({ ...Query });
      else found = await this.cases.list();

      //console.log('Found', found);

      return {
        headers,
        statusCode: 200,
        body: {
          status: 'ok',
          count: found.length,
          message: 'Rules found.',
          data: found,
        },
      };
    } catch (exception) {
      console.warn(exception);
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          status: 'fail',
          message: exception.message,
        },
      };
    }
  };

  public PATCH: RESTController = async (httpRequest) => {
    try {
      //console.debug(`PATCH Request recibed from (${httpRequest.ip}). Body: `, httpRequest.body);
      if (!Array.isArray(httpRequest.body)) {
        const { source = {}, ...data }: RuleData = httpRequest.body;
        source.ip = httpRequest.ip;
        source.browser = httpRequest.headers['User-Agent'];
        if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
        const uploaded = (await this.cases.edit({ ...data, source })) as RuleData;
        return {
          headers: {
            'Content-Type': 'application/json',
            'Last-Modified': new Date(Date.now()).toUTCString(),
          },
          statusCode: 201,
          body: {
            status: 'ok',
            message: 'The rule was successfully edited.',
            data: uploaded,
          },
        };
      } else {
        if (httpRequest.body.length === 0) {
          return {
            headers: {
              'Content-Type': 'application/json',
              'Last-Modified': new Date(Date.now()).toUTCString(),
            },
            statusCode: 304,
            body: {
              status: 'ok',
              message: 'Nothing changed.',
              data: [],
            },
          };
        } else if (httpRequest.body.length > 0) {
          const rules: RuleData[] = [];
          for (let n = 0; n < httpRequest.body.length; n++) {
            const { source = {}, ...data }: RuleData = httpRequest.body[n];
            source.ip = httpRequest.ip;
            source.browser = httpRequest.headers['User-Agent'];
            if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
            rules.push({ ...data, source });
          }
          const uploaded = (await this.cases.edit(rules)) as RuleData[];
          return {
            headers: {
              'Content-Type': 'application/json',
              'Last-Modified': new Date(Date.now()).toUTCString(),
            },
            statusCode: 201,
            body: {
              status: 'ok',
              count: uploaded.length,
              message: `${httpRequest.body.length === 1 ? 'Rule was' : 'Rules were'} successfully edited.`,
              data: uploaded,
            },
          };
        }
      }
    } catch (exception) {
      console.warn(exception);
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          status: 'fail',
          message: exception.message,
        },
      };
    }
  };

  public DELETE: RESTController = async (httpRequest: any) => {
    try {
      //console.debug(`DELETE Request recibed from (${httpRequest.ip}). Body & Params: `, { body: httpRequest.body, params: httpRequest.params });
      const headers = {
        'Content-Type': 'application/json',
      };
      if (Array.isArray(httpRequest.body)) {
        return {
          headers,
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'Request body must be a individual object not an array.',
          },
        };
      }

      const deleted = await this.cases.deleteById({ id: httpRequest.params.id || httpRequest.body.id });
      if (deleted === 0) {
        return {
          headers,
          statusCode: 404,
          body: {
            status: 'ok',
            message: 'Rule do not exist on database.',
            data: deleted,
          },
        };
      } else {
        return {
          headers,
          statusCode: 200,
          body: {
            status: 'ok',
            message: 'Rule successfully deleted from database.',
            data: deleted,
          },
        };
      }
    } catch (exception) {
      console.warn(exception);
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          status: 'fail',
          message: exception.message,
        },
      };
    }
  };
}
