import { FastifyInstance } from "fastify";
import settings from "./settings";
import permintaan from "./permintaan";
import imports from "./imports";
import summary from "./summary";
import nb from "./nb";
import testing from "./testing";

async function routes(server: FastifyInstance, opts, next) {

  server.register(settings);
  server.register(permintaan);
  server.register(imports);
  server.register(summary);
  server.register(nb);
  server.register(testing);

}

export default routes;