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
const summary_1 = require("../services/summary");
function default_1(server, opts, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = server.mongo.db.collection("permintaan");
        server.get("/summary/:dataset", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const dataset = request.params.dataset;
            let findResult = yield collection.find({
                dataset
            });
            let items = yield findResult.toArray();
            let result = summary_1.summary(items);
            reply.send(result);
        }));
        server.get("/count/:dataset", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const dataset = request.params.dataset;
            const countResult = yield collection.countDocuments({ dataset });
            reply.send({ count: countResult });
        }));
    });
}
exports.default = default_1;
//# sourceMappingURL=summary.js.map