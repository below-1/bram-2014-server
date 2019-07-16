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
const nb_1 = require("../services/nb");
const GaussNB_1 = require("../services/GaussNB");
function default_1(server, opts, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = server.mongo.db.collection("permintaan");
        server.post("/nb/:dataset", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const dataset = request.params.dataset;
            const inputData = request.body;
            let findResult = yield collection.find({
                dataset
            });
            let items = yield findResult.toArray();
            const nbSumm = nb_1.nb(items, inputData);
            reply.send(nbSumm);
        }));
        server.get("/gauss-test", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            let gauss = new GaussNB_1.GaussNB();
            let findResult = yield collection.find({
                dataset: "training"
            });
            let items = yield findResult.toArray();
            let Xs = items.map(it => ([
                it.jk,
                it.BS,
                it.BP,
                it.JB,
                it.JWP
            ]));
            let Ys = items.map(it => it.keterangan);
            let Xs_norm = GaussNB_1.GaussNB.normalize(Xs);
            gauss.fit(Xs_norm, Ys);
            let result = {
                means: gauss.means,
                variances: gauss.variances
            };
            console.log("means=", gauss.means);
            console.log("variances=", gauss.variances);
            console.log("class probabilities=", gauss.classProbs);
            reply.send(result);
        }));
        server.get("/kfold", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            let findResult = yield collection.find({
                dataset: "training"
            });
            let items = yield findResult.toArray();
            let Xs = items.map(it => ([
                it.jk,
                it.BS,
                it.BP,
                it.JB,
                it.JWP
            ]));
            let Ys = items.map(it => it.keterangan);
            let Xs_norm = GaussNB_1.GaussNB.normalize(Xs);
            let kfold = new GaussNB_1.KFold(Xs_norm, Ys, 10);
            let result = kfold.run();
            reply.send(result);
        }));
    });
}
exports.default = default_1;
//# sourceMappingURL=nb.js.map