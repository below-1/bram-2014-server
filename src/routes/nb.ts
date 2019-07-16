import { shuffle } from "lodash";
import { FastifyInstance } from "fastify";
import { Permintaan } from "@/models/Permintaan";
import { nb } from "../services/nb";
import { GaussNB, KFold } from "../services/GaussNB";

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

  server.get("/gauss-test", async (request, reply) => {
    let gauss = new GaussNB();
    let findResult = await collection.find({
      dataset: "training"
    });
    let items = await findResult.toArray();

    let Xs = items.map(it => ([
      it.jk,
      it.BS,
      it.BP,
      it.JB,
      it.JWP
    ]));

    let Ys = items.map(it => it.keterangan);

    let Xs_norm = GaussNB.normalize(Xs);

    gauss.fit(Xs_norm, Ys);

    let result = {
      means: gauss.means,
      variances: gauss.variances
    }

    console.log("means=", gauss.means);
    console.log("variances=", gauss.variances);
    console.log("class probabilities=", gauss.classProbs);

    reply.send(result);
  });

  server.get("/kfold", async (request, reply) => {
    let findResult = await collection.find({
      dataset: "training"
    });
    let items = await findResult.toArray();

    items = shuffle(items);

    let Xs = items.map(it => ([
      it.jk,
      it.BS,
      it.BP,
      it.JB,
      it.JWP
    ]));

    let Ys = items.map(it => it.keterangan);
    let Xs_norm = GaussNB.normalize(Xs);

    let kfold = new KFold(Xs_norm, Ys, 5);
    let result = kfold.run();
    reply.send(result);
  });

  server.get("/gauss-proba", async (request, reply) => {
    let gauss = new GaussNB();
    let findResult = await collection.find({
      dataset: "training"
    });
    let items = await findResult.toArray();

    let Xs = items.map(it => ([
      it.jk,
      it.BS,
      it.BP,
      it.JB,
      it.JWP
    ]));

    let Ys = items.map(it => it.keterangan);
    let Xs_norm = GaussNB.normalize(Xs);

    let Xs_test = Xs_norm.slice(0, 2);

    gauss.fit(Xs_norm, Ys);
    const proba = gauss.predictMatrix(Xs_test);
    const means = Array.from(gauss.means.entries());
    const variances = Array.from(gauss.variances.entries());
    reply.send({
      proba,
      means,
      variances
    });
  });

}