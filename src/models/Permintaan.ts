import { ObjectID } from "mongodb";

export interface Permintaan {
  _id?: ObjectID;
  nama: string;
  jk: number;
  BS: number;
  BP: number;
  JB: number;
  JWP: number;
  keterangan: number;
  dataset: string;
}
