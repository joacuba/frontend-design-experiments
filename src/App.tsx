import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StatsCards } from './components/StatsCards';
import { InventoryTable } from './components/InventoryTable';
import { ItemModal } from './components/ItemModal';
import { FilterBar } from './components/FilterBar';
import { useInventory } from './hooks/useInventory';
import { useFilters } from './hooks/useFilters';
import { useAuth } from './hooks/useAuth';
import { InventoryItem } from './types/inventory';

function App() {
  const { user, isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();

  const { items, addItem, deleteItem, editItem } = useInventory();
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    stockFilter,
    setStockFilter,
    filteredItems,
  } = useFilters(items);

  const handleAddItem = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    if (editingItem) {
      editItem(itemData, editingItem.id);
    } else {
      addItem(itemData);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={login} isLoading={authLoading} />;
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />
      
      <div className="flex-1 flex flex-col">
        <Header
          onAddItem={handleAddItem}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          user={user}
          onLogout={logout}
        />
        
        <main className="flex-1 p-8">
          {activeTab === 'inventory' && (
            <>
              <StatsCards items={items} />
              
              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
                stockFilter={stockFilter}
                onStockFilterChange={setStockFilter}
              />
              
              <InventoryTable
                items={filteredItems}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </>
          )}
          
          {activeTab === 'dashboard' && (
            <Dashboard items={items} />
          )}
          
          {(activeTab === 'analytics' || activeTab === 'alerts' || activeTab === 'suppliers' || activeTab === 'settings') && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 capitalize">{activeTab}</h3>
              <p className="text-gray-500">This section is under development and will be available soon.</p>
            </div>
          )}
        </main>
      </div>

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        item={editingItem}
      />
    </div>
  );
}

export default App;