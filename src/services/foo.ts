import { zip, range } from "lodash";
import { readFileSync, writeFileSync } from "fs";

type Row = number[];
type Matrix = Row[];

type ClassificationResult = {
  _class: number;
  prob: number;
}

type KFoldPart = {
  Xs: Matrix;
  Ys: Row;
};

export class GaussNB {

  d: number = undefined;
  n: number = undefined;
  means: Map<number, Row> = new Map<number, Row>();
  variances: Map<number, Row> = new Map<number, Row>();
  classProbs: Map<number, number> = new Map<number, number>();

  fit(Xs: Matrix, Ys: Row) {
    if (Xs.length == 0) {
      throw new Error("Empty matrix");
    }

    if (Xs.length != Ys.length) {
      throw new Error("Input and output not match");
    }

    this.n = Xs.length;
    let colSum: Map<number, Row> = new Map<number, Row>();
    let classCount: Map<number, number> = new Map<number, number>();

    for (let i = 0; i < this.n; i++)  {
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
    let tempSumVariances = new Map<Number, Row>();
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
      let class_variance = tempSumVariances.get(_class).map((totalVar, idx_d) =>
        totalVar / classCount.get(_class)
      );
      this.variances.set(
        _class,
        class_variance
      );
    }
  }

  predictMatrixProba(Xs: Matrix): Matrix {
    let uniqueClass = Array.from(this.classProbs.keys());
    uniqueClass = uniqueClass.sort((a, b) => a - b);
    uniqueClass = uniqueClass.reverse();
    console.log(uniqueClass);

    let results: Matrix = [];

    for (let xs of Xs) {
      if (xs.length != this.d) {
        throw new Error(`Dimension of input not equal. Got ${xs.length}`);
      }
      let classProbs = [];
      for (let _class of uniqueClass) {
        let class_variances = this.variances.get(_class);
        let class_means = this.means.get(_class);

        let total_prod = 0;

        for(let idx_d = 0; idx_d < this.d; idx_d++) {
          let _var = class_variances[idx_d];
          let x_d = xs[idx_d];
          let mean_d = class_means[idx_d];

          let f1 = -1 * Math.log(2 * Math.PI);
          let f2 = Math.log(_var);
          let f3 = ((x_d - mean_d) ** 2) / _var;
          total_prod += 0.5 * (f1 - f2 - f3);
        }

        // Multiply by class probs.
        total_prod += Math.log(this.classProbs.get(_class));
        classProbs.push(total_prod);
      }
      
      // let result = {
        //   _class: _maxClass,
        //   prob: _maxProb
        // };
      const expsum = classProbs.map(cprob => Math.exp(cprob));
      const logsum = expsum.map(exp => Math.exp(exp));
      const normProb = classProbs.map((cprob, j) => Math.exp(cprob - logsum[j]));
      results.push(normProb);
    }

    // Normalize log prob

    return results;
  }

  predict_binary(Xs: Matrix): Row {
    const probs = this.predictMatrixProba(Xs);
    return probs.map(classProbs => {
      if (classProbs[0] < classProbs[1]) {
        return 0;
      }
      return 1;
    });
  }

  static normalize(M: Matrix): Matrix {
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
        return (x_i - mins[i]) * 1.0 / (maxes[i] - mins[i]);
      });
    });
    
  }

  static standardize(M: Matrix, means: Row, variances: Row) {
    return M.map((xs, i) => {
      return xs.map((x, j) => {
        return (x - means[j]) / variances[j];
      });
    });
  }

  static means(M: Matrix, d: number): Row {
    const colSum = M.reduce(
      (_means, xs) => 
        zip(_means, xs).map(
          ([_a, _b]) => _a + _b
        ),
      Array(d).fill(0)
    );

    return range(0, d).map(j => colSum[j] / M.length);
  }

  static variances(M: Matrix, means: Row, d: number) : Row {

    const diffs = M.map((xs, i) =>
      xs.map((x, j) => (x - means[j]) ** 2)
    );

    // console.log(diffs);

    const summed = diffs.reduce(
      ([ _var, _xs ]) => range(0, d).map(j => _var[j] + _xs[j]),
      Array(d).fill(0)
    );


    return summed.map(s => s / M.length);
  }
}

function main() {
  console.log(process.cwd());
  const filePath = process.cwd() + "/src/services/data_20.json";
  const buff = readFileSync(filePath);
  let data = JSON.parse(buff.toString());

  const keys = ["jk", "BS", "BP", "JB", "JWP"];
  let Xs: Matrix = data.map(row => {
    return keys.map(k => row[k]);
  });
  let Ys: Row = data.map(row => {
    return row.keterangan;
  });

  let d = 5;
  let Xs_norm = GaussNB.normalize(Xs);

  let gauss = new GaussNB();
  gauss.fit(Xs_norm, Ys);

  // console.log("variances[0]");
  // console.log(gauss.variances.get(0));
  // console.log();
  // console.log("variances[1]");
  // console.log(gauss.variances.get(1));

  console.log();
  console.log(
    gauss.predict_binary(Xs_norm.slice(0, 10))
  );
}

main();