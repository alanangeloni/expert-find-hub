
import type { CalculatorId } from './catalog';

export const calcKey = (id: CalculatorId | 'pinned') => `fp.calc.${id}`;

export const PINNED_KEY = 'fp.calc.pinned';
export const LAST_KEY = 'fp.calc.last';
