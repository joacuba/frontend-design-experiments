import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { InventoryListScreen } from '../screens/InventoryListScreen';
import { ItemDetailsScreen } from '../screens/ItemDetailsScreen';
import { AddEditItemScreen } from '../screens/AddEditItemScreen';
import { InventoryStackParamList } from '../types/navigation';

const Stack = createStackNavigator<InventoryStackParamList>();

export const InventoryNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="InventoryList" 
        component={InventoryListScreen}
        options={{ title: 'Inventory' }}
      />
      <Stack.Screen 
        name="ItemDetails" 
        component={ItemDetailsScreen}
        options={{ title: 'Item Details' }}
      />
      <Stack.Screen 
        name="AddEditItem" 
        component={AddEditItemScreen}
        options={({ route }) => ({
          title: route.params?.item ? 'Edit Item' : 'Add Item'
        })}
      />
    </Stack.Navigator>
  );
};