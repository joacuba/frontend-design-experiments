import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useInventory } from '../hooks/useInventory';
import { getStockStatus, formatCurrency } from '../utils/stockUtils';

export const DashboardScreen: React.FC = () => {
  const theme = useTheme();
  const { items } = useInventory();

  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const lowStockItems = items.filter(item => getStockStatus(item) === 'low-stock').length;
  const outOfStockItems = items.filter(item => getStockStatus(item) === 'out-of-stock').length;

  const stats = [
    {
      title: 'Total Items',
      value: totalItems.toString(),
      icon: 'package-variant',
      color: theme.colors.primary,
      subtitle: `${items.reduce((sum, item) => sum + item.quantity, 0)} units`,
    },
    {
      title: 'Total Value',
      value: formatCurrency(totalValue),
      icon: 'currency-usd',
      color: theme.colors.secondary,
      subtitle: 'Inventory worth',
    },
    {
      title: 'Low Stock',
      value: lowStockItems.toString(),
      icon: 'alert-circle',
      color: theme.colors.tertiary,
      subtitle: 'Items need restock',
    },
    {
      title: 'Out of Stock',
      value: outOfStockItems.toString(),
      icon: 'alert-octagon',
      color: theme.colors.error,
      subtitle: 'Urgent attention',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <View style={styles.statHeader}>
                  <MaterialCommunityIcons 
                    name={stat.icon as any} 
                    size={32} 
                    color={stat.color} 
                  />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statTitle, { color: theme.colors.onSurfaceVariant }]}>
                  {stat.title}
                </Text>
                <Text style={[styles.statSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                  {stat.subtitle}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Card style={styles.recentCard}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Recent Items
            </Text>
            {items.slice(0, 5).map((item) => (
              <View key={item.id} style={styles.recentItem}>
                <View style={styles.recentItemInfo}>
                  <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemDetails, { color: theme.colors.onSurfaceVariant }]}>
                    {item.quantity} units • {formatCurrency(item.price)}
                  </Text>
                </View>
                <View style={[
                  styles.stockBadge,
                  { backgroundColor: getStockStatus(item) === 'in-stock' ? theme.colors.secondaryContainer : 
                    getStockStatus(item) === 'low-stock' ? theme.colors.tertiaryContainer : 
                    theme.colors.errorContainer }
                ]}>
                  <Text style={[
                    styles.stockText,
                    { color: getStockStatus(item) === 'in-stock' ? theme.colors.secondary : 
                      getStockStatus(item) === 'low-stock' ? theme.colors.tertiary : 
                      theme.colors.error }
                  ]}>
                    {getStockStatus(item).replace('-', ' ')}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statHeader: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  recentCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recentItemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});