import { CategoryUseCases } from '../usecases';
import { CategoryData, RESTController } from '../interfaces';

export class CategoryRESTController {
  private cases = new CategoryUseCases();

  public POST: RESTController = async (httpRequest) => {
    try {
      //console.debug(`POST Request recibed from (${httpRequest.ip}). Body: `, httpRequest.body);

      if (!Array.isArray(httpRequest.body)) {
        const { source = {}, ...data }: CategoryData = httpRequest.body;
        source.ip = httpRequest.ip;
        source.browser = httpRequest.headers['User-Agent'];
        if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
        const uploaded = (await this.cases.add({ ...data, source })) as CategoryData;
        return {
          headers: {
            'Content-Type': 'application/json',
            'Last-Modified': new Date(Date.now()).toUTCString(),
          },
          statusCode: 201,
          body: {
            status: 'ok',
            message: 'The category was successfully registered.',
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
          const categories: CategoryData[] = [];
          for (let n = 0; n < httpRequest.body.length; n++) {
            const { source = {}, ...data }: CategoryData = httpRequest.body[n];
            source.ip = httpRequest.ip;
            source.browser = httpRequest.headers['User-Agent'];
            if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
            categories.push({ ...data, source });
          }
          const uploaded = (await this.cases.add(categories)) as CategoryData[];
          return {
            headers: {
              'Content-Type': 'application/json',
              'Last-Modified': new Date(Date.now()).toUTCString(),
            },
            statusCode: 201,
            body: {
              status: 'ok',
              count: uploaded.length,
              message: `${httpRequest.body.length === 1 ? 'Category was' : 'Categories were'} successfully registered.`,
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

      let found: CategoryData[];

      if (httpRequest.params.id) found = await this.cases.findById(httpRequest.params.id);
      if (httpRequest.params.name) found = await this.cases.findByName(httpRequest.params.name);

      return {
        headers,
        statusCode: 200,
        body: {
          status: 'ok',
          message: 'Category Found.',
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

      const Query: CategoryData = {
        id: httpRequest.query.id || httpRequest.body.id,
        name: httpRequest.query.name || httpRequest.body.name,
        emoji: httpRequest.query.emoji || httpRequest.body.emoji,
        guild: httpRequest.query.guild || httpRequest.body.guild,
        createdBy: httpRequest.query.createdBy || httpRequest.body.createdBy,
        modifiedBy: httpRequest.query.createdBy || httpRequest.body.createdBy,
        channelsCount: httpRequest.query.channelsCount || httpRequest.body.channelsCount,
      };

      Object.keys(Query).forEach((key) => (Query[key] === undefined ? delete Query[key] : {}));

      //console.log('Validation check List query', Query);

      let found: CategoryData[];

      if (Object.keys(Query).length !== 0 && Query.constructor === Object) found = await this.cases.findByQuery({ ...Query });
      else found = await this.cases.list();

      //console.log('Found', found);

      return {
        headers,
        statusCode: 200,
        body: {
          status: 'ok',
          count: found.length,
          message: 'Categories found.',
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
        const { source = {}, ...data }: CategoryData = httpRequest.body;
        source.ip = httpRequest.ip;
        source.browser = httpRequest.headers['User-Agent'];
        if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
        const uploaded = (await this.cases.edit({ ...data, source })) as CategoryData;
        return {
          headers: {
            'Content-Type': 'application/json',
            'Last-Modified': new Date(Date.now()).toUTCString(),
          },
          statusCode: 201,
          body: {
            status: 'ok',
            message: 'The category was successfully edited.',
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
          const temaries: CategoryData[] = [];
          for (let n = 0; n < httpRequest.body.length; n++) {
            const { source = {}, ...data }: CategoryData = httpRequest.body[n];
            source.ip = httpRequest.ip;
            source.browser = httpRequest.headers['User-Agent'];
            if (httpRequest.headers['Referrer']) source.referrer = httpRequest.headers['Referrer'];
            temaries.push({ ...data, source });
          }
          const uploaded = (await this.cases.edit(temaries)) as CategoryData[];
          return {
            headers: {
              'Content-Type': 'application/json',
              'Last-Modified': new Date(Date.now()).toUTCString(),
            },
            statusCode: 201,
            body: {
              status: 'ok',
              count: uploaded.length,
              message: `${httpRequest.body.length === 1 ? 'Category was' : 'Categories were'} successfully edited.`,
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
            message: 'Category do not exist on database.',
            data: deleted,
          },
        };
      } else {
        return {
          headers,
          statusCode: 200,
          body: {
            status: 'ok',
            message: 'Category successfully deleted from database.',
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
