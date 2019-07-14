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
const testing_1 = require("../services/testing");
const ROUTE_PREFIX = "/testing";
function default_1(server, opts, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = server.mongo.db.collection("permintaan");
        server.post(ROUTE_PREFIX, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const k = parseInt(request.body.k);
            const dataset = request.body.dataset;
            const findResult = yield collection.find({
                dataset
            });
            const items = yield findResult.toArray();
            const parts = testing_1.partition(items, k);
            const results = parts.map((part, idx) => {
                let trainingData = parts.filter((p, pidx) => pidx !== idx);
                trainingData = trainingData.reduce((a, b) => a.concat(b), []);
                const testResult = testing_1.testing(trainingData, part);
                return testResult;
            });
            const resultsDerived = results.map(tr => {
                return Object.assign({ accuracy: testing_1.accuracy(tr), recall: testing_1.recall(tr), precision: testing_1.precision(tr), miscRate: testing_1.miscRate(tr) }, tr);
            });
            reply.send(resultsDerived);
        }));
    });
}
exports.default = default_1;
//# sourceMappingURL=testing.js.map