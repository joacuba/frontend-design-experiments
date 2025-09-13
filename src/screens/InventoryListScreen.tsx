import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { 
  Text, 
  Card, 
  Searchbar, 
  FAB, 
  Chip,
  useTheme,
  Menu,
  Button,
  Divider
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useInventory } from '../hooks/useInventory';
import { InventoryItem } from '../types/inventory';
import { InventoryStackParamList } from '../types/navigation';
import { getStockStatus, formatCurrency, formatDate } from '../utils/stockUtils';
import { categories } from '../data/mockData';

type NavigationProp = StackNavigationProp<InventoryStackParamList, 'InventoryList'>;

export const InventoryListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { items } = useInventory();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'quantity':
          return b.quantity - a.quantity;
        case 'price':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const renderItem = ({ item }: { item: InventoryItem }) => {
    const stockStatus = getStockStatus(item);
    const stockColor = stockStatus === 'in-stock' ? theme.colors.secondary : 
                      stockStatus === 'low-stock' ? theme.colors.tertiary : 
                      theme.colors.error;

    return (
      <Card 
        style={styles.itemCard}
        onPress={() => navigation.navigate('ItemDetails', { item })}
      >
        <Card.Content>
          <View style={styles.itemHeader}>
            <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>
              {item.name}
            </Text>
            <Chip 
              mode="outlined" 
              compact
              textStyle={{ color: stockColor }}
              style={{ borderColor: stockColor }}
            >
              {stockStatus.replace('-', ' ')}
            </Chip>
          </View>
          
          <Text style={[styles.itemDescription, { color: theme.colors.onSurfaceVariant }]}>
            {item.description}
          </Text>
          
          <View style={styles.itemDetails}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="tag" size={16} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                {item.category}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="package" size={16} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                {item.quantity} units
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="currency-usd" size={16} color={theme.colors.onSurfaceVariant} />
              <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                {formatCurrency(item.price)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search inventory..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <View style={styles.filters}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ id: '', name: 'All' }, ...categories]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Chip
                selected={selectedCategory === item.name || (item.name === 'All' && !selectedCategory)}
                onPress={() => setSelectedCategory(item.name === 'All' ? '' : item.name)}
                style={styles.categoryChip}
              >
                {item.name}
              </Chip>
            )}
          />
          
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                compact
                onPress={() => setSortMenuVisible(true)}
                icon="sort"
              >
                Sort
              </Button>
            }
          >
            <Menu.Item onPress={() => { setSortBy('name'); setSortMenuVisible(false); }} title="Name" />
            <Menu.Item onPress={() => { setSortBy('quantity'); setSortMenuVisible(false); }} title="Quantity" />
            <Menu.Item onPress={() => { setSortBy('price'); setSortMenuVisible(false); }} title="Price" />
          </Menu>
        </View>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddEditItem', {})}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryChip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  itemCard: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});