import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card,
  useTheme,
  SegmentedButtons
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useInventory } from '../hooks/useInventory';
import { InventoryStackParamList } from '../types/navigation';
import { InventoryItem } from '../types/inventory';
import { categories } from '../data/mockData';

type NavigationProp = StackNavigationProp<InventoryStackParamList, 'AddEditItem'>;
type RouteProp = RouteProp<InventoryStackParamList, 'AddEditItem'>;

export const AddEditItemScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { addItem, editItem } = useInventory();
  
  const isEditing = !!route.params?.item;
  const item = route.params?.item;

  const [formData, setFormData] = useState({
    name: '',
    category: categories[0]?.name || '',
    quantity: '',
    minStock: '',
    price: '',
    supplier: '',
    description: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity.toString(),
        minStock: item.minStock.toString(),
        price: item.price.toString(),
        supplier: item.supplier,
        description: item.description,
      });
    }
  }, [item]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (!formData.supplier.trim()) {
      Alert.alert('Error', 'Please enter a supplier');
      return;
    }

    const itemData = {
      name: formData.name.trim(),
      category: formData.category,
      quantity: parseInt(formData.quantity) || 0,
      minStock: parseInt(formData.minStock) || 0,
      price: parseFloat(formData.price) || 0,
      supplier: formData.supplier.trim(),
      description: formData.description.trim(),
    };

    if (isEditing && item) {
      editItem(itemData, item.id);
    } else {
      addItem(itemData);
    }

    navigation.goBack();
  };

  const categoryButtons = categories.map(cat => ({
    value: cat.name,
    label: cat.name,
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.formCard}>
          <Card.Content>
            <TextInput
              label="Item Name *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              mode="outlined"
              style={styles.input}
            />

            <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
              Category
            </Text>
            <SegmentedButtons
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              buttons={categoryButtons}
              style={styles.categoryButtons}
            />

            <View style={styles.row}>
              <TextInput
                label="Current Quantity"
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfWidth]}
              />

              <TextInput
                label="Minimum Stock"
                value={formData.minStock}
                onChangeText={(text) => setFormData({ ...formData, minStock: text })}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfWidth]}
              />
            </View>

            <TextInput
              label="Unit Price"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              mode="outlined"
              keyboardType="decimal-pad"
              left={<TextInput.Icon icon="currency-usd" />}
              style={styles.input}
            />

            <TextInput
              label="Supplier *"
              value={formData.supplier}
              onChangeText={(text) => setFormData({ ...formData, supplier: text })}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            icon={isEditing ? "content-save" : "plus"}
          >
            {isEditing ? 'Update Item' : 'Add Item'}
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formCard: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  categoryButtons: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  actions: {
    gap: 12,
  },
  saveButton: {
    marginBottom: 8,
  },
  cancelButton: {},
});