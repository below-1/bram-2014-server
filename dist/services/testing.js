"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nb_1 = require("./nb");
const summary_1 = require("./summary");
function partition(data, k) {
    let parts = [...Array(k).keys()].map(i => {
        return [];
    });
    data.forEach((x, idx) => {
        const partIdx = idx % k;
        parts[partIdx].push(x);
    });
    return parts;
}
exports.partition = partition;
function testing(training, testing) {
    const summ = summary_1.summary(training);
    let testingResult = {
        tp: 0,
        tn: 0,
        fp: 0,
        fn: 0
    };
    testing.forEach(x => {
        const actual = x.keterangan;
        const nbResult = nb_1.nbWithSumm(summ, x);
        const predicted = nbResult.result;
        // TP
        if (actual === 1 && predicted === 1) {
            testingResult.tp += 1;
            // TN
        }
        else if (actual === 0 && predicted === 0) {
            testingResult.tn += 1;
            // FP
        }
        else if (actual === 0 && predicted === 1) {
            testingResult.fp += 1;
            // FN
        }
        else if (actual === 1 && predicted === 0) {
            testingResult.fn += 1;
        }
        else {
            throw new Error("What the fuck happen!");
        }
    });
    return testingResult;
}
exports.testing = testing;
exports.accuracy = testR => (testR.tp + testR.tn) * 100.0 / (testR.tp + testR.tn + testR.fp + testR.fn);
exports.precision = testR => testR.tp * 100.0 / (testR.tp + testR.tn);
exports.recall = testR => testR.tp * 100.0 / (testR.tp + testR.fn);
exports.miscRate = testR => (testR.fp + testR.fn) * 100.0 / (testR.tp + testR.tn + testR.fp + testR.fn);
//# sourceMappingURL=testing.js.map