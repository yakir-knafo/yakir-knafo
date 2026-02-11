import React, { useState, useEffect, useMemo } from 'react';
import { 
  EventData, 
  EventLocationType, 
  InHouseSubType, 
  ChecklistItem,
  EventStatus,
  EventHistoryItem
} from '../types';
import { CATERING_PACKAGES, EQUIPMENT_CATALOG, INTERNAL_KITS, KITCHEN_MENU_ITEMS } from '../constants';
import { AlertTriangle, CheckCircle, Info, Calculator, MapPin, Truck, ChefHat, Calendar as CalendarIcon, ArrowRight, Utensils, ClipboardList, ScrollText, ChevronLeft, ChevronRight, Package, Users, Save, Send, History, X, Bell, Link, Copy, ExternalLink } from 'lucide-react';

const INITIAL_STATE: EventData = {
  id: '',
  status: EventStatus.DRAFT,
  name: '',
  date: '',
  budget: 0,
  attendees: 0,
  locationType: null,
  catering: { packageId: '', veganCount: 0, glutenFreeCount: 0, allergies: '' },
  selectedMenu: [],
  equipment: [],
  history: []
};

const STEPS = [
  { id: 1, title: 'פרטי אירוע ומיקום' },
  { id: 2, title: 'קטלוג מוצרים' },
  { id: 3, title: 'הרכבת תפריט' },
  { id: 4, title: 'התאמות תזונתיות' },
  { id: 5, title: 'לוגיסטיקה וסיכום' }
];

interface EventFormProps {
    onEventCreated?: (event: EventData) => void;
    onEventUpdated?: (event: EventData) => void;
    initialData?: EventData | null;
}

export const EventForm: React.FC<EventFormProps> = ({ onEventCreated, onEventUpdated, initialData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventData>(INITIAL_STATE);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [resourceConflict, setResourceConflict] = useState<string | null>(null);
  
  // Modals state
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const [pendingChanges, setPendingChanges] = useState<EventHistoryItem[]>([]);
  const [generatedLink, setGeneratedLink] = useState('');

  const isEditMode = !!initialData && !!initialData.id;

  // Initialize form with data if provided (for Edit/Duplicate)
  useEffect(() => {
    if (initialData) {
        setFormData(initialData);
    } else {
        setFormData(INITIAL_STATE);
        setCurrentStep(1);
    }
  }, [initialData]);

  // Resource Conflict Validator Logic
  useEffect(() => {
    if (formData.date) {
        const hasTabun = formData.equipment.some(e => e.itemId === 'tabun');
        const busyDates = ['2023-11-15', '2023-11-20'];
        
        if (hasTabun && busyDates.includes(formData.date)) {
            setResourceConflict('התנגשות משאבים: הטאבון הנייד כבר משוריין לאירוע אחר בתאריך זה.');
        } else {
            setResourceConflict(null);
        }
    } else {
        setResourceConflict(null);
    }
  }, [formData.date, formData.equipment]);

  // Calculate Costs (Memoized)
  const cateringBaseCost = useMemo(() => {
    const pkg = CATERING_PACKAGES.find(p => p.id === formData.catering.packageId);
    if (!pkg) return 0;
    
    const attendees = formData.attendees || 0;

    if (pkg.subOptions) {
        const subOption = pkg.subOptions.find(o => o.id === formData.catering.subOptionId);
        return subOption ? subOption.price * attendees : 0;
    }

    if (pkg.pricingTiers) {
        const tier = pkg.pricingTiers.find(t => attendees >= t.minAttendees && attendees <= t.maxAttendees);
        const effectiveTier = tier || pkg.pricingTiers[pkg.pricingTiers.length - 1];

        if (effectiveTier) {
            return effectiveTier.isFixedPrice ? effectiveTier.price : effectiveTier.price * attendees;
        }
    }

    return 0;
  }, [formData.catering.packageId, formData.catering.subOptionId, formData.attendees]);

  const menuAddonsCost = useMemo(() => {
    return formData.selectedMenu.reduce((total, itemId) => {
        const item = KITCHEN_MENU_ITEMS.find(i => i.id === itemId);
        return total + (item ? item.price * formData.attendees : 0);
    }, 0);
  }, [formData.selectedMenu, formData.attendees]);

  const equipmentCost = useMemo(() => {
    return formData.equipment.reduce((total, item) => {
      const catalogItem = EQUIPMENT_CATALOG.find(c => c.id === item.itemId);
      return total + (catalogItem ? catalogItem.price * item.quantity : 0);
    }, 0);
  }, [formData.equipment]);

  const totalCost = cateringBaseCost + menuAddonsCost + equipmentCost;
  const isOverBudget = formData.budget > 0 && totalCost > formData.budget;

  // Sync Tableware Quantity
  useEffect(() => {
    const tablewareId = 'full_tableware';
    const hasTableware = formData.equipment.find(e => e.itemId === tablewareId);
    
    if (hasTableware && hasTableware.quantity !== formData.attendees) {
      setFormData(prev => ({
        ...prev,
        equipment: prev.equipment.map(e => 
          e.itemId === tablewareId ? { ...e, quantity: formData.attendees } : e
        )
      }));
    }
  }, [formData.attendees, formData.equipment]);

  // Generate Checklist Logic
  useEffect(() => {
    const tasks: ChecklistItem[] = [];
    if (formData.locationType === EventLocationType.STANDING) {
      tasks.push({ id: 'stand-1', department: 'LOGISTICS', task: 'ביטול כיסאות והצבת שולחנות בר', isCompleted: false });
    }
    if (formData.locationType === EventLocationType.IN_HOUSE) {
      tasks.push({ id: 'in-1', department: 'OPS', task: 'סנכרון יומן חדר ישיבות', isCompleted: false });
      if (formData.inHouseSubType === InHouseSubType.COOKING) {
        tasks.push({ id: 'cook-1', department: 'LOGISTICS', task: 'הכנת סינרים למשתתפים', isCompleted: false });
        tasks.push({ id: 'cook-2', department: 'OPS', task: 'וידוא נקודות מים וחשמל פעילות', isCompleted: false });
      }
      if (formData.inHouseSubType === InHouseSubType.WINE) {
        tasks.push({ id: 'wine-1', department: 'LOGISTICS', task: 'הכנת פותחנים, שמפניירות וקרח', isCompleted: false });
        tasks.push({ id: 'wine-2', department: 'LOGISTICS', task: 'הכנת כוסות יין', isCompleted: false });
      }
    }
    if (formData.locationType === EventLocationType.EXTERNAL) {
      tasks.push({ id: 'ext-1', department: 'OPS', task: 'בדיקת תחזית מזג אוויר', isCompleted: false });
      tasks.push({ 
        id: 'shipka-kitchen', 
        department: 'LOGISTICS', 
        task: `העמסת קיט מטבח: ${INTERNAL_KITS.SHIPKA_KITCHEN.join(', ')}`, 
        isCompleted: false 
      });
    }
    if (formData.catering.allergies) {
       tasks.push({ id: 'cat-1', department: 'OPS', task: 'וידוא סימון מנות אלרגניות מול הקייטרינג', isCompleted: false });
    }
    setChecklist(tasks);
  }, [formData.locationType, formData.inHouseSubType, formData.catering.allergies]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleEquipmentChange = (itemId: string, qty: number) => {
    setFormData(prev => {
      const existing = prev.equipment.find(e => e.itemId === itemId);
      let newEquipment;
      if (qty <= 0) {
        newEquipment = prev.equipment.filter(e => e.itemId !== itemId);
      } else if (existing) {
        newEquipment = prev.equipment.map(e => e.itemId === itemId ? { ...e, quantity: qty } : e);
      } else {
        newEquipment = [...prev.equipment, { itemId, quantity: qty }];
      }
      return { ...prev, equipment: newEquipment };
    });
  };

  const toggleMenuSelection = (itemId: string) => {
    setFormData(prev => {
        const isSelected = prev.selectedMenu.includes(itemId);
        return {
            ...prev,
            selectedMenu: isSelected 
                ? prev.selectedMenu.filter(id => id !== itemId)
                : [...prev.selectedMenu, itemId]
        };
    });
  };

  const toggleTableware = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const tablewareId = 'full_tableware';
    if (checked) {
      handleEquipmentChange(tablewareId, formData.attendees || 0);
    } else {
      handleEquipmentChange(tablewareId, 0);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      if (currentStep === 1) {
        if (!formData.name || !formData.date || formData.attendees <= 0) {
          alert('אנא מלא שם אירוע, תאריך ומספר משתתפים תקין');
          return;
        }
      }
      if (currentStep === 2) {
          if (!formData.catering.packageId) {
              alert('אנא בחר חבילת שירות מהקטלוג');
              return;
          }
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const calculateChanges = (): EventHistoryItem[] => {
      if (!initialData) return [];
      const changes: EventHistoryItem[] = [];
      const now = new Date().toLocaleString('he-IL');
      const user = "ישראל כהן";

      if (initialData.attendees !== formData.attendees) {
          changes.push({ timestamp: now, user, action: 'שינוי כמות משתתפים', details: `מ-${initialData.attendees} ל-${formData.attendees}` });
      }
      if (initialData.date !== formData.date) {
          changes.push({ timestamp: now, user, action: 'שינוי תאריך אירוע', details: `מ-${initialData.date} ל-${formData.date}` });
      }
      if (initialData.locationType !== formData.locationType) {
          changes.push({ timestamp: now, user, action: 'שינוי סוג מיקום', details: `מ-${initialData.locationType} ל-${formData.locationType}` });
      }
      if (initialData.selectedMenu.length !== formData.selectedMenu.length) {
          changes.push({ timestamp: now, user, action: 'עדכון תפריט', details: 'בוצע שינוי בבחירת המנות' });
      }
      return changes;
  };

  const handleSaveClick = (status: EventStatus) => {
      // Logic for "Send Quote" - Generate Link
      if (status === EventStatus.QUOTE_SENT) {
          const fakeId = formData.id || `evt_${Math.floor(Math.random() * 10000)}`;
          setGeneratedLink(`https://eventpro.app/p/${fakeId}`);
          
          if (isEditMode) {
              // If editing, check for changes first
              const changes = calculateChanges();
              if (changes.length > 0) {
                  setPendingChanges(changes);
                  setShowNotifyModal(true);
                  // Share modal will be opened after confirmUpdate
                  return;
              }
          }
          
          // Save immediately and show share link
          const eventToSave = { ...formData, status, id: formData.id || fakeId };
          if (isEditMode && onEventUpdated) onEventUpdated(eventToSave);
          if (!isEditMode && onEventCreated) onEventCreated(eventToSave);
          
          setShowShareModal(true);
          return;
      }

      // Normal Save logic
      if (isEditMode) {
          const changes = calculateChanges();
          if (changes.length > 0) {
              setPendingChanges(changes);
              setShowNotifyModal(true);
          } else {
              const updatedEvent = { ...formData, status };
              if(onEventUpdated) onEventUpdated(updatedEvent);
          }
      } else {
          const newEvent = { ...formData, status };
          if(onEventCreated) onEventCreated(newEvent);
      }
  };

  const confirmUpdate = () => {
      const updatedEvent = { 
          ...formData, 
          history: [...(formData.history || []), ...pendingChanges]
      };
      if(onEventUpdated) onEventUpdated(updatedEvent);
      setShowNotifyModal(false);
      
      // If we were trying to send a quote, show the link modal now
      if (generatedLink) {
          setShowShareModal(true);
      }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedLink);
      alert('הלינק הועתק ללוח!');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800">פרטי אירוע</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם האירוע</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="לדוגמה: הרמת כוסית חברה"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תאריך</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מספר משתתפים</label>
                <input
                  type="number"
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תקציב (אופציונלי)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-6">מיקום</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: EventLocationType.STANDING, label: 'אירוע עמידה', icon: Users },
                { id: EventLocationType.IN_HOUSE, label: 'חלל פנימי (In-House)', icon: MapPin },
                { id: EventLocationType.EXTERNAL, label: 'אירוע חוץ / משק', icon: Truck },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData(prev => ({ ...prev, locationType: type.id as EventLocationType }))}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                    formData.locationType === type.id
                      ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-500'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <type.icon size={24} />
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>

            {formData.locationType === EventLocationType.IN_HOUSE && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">סוג פעילות בחלל</label>
                <div className="flex gap-4">
                  {[
                    { id: InHouseSubType.COOKING, label: 'סדנת בישול' },
                    { id: InHouseSubType.WINE, label: 'טעימות יין' },
                    { id: InHouseSubType.LECTURE, label: 'הרצאה / ישיבה' },
                  ].map((sub) => (
                    <label key={sub.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="inHouseSubType"
                        checked={formData.inHouseSubType === sub.id}
                        onChange={() => setFormData(prev => ({ ...prev, inHouseSubType: sub.id as InHouseSubType }))}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>{sub.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {resourceConflict && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                    <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm font-medium">{resourceConflict}</p>
                </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 animate-fadeIn">
             <h3 className="text-lg font-bold text-gray-800">בחירת מוצר / חבילת שירות</h3>
             <div className="grid grid-cols-1 gap-4">
                {CATERING_PACKAGES.map((pkg) => {
                    const isSelected = formData.catering.packageId === pkg.id;
                    return (
                        <div 
                            key={pkg.id}
                            onClick={() => setFormData(prev => ({ 
                                ...prev, 
                                catering: { ...prev.catering, packageId: pkg.id, subOptionId: undefined } 
                            }))}
                            className={`border rounded-xl p-4 cursor-pointer transition-all ${
                                isSelected ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-gray-800">{pkg.name}</span>
                                {isSelected && <CheckCircle size={20} className="text-amber-600" />}
                            </div>
                            
                            {/* Sub Options (Products 1 & 2) */}
                            {isSelected && pkg.subOptions && (
                                <div className="mt-3 space-y-2 bg-white/50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500 mb-2">בחר אפשרות:</p>
                                    {pkg.subOptions.map(opt => (
                                        <label key={opt.id} className="flex items-center justify-between p-2 rounded hover:bg-white cursor-pointer border border-transparent hover:border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="radio" 
                                                    name={`sub_opt_${pkg.id}`}
                                                    checked={formData.catering.subOptionId === opt.id}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            catering: { ...prev.catering, subOptionId: opt.id }
                                                        }));
                                                    }}
                                                    className="text-amber-600 focus:ring-amber-500"
                                                />
                                                <span className="text-sm text-gray-700">{opt.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">₪{opt.price}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* Pricing Tiers (Products 3-7) */}
                            {isSelected && pkg.pricingTiers && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                                    <div className="flex items-center gap-2 mb-1 font-bold">
                                        <Info size={16} />
                                        מדרגות מחיר
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {pkg.pricingTiers.map((tier, i) => (
                                            <div key={i} className={`${
                                                formData.attendees >= tier.minAttendees && formData.attendees <= tier.maxAttendees 
                                                ? 'font-bold bg-blue-100 p-1 rounded' 
                                                : 'text-blue-600'
                                            }`}>
                                                {tier.maxAttendees === 999 ? `${tier.minAttendees}+` : `${tier.minAttendees}-${tier.maxAttendees}`} משתתפים: 
                                                ₪{tier.price} {tier.isFixedPrice ? '(פיקס)' : '(לראש)'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
             </div>
          </div>
        );

      case 3:
        const categories = Array.from(new Set(KITCHEN_MENU_ITEMS.map(i => i.category)));
        const categoryLabels: Record<string, string> = {
            'BREADS': 'לחמים ומאפים',
            'STARTERS': 'מנות פתיחה',
            'SALADS': 'סלטים',
            'MAINS': 'עיקריות ותוספות',
            'DESSERTS': 'קינוחים',
            'DRINKS': 'שתייה ואלכוהול'
        };

        return (
            <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-800">הרכבת תפריט</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                   {categories.map(cat => (
                       <a href={`#cat-${cat}`} key={cat} className="whitespace-nowrap px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200">
                           {categoryLabels[cat] || cat}
                       </a>
                   ))}
                </div>
                
                <div className="space-y-8 h-[500px] overflow-y-auto pr-2">
                    {categories.map(cat => (
                        <div key={cat} id={`cat-${cat}`}>
                            <h4 className="font-bold text-gray-700 mb-3 border-b pb-1 sticky top-0 bg-white z-10">{categoryLabels[cat] || cat}</h4>
                            <div className="space-y-3">
                                {KITCHEN_MENU_ITEMS.filter(i => i.category === cat).map(item => {
                                    const isSelected = formData.selectedMenu.includes(item.id);
                                    return (
                                        <div 
                                            key={item.id} 
                                            onClick={() => toggleMenuSelection(item.id)}
                                            className={`flex justify-between items-start p-3 rounded-lg border cursor-pointer transition-colors ${
                                                isSelected ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-amber-500 border-amber-500' : 'border-gray-300 bg-white'}`}>
                                                    {isSelected && <CheckCircle size={14} className="text-white" />}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">{item.name}</div>
                                                    {item.price > 0 && <div className="text-xs text-amber-600 font-bold mt-1">+₪{item.price} לראש</div>}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );

      case 4:
        return (
            <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-800">התאמות תזונתיות</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="flex items-center gap-2 mb-4 text-green-800 font-bold">
                            <Utensils size={20} />
                            מנות מיוחדות
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">כמות טבעונים</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.catering.veganCount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, catering: { ...prev.catering, veganCount: parseInt(e.target.value) || 0 } }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">כמות רגישים לגלוטן</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.catering.glutenFreeCount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, catering: { ...prev.catering, glutenFreeCount: parseInt(e.target.value) || 0 } }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">הערות אלרגיות נוספות</label>
                        <textarea
                            rows={6}
                            value={formData.catering.allergies}
                            onChange={(e) => setFormData(prev => ({ ...prev, catering: { ...prev.catering, allergies: e.target.value } }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                            placeholder="פרט רגישויות נוספות (למשל: בוטנים, שומשום, לקטוז) או דגשים למטבח..."
                        ></textarea>
                    </div>
                </div>
            </div>
        );

      case 5:
        const rentalItems = EQUIPMENT_CATALOG.filter(i => i.id !== 'full_tableware');
        const hasTableware = formData.equipment.some(e => e.itemId === 'full_tableware' && e.quantity > 0);

        return (
            <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-800">לוגיסטיקה וציוד</h3>
                
                {/* Equipment Selection */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="font-bold text-gray-700 mb-4">ציוד והשכרות</h4>
                    
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div>
                            <span className="font-bold text-gray-800">סט כלים מלא (צלחות, כוסות, סכו"ם)</span>
                            <div className="text-xs text-gray-500 mt-1">מחושב אוטומטית לפי כמות משתתפים ({formData.attendees})</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={hasTableware} onChange={toggleTableware} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rentalItems.map(item => {
                            const currentQty = formData.equipment.find(e => e.itemId === item.id)?.quantity || 0;
                            return (
                                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                                    <div>
                                        <div className="font-medium text-sm text-gray-800">{item.name}</div>
                                        <div className="text-xs text-gray-500">₪{item.price} ליחידה</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleEquipmentChange(item.id, Math.max(0, currentQty - 1))}
                                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium">{currentQty}</span>
                                        <button 
                                            onClick={() => handleEquipmentChange(item.id, currentQty + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Final Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t">
                    <button 
                        onClick={() => handleSaveClick(EventStatus.DRAFT)}
                        className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        {isEditMode ? 'שמור שינויים' : 'שמור כטיוטה'}
                    </button>
                    <button 
                        onClick={() => handleSaveClick(EventStatus.QUOTE_SENT)}
                        className="flex-1 py-3 px-4 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                    >
                        <Send size={20} />
                        {isEditMode ? 'עדכן ושלח הצעת מחיר' : 'צור לינק להצעת מחיר'}
                    </button>
                </div>
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col h-full">
        
        {/* Wizard Stepper */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
           <div className="flex justify-between items-center relative overflow-x-auto no-scrollbar">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0"></div>
              {STEPS.map((step) => {
                 const isActive = currentStep === step.id;
                 const isCompleted = currentStep > step.id;
                 return (
                   <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-3 min-w-[80px]">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                        isActive ? 'border-amber-500 bg-amber-50 text-amber-600' :
                        isCompleted ? 'border-green-500 bg-green-500 text-white' :
                        'border-gray-200 text-gray-400'
                      }`}>
                         {isCompleted ? <CheckCircle size={14} /> : step.id}
                      </div>
                      <span className={`text-[10px] mt-1 font-medium text-center ${isActive ? 'text-amber-600' : 'text-gray-400'}`}>{step.title}</span>
                   </div>
                 )
              })}
           </div>
        </div>

        {/* Step Content */}
        <div className="flex-1">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pb-10">
           <button 
             onClick={prevStep} 
             disabled={currentStep === 1}
             className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 bg-white border border-gray-200'}`}
           >
             <ChevronRight size={20} />
             הקודם
           </button>
           
           {currentStep < STEPS.length && (
             <button 
               onClick={nextStep} 
               className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
             >
               הבא
               <ChevronLeft size={20} />
             </button>
           )}
        </div>

      </div>

      {/* Sidebar Summary (Always Visible) */}
      <div className="lg:col-span-1 space-y-6">
        {/* Cost Summary */}
        <div className={`rounded-xl shadow-lg border p-6 text-white transition-colors ${isOverBudget ? 'bg-red-600 border-red-700' : 'bg-slate-800 border-slate-900'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="text-gray-300" size={24} />
            <h3 className="text-xl font-bold">סיכום ביניים</h3>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-gray-300">
              <span>חבילת בסיס ({formData.attendees} סועדים)</span>
              <span>₪{cateringBaseCost.toLocaleString()}</span>
            </div>
            {menuAddonsCost > 0 && (
                <div className="flex justify-between items-center text-gray-300">
                    <span>תוספות תפריט</span>
                    <span>₪{menuAddonsCost.toLocaleString()}</span>
                </div>
            )}
            <div className="flex justify-between items-center text-gray-300">
              <span>ציוד ותפעול</span>
              <span>₪{equipmentCost.toLocaleString()}</span>
            </div>
            <div className="h-px bg-white/20 my-2"></div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>סה"כ לתשלום</span>
              <span>₪{totalCost.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex justify-between text-sm mb-1 text-gray-300">
              <span>תקציב מאושר</span>
              <span>₪{formData.budget.toLocaleString()}</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-300' : 'bg-green-400'}`} 
                style={{ width: `${Math.min((totalCost / (formData.budget || 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tasks Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4 text-green-600">
            <ClipboardList size={20} />
            <h3 className="text-lg font-bold">משימות לביצוע</h3>
          </div>
          
          <div className="space-y-3">
            {checklist.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">השלם את פרטי האירוע כדי ליצור רשימת משימות</p>
            ) : (
              checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider flex-shrink-0 ${
                    item.department === 'IT' ? 'bg-blue-100 text-blue-700' :
                    item.department === 'LOGISTICS' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {item.department}
                  </div>
                  <span className="text-sm text-gray-700 leading-snug break-words">{item.task}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* History Button (Edit Mode Only) */}
        {isEditMode && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 text-gray-700">
                    <History size={20} />
                    <h3 className="text-lg font-bold">היסטוריה</h3>
                 </div>
             </div>
             <button 
                onClick={() => setShowHistoryModal(true)}
                className="w-full py-2 border border-gray-200 rounded-lg text-gray-600 text-sm hover:bg-gray-50 flex items-center justify-center gap-2"
             >
                <History size={16} />
                צפה ביומן שינויים
             </button>
          </div>
        )}

      </div>
    </div>

    {/* Notification Modal */}
    {showNotifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Bell className="text-amber-500" />
                        עדכון מחלקות
                    </h3>
                    <button onClick={() => setShowNotifyModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                
                <p className="text-gray-600 mb-4">
                    זוהו שינויים מהותיים באירוע. בחר את המחלקות שיקבלו "עדכון Brief" מיידי למייל/וואטסאפ:
                </p>

                <div className="space-y-3 mb-6">
                    {['מטבח (שינוי כמויות/תפריט)', 'תפעול ולוגיסטיקה (שינוי מיקום/ציוד)', 'מכירות (עדכון הצעת מחיר)'].map((dept, idx) => (
                        <label key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer border hover:border-amber-300 transition-colors">
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500" />
                            <span className="text-sm font-medium text-gray-700">{dept}</span>
                        </label>
                    ))}
                </div>

                <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 mb-6">
                    <span className="font-bold">שינויים שזוהו:</span>
                    <ul className="list-disc list-inside mt-1">
                        {pendingChanges.map((change, i) => (
                            <li key={i}>{change.action}: {change.details}</li>
                        ))}
                    </ul>
                </div>

                <button 
                    onClick={confirmUpdate}
                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                >
                    אשר ושלח עדכונים
                </button>
            </div>
        </div>
    )}

    {/* Share Link Modal */}
    {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Link className="text-blue-500" />
                        לינק להצעת מחיר
                    </h3>
                    <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                        הלינק לאירוע <strong>{formData.name}</strong> מוכן לשליחה. הלקוח יוכל לצפות בהצעה ולאשר אותה אונליין.
                    </p>
                    
                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg border border-gray-200">
                        <input 
                            type="text" 
                            readOnly 
                            value={generatedLink} 
                            className="bg-transparent border-none focus:ring-0 text-gray-600 text-sm w-full font-mono"
                        />
                        <button onClick={copyToClipboard} className="text-gray-500 hover:text-blue-600 transition-colors" title="העתק לינק">
                            <Copy size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button onClick={copyToClipboard} className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                            <Copy size={18} />
                            העתק
                        </button>
                        <a 
                            href={`https://wa.me/?text=${encodeURIComponent(`היי, מצורפת הצעת המחיר לאירוע "${formData.name}":\n${generatedLink}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#128C7E] transition-colors"
                        >
                            <ExternalLink size={18} />
                            וואטסאפ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )}

    {/* History Modal */}
    {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 h-[600px] flex flex-col animate-fadeIn">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <History className="text-blue-600" />
                        יומן שינויים מלא (Audit Trail)
                    </h3>
                    <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2">
                     <div className="relative border-r-2 border-gray-200 mr-3 space-y-8">
                        {(!formData.history || formData.history.length === 0) ? (
                            <div className="pr-6 text-gray-400 text-center py-10">אין היסטוריית שינויים לאירוע זה.</div>
                        ) : (
                            [...formData.history].reverse().map((item, idx) => (
                                <div key={idx} className="relative pr-6">
                                    <div className="absolute -right-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
                                    <div className="text-sm font-bold text-gray-800">{item.action}</div>
                                    <div className="text-xs text-gray-500 mb-1">{item.timestamp} • ע"י {item.user}</div>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 mt-2">
                                        {item.details}
                                    </div>
                                </div>
                            ))
                        )}
                     </div>
                </div>
                
                <div className="pt-4 border-t mt-4 flex justify-end">
                    <button 
                        onClick={() => setShowHistoryModal(false)}
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
                    >
                        סגור
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};