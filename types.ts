
export enum EventLocationType {
  STANDING = 'STANDING',
  IN_HOUSE = 'IN_HOUSE',
  EXTERNAL = 'EXTERNAL',
}

export enum InHouseSubType {
  COOKING = 'COOKING',
  WINE = 'WINE',
  LECTURE = 'LECTURE',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  QUOTE_SENT = 'QUOTE_SENT',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'SEATING' | 'KITCHEN' | 'SERVING' | 'CONSUMABLES' | 'GENERAL';
  price: number;
}

export interface Ingredient {
  name: string;
  unit: string;
  quantity: number; // Quantity per single portion
}

export interface MenuItem {
  id: string;
  category: 'BREADS' | 'STARTERS' | 'SALADS' | 'MAINS' | 'SIDES' | 'DESSERTS' | 'DRINKS';
  name: string;
  price: number; // Price per head (Revenue)
  baseCost: number; // Estimated cost to produce (COGS)
  ingredients?: Ingredient[]; // For KDS/Shopping list logic
}

export interface SelectedEquipment {
  itemId: string;
  quantity: number;
}

export interface CateringSelection {
  packageId: string;
  subOptionId?: string; // Added for selecting specific sub-options (e.g., wine types)
  veganCount: number;
  glutenFreeCount: number;
  allergies: string;
}

export interface EventHistoryItem {
  timestamp: string;
  user: string;
  action: string; // e.g., "Updated Headcount", "Changed Date"
  details: string; // e.g., "From 40 to 45"
}

export interface EventData {
  id: string;
  status: EventStatus;
  name: string;
  date: string;
  budget: number;
  attendees: number;
  locationType: EventLocationType | null;
  // Specifics
  inHouseSubType?: InHouseSubType;
  duration?: number; // In hours
  externalAddress?: string;
  externalWazeLink?: string;
  travelTime?: number; // Minutes
  supplierContact?: string;
  supplierConfirmed?: boolean;
  // Modules
  catering: CateringSelection;
  selectedMenu: string[]; // IDs of selected menu items
  equipment: SelectedEquipment[];
  // Audit Log
  history: EventHistoryItem[];
}

export interface ChecklistItem {
  id: string;
  department: 'IT' | 'LOGISTICS' | 'OPS';
  task: string;
  isCompleted: boolean;
}

// New Interfaces for Complex Pricing
export interface CateringSubOption {
  id: string;
  name: string;
  price: number;
}

export interface PricingTier {
  minAttendees: number;
  maxAttendees: number;
  price: number;
  isFixedPrice: boolean; // true = total price for the group, false = per head
}

export interface CateringPackage {
  id: string;
  name: string;
  subOptions?: CateringSubOption[]; // For Product 1 & 2
  pricingTiers?: PricingTier[];     // For Product 3-7
}
