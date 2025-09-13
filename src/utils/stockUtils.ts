import { InventoryItem, StockStatus } from '../types/inventory';

export const getStockStatus = (item: InventoryItem): StockStatus => {
  if (item.quantity === 0) return 'out-of-stock';
  if (item.quantity <= item.minStock) return 'low-stock';
  return 'in-stock';
};

export const getStockStatusColor = (status: StockStatus): string => {
  switch (status) {
    case 'in-stock':
      return '#10B981';
    case 'low-stock':
      return '#F59E0B';
    case 'out-of-stock':
      return '#EF4444';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};