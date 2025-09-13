import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  Chip, 
  useTheme,
  Divider
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useInventory } from '../hooks/useInventory';
import { InventoryStackParamList } from '../types/navigation';
import { getStockStatus, formatCurrency, formatDate } from '../utils/stockUtils';

type NavigationProp = StackNavigationProp<InventoryStackParamList, 'ItemDetails'>;
type RouteProp = RouteProp<InventoryStackParamList, 'ItemDetails'>;

export const ItemDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { deleteItem } = useInventory();
  
  const { item } = route.params;
  const stockStatus = getStockStatus(item);
  const stockColor = stockStatus === 'in-stock' ? theme.colors.secondary : 
                    stockStatus === 'low-stock' ? theme.colors.tertiary : 
                    theme.colors.error;

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteItem(item.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const detailItems = [
    { icon: 'tag', label: 'Category', value: item.category },
    { icon: 'package', label: 'Current Stock', value: `${item.quantity} units` },
    { icon: 'alert-circle', label: 'Minimum Stock', value: `${item.minStock} units` },
    { icon: 'currency-usd', label: 'Unit Price', value: formatCurrency(item.price) },
    { icon: 'calculator', label: 'Total Value', value: formatCurrency(item.quantity * item.price) },
    { icon: 'truck', label: 'Supplier', value: item.supplier },
    { icon: 'calendar', label: 'Last Updated', value: formatDate(item.lastUpdated) },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.header}>
              <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>
                {item.name}
              </Text>
              <Chip 
                mode="outlined" 
                textStyle={{ color: stockColor }}
                style={{ borderColor: stockColor }}
              >
                {stockStatus.replace('-', ' ')}
              </Chip>
            </View>
            
            <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
              {item.description}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Item Details
            </Text>
            
            {detailItems.map((detail, index) => (
              <View key={index}>
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <MaterialCommunityIcons 
                      name={detail.icon as any} 
                      size={20} 
                      color={theme.colors.onSurfaceVariant} 
                    />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                      {detail.label}
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                      {detail.value}
                    </Text>
                  </View>
                </View>
                {index < detailItems.length - 1 && <Divider style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AddEditItem', { item })}
            style={styles.editButton}
            icon="pencil"
          >
            Edit Item
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.deleteButton}
            textColor={theme.colors.error}
            icon="delete"
          >
            Delete Item
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
  headerCard: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailIcon: {
    width: 40,
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 4,
  },
  actions: {
    gap: 12,
  },
  editButton: {
    marginBottom: 8,
  },
  deleteButton: {
    borderColor: '#EF4444',
  },
});