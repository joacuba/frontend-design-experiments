import { InventoryItem } from './inventory';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Inventory: undefined;
  Analytics: undefined;
  Profile: undefined;
};

export type InventoryStackParamList = {
  InventoryList: undefined;
  ItemDetails: { item: InventoryItem };
  AddEditItem: { item?: InventoryItem };
};