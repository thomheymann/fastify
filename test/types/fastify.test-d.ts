import fastify, { FastifyInstance, FastifyServerOptions } from '../../fastify'
import * as http from 'http'
import * as https from 'https'
import * as http2 from 'http2'
import { Chain as LightMyRequestChain } from 'light-my-request';
import { expectType, expectError, expectAssignable } from 'tsd'
import { FastifyLoggerInstance, FastifyLoggerOptions } from '../../types/logger';

// FastifyInstance
// http server
expectType<FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>>(fastify())
expectType<FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>>(fastify({}))
// https server
expectType<FastifyInstance<https.Server, http.IncomingMessage, http.ServerResponse>>(fastify({ https: {} }))
// http2 server
expectType<FastifyInstance<http2.Http2Server, http2.Http2ServerRequest, http2.Http2ServerResponse>>(fastify({ http2: true, http2SessionTimeout: 1000 }))
expectType<FastifyInstance<http2.Http2SecureServer, http2.Http2ServerRequest, http2.Http2ServerResponse>>(fastify({ http2: true, https: {} }))
expectType<LightMyRequestChain>(fastify({ http2: true, https: {} }).inject())

expectError(fastify<http2.Http2Server>({ http2: false })) // http2 option must be true
expectError(fastify<http2.Http2SecureServer>({ http2: false })) // http2 option must be true

// server options
expectAssignable<FastifyInstance>(fastify({ http2: true }))
expectAssignable<FastifyInstance>(fastify({ ignoreTrailingSlash: true }))
expectAssignable<FastifyInstance>(fastify({ connectionTimeout: 1000 }))
expectAssignable<FastifyInstance>(fastify({ keepAliveTimeout: 1000 }))
expectAssignable<FastifyInstance>(fastify({ pluginTimeout: 1000 }))
expectAssignable<FastifyInstance>(fastify({ bodyLimit: 100 }))
expectAssignable<FastifyInstance>(fastify({ maxParamLength: 100 }))
expectAssignable<FastifyInstance>(fastify({ disableRequestLogging: true }))
expectAssignable<FastifyInstance>(fastify({ requestIdLogLabel: 'request-id' }))
expectAssignable<FastifyInstance>(fastify({ onProtoPoisoning: 'error' }))
expectAssignable<FastifyInstance>(fastify({ onConstructorPoisoning: 'error' }))
expectAssignable<FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse, true>>(fastify({ logger: true }))
expectAssignable<FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse, FastifyLoggerOptions>>(fastify({
  logger: {
    level: 'info',
    genReqId: () => 'request-id',
    serializers: {
      req: () => {
        return {
          method: 'GET',
          url: '/',
          version: '1.0.0',
          hostname: 'localhost',
          remoteAddress: '127.0.0.1',
          remotePort: 3000
        }
      },
      res: () => {
        return {
          statusCode: 200
        }
      },
      err: () => {
        return {
          type: 'Error',
          message: 'foo',
          stack: ''
        }
      },
    }
  }
}))
const customLogger = {
  info: () => { },
  warn: () => { },
  error: () => { },
  fatal: () => { },
  trace: () => { },
  debug: () => { },
  child: () => customLogger
}
expectAssignable<FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse, FastifyLoggerInstance>>(fastify({ logger: customLogger }))
expectAssignable<FastifyInstance>(fastify({ serverFactory: () => http.createServer() }))
expectAssignable<FastifyInstance>(fastify({ caseSensitive: true }))
expectAssignable<FastifyInstance>(fastify({ requestIdHeader: 'request-id' }))
expectAssignable<FastifyInstance>(fastify({ genReqId: () => 'request-id' }))
expectAssignable<FastifyInstance>(fastify({ trustProxy: true }))
expectAssignable<FastifyInstance>(fastify({ querystringParser: () => ({ foo: 'bar' }) }))
expectAssignable<FastifyInstance>(fastify({
  versioning: {
    storage: () => ({
      get: () => 'foo',
      set: () => { },
      del: () => { },
      empty: () => { }
    }),
    deriveVersion: () => 'foo'
  }
}))
expectAssignable<FastifyInstance>(fastify({ return503OnClosing: true }))
expectAssignable<FastifyInstance>(fastify({
  ajv: {
    customOptions: {
      nullable: false
    },
    plugins: [() => { }]
  }
}))
expectAssignable<FastifyInstance>(fastify({ frameworkErrors: () => { } }))
expectAssignable<FastifyInstance>(fastify({
  rewriteUrl: (req) => req.url === '/hi' ? '/hello' : req.url!
}))
