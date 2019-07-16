"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load .env file if it exists.
require("dotenv").config();
const path = require('path');
const fastify = require("fastify");
const fastifyBlipp = require("fastify-blipp");
const fastifyMongo = require("fastify-mongodb");
const fastifyCors = require("fastify-cors");
const fastifyStatic = require("fastify-static");
const fastifyFileUpload = require("fastify-file-upload");
const routes_1 = require("./routes");
const server = fastify();
server.register(fastifyBlipp);
server.register(fastifyCors);
server.register(fastifyStatic, {
    root: path.join(process.cwd(), 'static')
});
server.register(fastifyFileUpload);
server.register(fastifyMongo, {
    forceClose: true,
    url: process.env.MONGO_URL
});
server.register(routes_1.default, { prefix: "/api/v1" });
server.setErrorHandler((error, request, reply) => {
    throw error;
});
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const port = parseInt(process.env.PORT);
            yield server.listen(port, "0.0.0.0");
            server.blipp();
            console.log(`server listen at port ${port}`);
        }
        catch (err) {
            console.log(err);
            server.log.error(err);
            process.exit();
        }
    });
}
start();
//# sourceMappingURL=index.js.map