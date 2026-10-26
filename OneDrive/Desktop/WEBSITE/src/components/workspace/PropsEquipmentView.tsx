import React, { useState } from 'react';
import {
  Package,
  Camera,
  Sun,
  Mic,
  Check,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ProductionPlan, PropItem, PropCategory } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export interface PropsEquipmentViewProps {
  plan: ProductionPlan;
  onUpdatePlan: (updatedPlan: ProductionPlan) => void;
}

export const PropsEquipmentView: React.FC<PropsEquipmentViewProps> = ({ plan, onUpdatePlan }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PropCategory>('Props');
  const [newItemNotes, setNewItemNotes] = useState('');

  const toast = useToast();

  const categories: { key: PropCategory; title: string; icon: React.ReactNode; color: string }[] = [
    { key: 'Props', title: 'Scene Props', icon: <Package className="w-4 h-4" />, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { key: 'Camera Equipment', title: 'Camera & Rigs', icon: <Camera className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { key: 'Lighting', title: 'Lighting & Modifiers', icon: <Sun className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { key: 'Audio', title: 'Audio & Microphones', icon: <Mic className="w-4 h-4" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  const preparedCount = plan.propsAndEquipment.filter((p) => p.prepared).length;
  const totalCount = plan.propsAndEquipment.length;
  const percentComplete = totalCount > 0 ? Math.round((preparedCount / totalCount) * 100) : 0;

  const toggleItem = (itemId: string) => {
    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    const item = updatedPlan.propsAndEquipment.find((p) => p.id === itemId);
    if (item) {
      item.prepared = !item.prepared;
      onUpdatePlan(updatedPlan);
      if (item.prepared) {
        toast.success('Gear Prepared', `Marked "${item.name}" as ready.`);
      }
    }
  };

  const handleToggleCategoryAll = (category: PropCategory) => {
    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    const categoryItems = updatedPlan.propsAndEquipment.filter((p) => p.category === category);
    const allChecked = categoryItems.every((p) => p.prepared);

    categoryItems.forEach((p) => {
      p.prepared = !allChecked;
    });

    onUpdatePlan(updatedPlan);
    toast.info('Checklist Updated', `${category} items marked as ${!allChecked ? 'ready' : 'unprepared'}.`);
  };

  const handleDeleteItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    updatedPlan.propsAndEquipment = updatedPlan.propsAndEquipment.filter((p) => p.id !== itemId);
    updatedPlan.summary.propCount = updatedPlan.propsAndEquipment.filter((p) => p.category === 'Props').length;
    onUpdatePlan(updatedPlan);
    toast.info('Item Removed', 'Gear checklist item removed.');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      toast.error('Validation Error', 'Please enter an item name.');
      return;
    }

    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    const newItem: PropItem = {
      id: `pe-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      prepared: false,
      notes: newItemNotes.trim() || undefined,
    };

    updatedPlan.propsAndEquipment.push(newItem);
    if (newItemCategory === 'Props') {
      updatedPlan.summary.propCount += 1;
    }

    onUpdatePlan(updatedPlan);
    toast.success('Item Added', `Added "${newItem.name}" to ${newItemCategory}`);
    setNewItemName('');
    setNewItemNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header & Readiness Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Props & Production Equipment</span>
            <Badge variant="success" size="xs">
              {preparedCount}/{totalCount} Prepared
            </Badge>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mark items as packed and ready before heading on set to prevent missing shoot essentials.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Item
        </Button>
      </div>

      {/* Progress Bar Card */}
      <Card className="p-4 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-white border-indigo-100">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Shoot Preparation Readiness
          </span>
          <span className="font-mono font-bold text-indigo-600">{percentComplete}% Complete</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 p-0.5 overflow-hidden border border-slate-200/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </Card>

      {/* 4 Categorized Columns (Section 18) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => {
          const items = plan.propsAndEquipment.filter((p) => p.category === cat.key);
          const catPreparedCount = items.filter((p) => p.prepared).length;

          return (
            <Card key={cat.key} className="p-4 flex flex-col justify-between space-y-4 border-slate-200/80">
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${cat.color}`}>{cat.icon}</div>
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                        {cat.title}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        {catPreparedCount}/{items.length} ready
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleCategoryAll(cat.key)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Toggle All
                  </button>
                </div>

                {/* Items Checklist */}
                <div className="space-y-2 mt-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 group select-none ${
                        item.prepared
                          ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                          : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center flex-shrink-0 transition-colors ${
                            item.prepared
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'border border-slate-300 bg-white group-hover:border-indigo-400'
                          }`}
                        >
                          {item.prepared && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`text-xs font-medium leading-tight ${
                              item.prepared ? 'line-through text-slate-500' : 'text-slate-800 font-semibold'
                            }`}
                          >
                            {item.name}
                          </p>
                          {item.notes && (
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.notes}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-300 hover:text-rose-500 transition-opacity"
                        title="Delete item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 italic">
                      No items added yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Add Button */}
              <button
                onClick={() => {
                  setNewItemCategory(cat.key);
                  setIsAddModalOpen(true);
                }}
                className="w-full py-2 border border-dashed border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add to {cat.title}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Gear or Prop"
        description="Add a physical prop, camera accessory, light, or microphone to your checklist."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddItem}>
              Add to Checklist
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddItem} className="space-y-4 py-2 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Item Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Wireless Lavalier Microphone or Coffee Mug"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as PropCategory)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="Props">Props</option>
              <option value="Camera Equipment">Camera Equipment</option>
              <option value="Lighting">Lighting</option>
              <option value="Audio">Audio</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Production Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Fully charge batteries, set to 5600K, clean glass carafe"
              value={newItemNotes}
              onChange={(e) => setNewItemNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
