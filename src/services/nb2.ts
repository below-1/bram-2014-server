import { kategori } from './drow';
import { Permintaan } from '@models/Permintaan';

function buildSummary(data: Permintaan[]) {
  const categorial = data.map(it => ({
    ...it,
    kategori: kategori(it)
  }));
}

export function multinomialNB(summary, x) {
  
}