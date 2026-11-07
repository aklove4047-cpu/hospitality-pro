import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PackageCheck,
  AlertTriangle,
  Plus,
  Minus,
  Sparkles,
  Search,
  BookOpen,
  X,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';

export const InventoryManager = () => {
  const {
    tenantInventory,
    tenantMenuItems,
    updateStock,
    addInventoryItem,
    showToast
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState('stock'); // 'stock' | 'recipes'
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDishRecipe, setSelectedDishRecipe] = useState(null);

  // New item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [currentStock, setCurrentStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [unit, setUnit] = useState('kg');
  const [costPerUnit, setCostPerUnit] = useState('');

  const categories = ['all', ...Array.from(new Set(tenantInventory.map(i => i.category)))];

  const filteredInventory = tenantInventory.filter(item => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!name || !currentStock || !minStock || !costPerUnit) {
      showToast("Please fill all ingredient fields", "error");
      return;
    }
    addInventoryItem({
      name,
      category,
      currentStock: parseFloat(currentStock),
      minStock: parseFloat(minStock),
      unit,
      costPerUnit: parseFloat(costPerUnit)
    });
    setAddModalOpen(false);
    setName('');
    setCurrentStock('');
    setMinStock('');
    setCostPerUnit('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-400" />
            Raw Materials & Smart Recipe Engine
          </h2>
          <p className="text-xs text-slate-400">
            Real-time stock ledger with auto-deduction on every customer bill
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTabSub('stock')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabSub === 'stock' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📦 Stock Ledger ({tenantInventory.length})
            </button>
            <button
              onClick={() => setActiveTabSub('recipes')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTabSub === 'recipes' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Dish Recipes ({tenantMenuItems.length})</span>
            </button>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Raw Material</span>
          </button>
        </div>
      </div>

      {activeTabSub === 'stock' ? (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search raw material..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-xl capitalize font-semibold ${
                    categoryFilter === cat ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Table */}
          <div className="glass-card rounded-3xl p-5 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">Item Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Available Stock</th>
                  <th className="py-3 px-3">Min Threshold</th>
                  <th className="py-3 px-3">Cost / Unit</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredInventory.map(item => {
                  const isLow = item.currentStock <= item.minStock;

                  return (
                    <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        {item.name}
                        {isLow && (
                          <span title="Stock below minimum threshold" className="text-rose-400">
                            <AlertTriangle className="w-3.5 h-3.5 inline" />
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-extrabold text-sm">
                        <span className={isLow ? 'text-rose-400' : 'text-emerald-400'}>
                          {item.currentStock} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        ₹{item.costPerUnit} / {item.unit}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isLow ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {isLow ? 'Low Stock' : 'Optimal'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                          <button
                            onClick={() => updateStock(item.id, -1)}
                            title="Subtract 1 unit"
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => updateStock(item.id, 5)}
                            title="Add +5 units"
                            className="px-2 py-0.5 rounded text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/20"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => updateStock(item.id, 10)}
                            title="Add +10 units"
                            className="px-2 py-0.5 rounded text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/20"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Recipes Breakdown View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenantMenuItems.map(dish => (
            <div key={dish.id} className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{dish.name}</h4>
                  <span className="font-mono text-emerald-400 font-bold text-xs">₹{dish.price}</span>
                </div>
                <span className={`h-2.5 w-2.5 rounded-full ${dish.type === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Raw Ingredients Consumption / Order
                </div>
                {dish.recipe && dish.recipe.length > 0 ? (
                  dish.recipe.map((r, i) => {
                    const inv = tenantInventory.find(inv => inv.id === r.ingredientId);
                    return (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{inv ? inv.name : r.ingredientId}</span>
                        <span className="font-mono text-amber-400 font-bold">
                          {r.qty} {inv ? inv.unit : 'unit'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-slate-500 italic">No recipe mapped yet</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Raw Material Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-dropdown rounded-3xl p-6 border border-slate-700 w-full max-w-md space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-emerald-400" />
                Add New Raw Material
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Mozzarella Cheese Block"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Dairy">Dairy</option>
                    <option value="Poultry">Poultry / Meat</option>
                    <option value="Grains">Grains / Flour</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Spices">Spices</option>
                    <option value="Cooking Oil">Cooking Oil</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit of Measurement</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="L">Litre (L)</option>
                    <option value="g">Gram (g)</option>
                    <option value="pcs">Pieces (pcs)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-400 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="10.0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="2.0"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cost / Unit (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="250"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30"
                >
                  Add Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

