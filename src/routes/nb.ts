import { FastifyInstance } from "fastify";
import { Permintaan } from "@/models/Permintaan";
import { nb } from "../services/nb";

export default async function (server: FastifyInstance, opts, next) {

  const collection = server.mongo.db.collection<Permintaan>("permintaan");

  server.post("/nb/:dataset", async (request, reply) => {
    const dataset = request.params.dataset;
    const inputData = request.body;
    let findResult = await collection.find({
      dataset
    });
    let items = await findResult.toArray();
    const nbSumm = nb(items, inputData);
    reply.send(nbSumm);
  });

}