import { RoleUseCases } from '../usecases';
import { RoleData, RESTController } from '../interfaces';
import { booleanFromString } from '../utils';

export class RoleRESTController {
  private cases = new RoleUseCases();

  public POST: RESTController = async (httpRequest) => {
    try {
      //console.debug(`POST Request recibed from (${httpRequest.ip}). Body: `, httpRequest.body);

      if (!Array.isArray(httpRequest.body)) {
        const { source = {}, ...data }: RoleData = httpRequest.body;
        source.ip = httpRequest.ip;
        source.browser = httpRequest.headers['User-Agent'];
        if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
        const uploaded = (await this.cases.add({ ...data, source })) as RoleData;
        return {
          headers: {
            'Content-Type': 'application/json',
            'Last-Modified': new Date(Date.now()).toUTCString(),
          },
          statusCode: 201,
          body: {
            status: 'ok',
            message: 'The role was successfully registered.',
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
          const categories: RoleData[] = [];
          for (let n = 0; n < httpRequest.body.length; n++) {
            const { source = {}, ...data }: RoleData = httpRequest.body[n];
            source.ip = httpRequest.ip;
            source.browser = httpRequest.headers['User-Agent'];
            if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
            categories.push({ ...data, source });
          }
          const uploaded = (await this.cases.add(categories)) as RoleData[];
          return {
            headers: {
              'Content-Type': 'application/json',
              'Last-Modified': new Date(Date.now()).toUTCString(),
            },
            statusCode: 201,
            body: {
              status: 'ok',
              count: uploaded.length,
              message: `${httpRequest.body.length === 1 ? 'Role was' : 'Roles were'} successfully registered.`,
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

      let found: RoleData[];

      if (httpRequest.params.id) found = await this.cases.findById(httpRequest.params.id);
      if (httpRequest.params.name) found = await this.cases.findByName(httpRequest.params.name);

      return {
        headers,
        statusCode: 200,
        body: {
          status: 'ok',
          message: 'Role Found.',
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

      let activeAttr: boolean;
      let selectableAttr: boolean;

      if (httpRequest.query.active) activeAttr = booleanFromString(httpRequest.query.active);
      if (httpRequest.body.active) activeAttr = booleanFromString(httpRequest.body.active);
      if (httpRequest.query.selectable) selectableAttr = booleanFromString(httpRequest.query.selectable);
      if (httpRequest.body.selectable) selectableAttr = booleanFromString(httpRequest.body.selectable);

      const Query: RoleData = {
        id: httpRequest.query.id || httpRequest.body.id,
        name: httpRequest.query.name || httpRequest.body.name,
        color: httpRequest.query.color || httpRequest.body.color,
        type: httpRequest.query.type || httpRequest.body.type,
        guild: httpRequest.query.guild || httpRequest.body.guild,
        active: activeAttr,
        selectable: selectableAttr,
        createdBy: httpRequest.query.createdBy || httpRequest.body.createdBy,
        modifiedBy: httpRequest.query.createdBy || httpRequest.body.createdBy,
        commandsCount: httpRequest.query.commandsCount || httpRequest.body.commandsCount,
      };

      Object.keys(Query).forEach((key) => (Query[key] === undefined ? delete Query[key] : {}));

      //console.log('Validation check List query', Query);

      let found: RoleData[];

      if (Object.keys(Query).length !== 0 && Query.constructor === Object) found = await this.cases.findByQuery({ ...Query });
      else found = await this.cases.list();

      //console.log('Found', found);

      return {
        headers,
        statusCode: 200,
        body: {
          status: 'ok',
          count: found.length,
          message: 'Roles found.',
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
        const { source = {}, ...data }: RoleData = httpRequest.body;
        source.ip = httpRequest.ip;
        source.browser = httpRequest.headers['User-Agent'];
        if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
        const uploaded = (await this.cases.edit({ ...data, source })) as RoleData;
        return {
          headers: {
            'Content-Type': 'application/json',
            'Last-Modified': new Date(Date.now()).toUTCString(),
          },
          statusCode: 201,
          body: {
            status: 'ok',
            message: 'The role was successfully edited.',
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
          const temaries: RoleData[] = [];
          for (let n = 0; n < httpRequest.body.length; n++) {
            const { source = {}, ...data }: RoleData = httpRequest.body[n];
            source.ip = httpRequest.ip;
            source.browser = httpRequest.headers['User-Agent'];
            if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
            temaries.push({ ...data, source });
          }
          const uploaded = (await this.cases.edit(temaries)) as RoleData[];
          return {
            headers: {
              'Content-Type': 'application/json',
              'Last-Modified': new Date(Date.now()).toUTCString(),
            },
            statusCode: 201,
            body: {
              status: 'ok',
              count: uploaded.length,
              message: `${httpRequest.body.length === 1 ? 'Role was' : 'Roles were'} successfully edited.`,
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
            message: 'Role do not exist on database.',
            data: deleted,
          },
        };
      } else {
        return {
          headers,
          statusCode: 200,
          body: {
            status: 'ok',
            message: 'Role successfully deleted from database.',
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
