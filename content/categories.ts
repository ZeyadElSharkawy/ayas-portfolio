import type { Category } from './types.ts';

export const categories: Category[] = [
  { id: 'selected-works', title: 'Selected works', label: 'Made by hand' },
  { id: 'digital-fashion', title: 'Digital fashion', label: 'Digital · CLO 3D' },
  { id: 'fashion-styling', title: 'Fashion styling', label: 'Styling' },
];

export const categoryOf = (id: Category['id']) => categories.find((c) => c.id === id)!;
