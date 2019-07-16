"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class GaussNB {
    constructor() {
        this.d = undefined;
        this.n = undefined;
        this.means = new Map();
        this.variances = new Map();
        this.classProbs = new Map();
    }
    fit(Xs, Ys) {
        if (Xs.length == 0) {
            throw new Error("Empty matrix");
        }
        if (Xs.length != Ys.length) {
            throw new Error("Input and output not match");
        }
        this.n = Xs.length;
        let colSum = new Map();
        let classCount = new Map();
        for (let i = 0; i < this.n; i++) {
            let row = Xs[i];
            let _class = Ys[i];
            // If this is the first pass.
            if (i == 0) {
                // record the dimension
                this.d = row.length;
            }
            // Initialize current sumation of each attributes
            // For current class if it's not exists yet.
            if (!colSum.has(_class)) {
                colSum.set(_class, Array(this.d).fill(0));
            }
            // Initialize counter for current class if it's not exists yet.
            if (!classCount.has(_class)) {
                classCount.set(_class, 0);
            }
            // Increment counter for current class.
            classCount.set(_class, classCount.get(_class) + 1);
            // Aggregate sum for each attribute in current class.
            let classColSum = colSum.get(_class);
            for (let idx_d = 0; idx_d < this.d; idx_d++) {
                classColSum[idx_d] += row[idx_d];
            }
        }
        const uniqueClass = Array.from(colSum.keys());
        // After we get total sum of each attributes  
        // Initialize means first.
        for (let _class of uniqueClass) {
            // Calculate class probaility
            this.classProbs.set(_class, classCount.get(_class) * 1.0 / this.n);
            let _means = Array(this.d).fill(0);
            for (let idx_d = 0; idx_d < this.d; idx_d++) {
                _means[idx_d] = colSum.get(_class)[idx_d] * 1.0 / classCount.get(_class);
            }
            this.means.set(_class, _means);
        }
        // Initialize the variances.s
        let tempSumVariances = new Map();
        for (let i = 0; i < this.n; i++) {
            let row = Xs[i];
            let _class = Ys[i];
            if (!tempSumVariances.has(_class)) {
                tempSumVariances.set(_class, Array(this.d).fill(0));
            }
            for (let idx_d = 0; idx_d < this.d; idx_d++) {
                let tmp_mean = this.means.get(_class)[idx_d];
                let d_val = row[idx_d];
                let tmp_var = (tmp_mean - d_val) ** 2;
                tempSumVariances.get(_class)[idx_d] += tmp_var;
            }
        }
        for (let _class of uniqueClass) {
            let class_variance = tempSumVariances.get(_class).map((totalVar, idx_d) => totalVar / classCount.get(_class));
            this.variances.set(_class, class_variance);
        }
    }
    predictMatrix(Xs) {
        const uniqueClass = Array.from(this.classProbs.keys());
        let results = [];
        for (let xs of Xs) {
            if (xs.length != this.d) {
                throw new Error(`Dimension of input not equal. Got ${xs.length}`);
            }
            let _maxClass = undefined;
            let _maxProb = Number.MIN_VALUE;
            for (let _class of uniqueClass) {
                let class_variances = this.variances.get(_class);
                let class_means = this.means.get(_class);
                let total_prod = 1;
                for (let idx_d = 0; idx_d < this.d; idx_d++) {
                    let _var = class_variances[idx_d];
                    let _2var = 2 * _var;
                    let denom = 1 / Math.sqrt(Math.PI * _2var);
                    let x_d = xs[idx_d];
                    let mean_d = class_means[idx_d];
                    let to_raised = Math.pow(x_d - mean_d, 2) / _2var;
                    let likelihood = (1 / denom) * Math.pow(Math.E, -1 * to_raised);
                    total_prod *= likelihood;
                }
                // Multiply by class probs.
                total_prod *= this.classProbs.get(_class);
                if (total_prod > _maxProb) {
                    _maxProb = total_prod;
                    _maxClass = _class;
                }
            }
            // let result = {
            //   _class: _maxClass,
            //   prob: _maxProb
            // };
            results.push(_maxClass);
        }
        return results;
    }
    static normalize(M) {
        if (M.length === 0) {
            throw new Error(`Matrix is empty`);
        }
        const n = M.length;
        let d = undefined;
        let maxes = undefined;
        let mins = undefined;
        for (let i = 0; i < n; i++) {
            let x = M[i];
            // On first pass, initialize dimension.
            if (i == 0) {
                d = x.length;
                // Initialize maxes and mins for each dimension.
                maxes = Array(d).fill(Number.MIN_VALUE);
                mins = Array(d).fill(Number.MAX_VALUE);
            }
            if (x.length != d) {
                throw new Error(`Dimension differ: index=${i}, data=${x}`);
            }
            for (let idx_d = 0; idx_d < d; idx_d++) {
                if (x[idx_d] > maxes[idx_d]) {
                    maxes[idx_d] = x[idx_d];
                }
                if (x[idx_d] < mins[idx_d]) {
                    mins[idx_d] = x[idx_d];
                }
            }
        }
        return M.map(row => {
            return row.map((x_i, i) => {
                return (x_i + mins[i]) * 1.0 / maxes[i];
            });
        });
    }
}
exports.GaussNB = GaussNB;
class KFold {
    constructor(Xs, Ys, k) {
        this.Xs = Xs;
        this.Ys = Ys;
        this.k = k;
        this.N = undefined;
        if (this.Xs.length == 0) {
            throw new Error(`Length of input is 0`);
        }
        if (this.Xs.length != this.Ys.length) {
            throw new Error(`Length of input and output not equal. input(${this.Xs.length}) != output(${this.Ys.length})`);
        }
        this.N = this.Xs.length;
    }
    run() {
        let partitions = this.createPartitions();
        let gauss = new GaussNB();
        let scores = [];
        for (let i = 0; i < this.k; i++) {
            let trains = this.createTrainPart(i, partitions);
            let tests = partitions.get(i);
            console.log("trains");
            console.log(trains.Xs.length);
            console.log(trains.Ys.length);
            console.log("trains dim");
            console.log(trains.Xs[0].length);
            console.log();
            console.log("test");
            console.log(tests.Xs.length);
            console.log(tests.Ys.length);
            console.log();
            gauss.fit(trains.Xs, trains.Ys);
            const partYs = gauss.predictMatrix(tests.Xs);
            const diff = lodash_1.zip(tests.Ys, partYs)
                .map(([y, y_]) => Math.abs(y - y_))
                .reduce((prev, next) => prev + next, 0);
            const nPart = 1.0 * partYs.length;
            const ratioErr = (nPart - diff) / nPart;
            const score = 1.0 - ratioErr;
            scores.push(score);
        }
        return scores;
    }
    createPartitions() {
        let partitions = new Map();
        lodash_1.range(0, this.k).forEach(i => {
            partitions.set(i, {
                Xs: [],
                Ys: []
            });
        });
        let dimension = undefined;
        for (let i = 0; i < this.N; i++) {
            let x = this.Xs[i];
            let y = this.Ys[i];
            if (i == 0) {
                dimension = x.length;
            }
            if (x.length != dimension) {
                throw new Error(`Dimension of input differ. dimension(${dimension}) != x(${x.length})`);
            }
            let partition_index = i % this.k;
            partitions.get(partition_index).Xs.push(x);
            partitions.get(partition_index).Ys.push(y);
        }
        return partitions;
    }
    createTrainPart(testPart, partitions) {
        let results = {
            Xs: [],
            Ys: []
        };
        for (let i = 0; i < this.k; i++) {
            if (i == testPart) {
                continue;
            }
            results.Xs = results.Xs.concat(partitions.get(i).Xs);
            results.Ys = results.Ys.concat(partitions.get(i).Ys);
        }
        return results;
    }
}
exports.KFold = KFold;
//# sourceMappingURL=GaussNB.js.map