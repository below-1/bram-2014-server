import { FastifyInstance } from "fastify";
import { partition, testing, accuracy, precision, recall, miscRate } from "../services/testing";
import { Permintaan } from "@/models/Permintaan";

const ROUTE_PREFIX = "/testing";

export default async function (server: FastifyInstance, opts, next) {

  const collection = server.mongo.db.collection<Permintaan>("permintaan");

  server.post(ROUTE_PREFIX, async (request, reply) => {

    const k = parseInt(request.body.k);
    const dataset = request.body.dataset;

    const findResult = await collection.find({
      dataset
    });
    const items = await findResult.toArray();

    const parts = partition(items, k)

    const results = parts.map((part, idx) => {
      let trainingData = parts.filter((p, pidx) => pidx !== idx)
      trainingData = trainingData.reduce((a, b) => a.concat(b), [])
      const testResult = testing(trainingData, part)
      return testResult
    });

    const resultsDerived = results.map(tr => {
      return {
        accuracy: accuracy(tr),
        recall: recall(tr),
        precision: precision(tr),
        miscRate: miscRate(tr),
        ...tr
      }
    });

    reply.send(resultsDerived);
  });

}