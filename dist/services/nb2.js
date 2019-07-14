"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drow_1 = require("./drow");
function buildSummary(data) {
    const categorial = data.map(it => (Object.assign({}, it, { kategori: drow_1.kategori(it) })));
}
function multinomialNB(summary, x) {
}
exports.multinomialNB = multinomialNB;
//# sourceMappingURL=nb2.js.map