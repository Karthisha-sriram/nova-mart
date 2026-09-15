import { productsPart1, SeedProduct } from './productsPart1.js';
import { productsPart2 } from './productsPart2.js';

export type { SeedProduct };

const categoryCodeMap: Record<number, string> = {
  1: 'ELEC',
  2: 'FASH',
  3: 'HOME',
  4: 'FITN',
  5: 'ACCS',
  6: 'GDGT'
};

export const allProducts: (SeedProduct & { sku: string })[] = [
  ...productsPart1,
  ...productsPart2
].map(p => ({
  ...p,
  sku: p.sku || `NOVA-${categoryCodeMap[p.category_id] || 'GEN'}-${String(p.id).padStart(4, '0')}`
}));

