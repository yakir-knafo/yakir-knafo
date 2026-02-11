import { CateringPackage, EquipmentItem, MenuItem, EventData, EventStatus, EventLocationType, InHouseSubType } from './types';

export const CATERING_PACKAGES: CateringPackage[] = [
  { 
    id: 'prod_1', 
    name: 'מוצר מספר 1: סיור חיצוני טעימות',
    subOptions: [
      { id: 'cheese', name: 'טעימת גבינות, מטבל כל קצוות, מותססים שלנו', price: 35 },
      { id: 'masabacha', name: 'מסבחה ומותססים שלנו', price: 35 },
      { id: 'extended', name: 'טעימה מורחבת, כולל יין', price: 50 }
    ]
  },
  { 
    id: 'prod_2', 
    name: 'מוצר מספר 2: טעימות יין',
    subOptions: [
      { id: 'wine_2', name: 'טעימת 2 סוגי יין', price: 75 },
      { id: 'wine_3_4', name: 'טעימת 3-4 סוגי יין', price: 90 }
    ]
  },
  { 
    id: 'prod_3', 
    name: 'מוצר מספר 3: סדנאות בישול וחוויית Farm-to-Table',
    pricingTiers: [
      { minAttendees: 0, maxAttendees: 9, price: 6000, isFixedPrice: true },
      { minAttendees: 10, maxAttendees: 13, price: 600, isFixedPrice: false },
      { minAttendees: 14, maxAttendees: 17, price: 550, isFixedPrice: false },
      { minAttendees: 18, maxAttendees: 999, price: 550, isFixedPrice: false } 
    ]
  },
  { 
    id: 'prod_4', 
    name: 'מוצר מספר 4: יום חוויית Farm-to-Table מלא (3 תחנות)',
    pricingTiers: [
      { minAttendees: 0, maxAttendees: 9, price: 1900, isFixedPrice: false },
      { minAttendees: 10, maxAttendees: 13, price: 1500, isFixedPrice: false },
      { minAttendees: 14, maxAttendees: 17, price: 1300, isFixedPrice: false },
      { minAttendees: 18, maxAttendees: 999, price: 1300, isFixedPrice: false }
    ]
  },
  { 
    id: 'prod_5', 
    name: 'מוצר מספר 5: יום חוויית Farm-to-Table (2 תחנות)',
    pricingTiers: [
      { minAttendees: 0, maxAttendees: 9, price: 1500, isFixedPrice: false },
      { minAttendees: 10, maxAttendees: 13, price: 950, isFixedPrice: false },
      { minAttendees: 14, maxAttendees: 17, price: 750, isFixedPrice: false },
      { minAttendees: 18, maxAttendees: 999, price: 750, isFixedPrice: false }
    ]
  },
  { 
    id: 'prod_6', 
    name: 'מוצר מספר 6: חוויות במעדנייה (Alhambra Deli)',
    pricingTiers: [
      { minAttendees: 0, maxAttendees: 9, price: 4500, isFixedPrice: true },
      { minAttendees: 10, maxAttendees: 20, price: 400, isFixedPrice: false },
      { minAttendees: 21, maxAttendees: 40, price: 380, isFixedPrice: false },
      { minAttendees: 41, maxAttendees: 999, price: 380, isFixedPrice: false }
    ]
  },
  { 
    id: 'prod_7', 
    name: 'מוצר מספר 7: סיורים קולינריים',
    pricingTiers: [
      { minAttendees: 0, maxAttendees: 9, price: 5500, isFixedPrice: true },
      { minAttendees: 10, maxAttendees: 13, price: 550, isFixedPrice: false },
      { minAttendees: 14, maxAttendees: 17, price: 500, isFixedPrice: false },
      { minAttendees: 18, maxAttendees: 999, price: 500, isFixedPrice: false }
    ]
  }
];

export const KITCHEN_MENU_ITEMS: MenuItem[] = [
  // --- STARTERS (Included) ---
  { 
    id: 'tartare_winter', 
    category: 'STARTERS', 
    name: 'טרטר דג ים חורף: מנת כף, דג ים עם אשכולית אדומה, נענע ובצל סגול', 
    price: 0, 
    baseCost: 18,
    ingredients: [
      { name: 'דג ים טרי (פילה)', unit: 'גרם', quantity: 80 },
      { name: 'אשכולית אדומה', unit: 'יחידה', quantity: 0.25 },
      { name: 'בצל סגול', unit: 'גרם', quantity: 20 },
      { name: 'שמן זית איכותי', unit: 'מ"ל', quantity: 15 }
    ]
  },
  { 
    id: 'sashimi_sea', 
    category: 'STARTERS', 
    name: 'סשימי דג ים: צ\'ילי מותסס, ג\'ינג\'ר, לימון, אשכולית אדומה וסלטון', 
    price: 0, 
    baseCost: 20,
    ingredients: [
      { name: 'דג ים טרי (פילה)', unit: 'גרם', quantity: 100 },
      { name: 'צ\'ילי מותסס', unit: 'כפית', quantity: 1 },
      { name: 'ג\'ינג\'ר טרי', unit: 'גרם', quantity: 5 }
    ]
  },
  { id: 'tartare_green', category: 'STARTERS', name: 'טרטר דג ים: מנת כף, ענבים ירוקים, פיסטוק, מלפפון ועשבי תיבול', price: 0, baseCost: 18 },
  { id: 'cured_fish', category: 'STARTERS', name: 'דג כבוש: סלק, תפוח עץ ירוק ואיולי צ’ילי מותסס', price: 0, baseCost: 15 },
  { id: 'bruschetta_basil', category: 'STARTERS', name: 'ברוסקטה פרי שמן בזיל: גבינה קשה/רכה, אגוזי מלך וריבה עונתית', price: 0, baseCost: 8 },
  { id: 'bruschetta_trout', category: 'STARTERS', name: 'ברוסקטה פורל כבוש: איולי צ’ילי מותסס ובצל ירוק', price: 0, baseCost: 12 },
  { id: 'deli_meze', category: 'STARTERS', name: 'מזטים של הדלי: סלק צלוי, חציל בטחינה, סרדינים, פורל כבוש, צזיקי ועוד', price: 0, baseCost: 14 },
  
  // --- SALADS (Included) ---
  { id: 'salad_winter', category: 'SALADS', name: 'סלט עלים של חורף: הדרים, רוקט, שקדים, דבש ואבן יוגורט', price: 0, baseCost: 12 },
  { id: 'salad_mozzarella', category: 'SALADS', name: 'סלט מוצרלה: ג’רגי’ר, בצל טרי וצלוי, שרי, מוצרלה וסילאן', price: 0, baseCost: 16 },
  { id: 'torn_mozzarella', category: 'SALADS', name: 'קרעי מוצרלה: רוקט, עגבניות צלויות וטריות, סילאן ואבקת אגוזים', price: 0, baseCost: 15 },
  { id: 'salad_seasonal', category: 'SALADS', name: 'סלט עונתי: דלעת צלויה, עגבניות שרי, בצל צלוי וטחינה גולמית', price: 0, baseCost: 10 },
  { id: 'salad_green_cheese', category: 'SALADS', name: 'סלט ירוק עם גבינה צלויה: אגסים, אגוזי מלך, רוטב יין וקורסיקה', price: 0, baseCost: 14 },
  { id: 'tartare_fennel', category: 'SALADS', name: 'טרטר דג, שומר והדרים: דג טרי, שומר צעיר, נענע ואגוזים קלויים', price: 0, baseCost: 18 },
  { id: 'jaffa_alhambra', category: 'SALADS', name: 'יפו פינת אלהמברה: תפוח אדמה דרוס, צזיקי, פלמידה כבושה ומיץ סוסו', price: 0, baseCost: 16 },
  { id: 'salad_freekeh', category: 'SALADS', name: 'סלט פריקה: חיטה מעושנת, הדרים, שומר בר, תפוז דם וסומק', price: 0, baseCost: 9 },
  { id: 'carpaccio_beets', category: 'SALADS', name: 'קרפצ’יו סלקים צבעוניים: עלי חרדל, גבינת בושה, קשיו ודבש', price: 0, baseCost: 11 },
  { id: 'confit_tomatoes', category: 'SALADS', name: 'קונפי עגבניות וגבינת ג׳בנה: תיבול שום, פלפל חריף וגבינת ואדי עתיר', price: 0, baseCost: 13 },
  { id: 'salad_quinoa', category: 'SALADS', name: 'סלט קינואה אדומה ובטטה: גבינת פטה, עשבים, בצל סגול ומלפפון', price: 0, baseCost: 10 },

  // --- MAINS (Included) ---
  { 
    id: 'steak_pumpkin', 
    category: 'MAINS', 
    name: 'סטייק דלעת וכרישה: קרם דלעת, שקדים, כרישה צלויה וגבינת עיזים', 
    price: 0, 
    baseCost: 22,
    ingredients: [
      { name: 'דלעת ערמונים', unit: 'יחידה', quantity: 0.5 },
      { name: 'כרישה', unit: 'יחידה', quantity: 1 },
      { name: 'גבינת עיזים', unit: 'גרם', quantity: 50 },
      { name: 'שקדים קלויים', unit: 'גרם', quantity: 20 }
    ]
  },
  { id: 'pasta_tomatoes', category: 'MAINS', name: 'פסטה עגבניות מותססות: אפונת שלג, שום ירוק וגבינת מנצ’גו', price: 0, baseCost: 18 },
  { id: 'fish_supplement', category: 'MAINS', name: '>> תוספת דג ים לפסטה', price: 25, baseCost: 12 }, 
  { id: 'leek_pumpkin_wrap', category: 'MAINS', name: 'כרישה ודלעת במעטפת: חמאה, יין לבן ומרווה', price: 0, baseCost: 20 },
  { id: 'roasted_root_veg', category: 'MAINS', name: 'ירקות אדמה צלויים: סלקים, גזר ודלעת באש חזקה', price: 0, baseCost: 12 },
  { id: 'pasta_beet_cream', category: 'MAINS', name: 'פסטה קרם סלקים: חמאה, יין לבן ומעט שום', price: 0, baseCost: 16 },
  { id: 'soup_changing', category: 'MAINS', name: 'מרקים מתחלפים: אורגניים וללא תבלינים (מצליבים/בטטה/סלק/ירקות)', price: 0, baseCost: 8 },

  // --- BREADS & DELI (Included) ---
  { id: 'deli_platter', category: 'BREADS', name: 'מגש כל טוב מהמעדנייה: גבינות בוטיק, ממרחים, ירקות מותססים וזיתים', price: 0, baseCost: 25 },
  { id: 'pastries_mix', category: 'BREADS', name: 'מאפים מלוחים ומתוקים: קרואסונים במילויים שונים (גבינות/פטריות/מתוקים)', price: 0, baseCost: 10 },
  { id: 'sourdough_breads', category: 'BREADS', name: 'לחמי מחמצת: מגוון סוגים, באגטים, כוסמין, ללא גלוטן ועוד', price: 0, baseCost: 6 },
  { id: 'burekas_tray', category: 'BREADS', name: 'מאפי פס ובורקסים: גבינות ופטריות ביתיים', price: 0, baseCost: 8 },
  { id: 'brioche_yeast', category: 'BREADS', name: 'חלות בריוש ועוגות שמרים: פקאן, פיסטוק, ריקוטה, שוקולד', price: 0, baseCost: 10 },

  // --- DESSERTS (Included) ---
  { id: 'classic_sweets', category: 'DESSERTS', name: 'מתוקים קלאסיים: רוגלעך ועוגיות שוקולד צ’יפס', price: 0, baseCost: 6 },
  { id: 'tiramisu', category: 'DESSERTS', name: 'טירמיסו עם קפה של אלהמברה', price: 0, baseCost: 12 },
  { id: 'chocolate_mousse', category: 'DESSERTS', name: 'מוס שוקולד עם נוגט ושמן זית', price: 0, baseCost: 14 },
  { id: 'basque_cheesecake', category: 'DESSERTS', name: 'עוגת גבינה בסקית שלמה', price: 0, baseCost: 15 },

  // --- DRINKS (Supplements) ---
  { id: 'lemonade_jug', category: 'DRINKS', name: 'קנקן לימונדה טבעית ונענע', price: 12, baseCost: 3 },
  { id: 'wine_red_boutique', category: 'DRINKS', name: 'בקבוק יין אדום יקב בוטיק', price: 120, baseCost: 60 },
  { id: 'wine_white_boutique', category: 'DRINKS', name: 'בקבוק יין לבן יקב בוטיק', price: 120, baseCost: 60 },
  { id: 'beer_keg', category: 'DRINKS', name: 'חבית בירה מקומית (20 ליטר)', price: 450, baseCost: 200 },
  { id: 'soft_drinks_free', category: 'DRINKS', name: 'שתייה קלה חופשית', price: 15, baseCost: 5 },
];

export const EQUIPMENT_CATALOG: EquipmentItem[] = [
  // --- Standard Rental Equipment ---
  { id: 'full_tableware', name: 'סט כלים מלא לפי סועד (צלחות, כוסות, סכו"ם)', category: 'SERVING', price: 12 },
  { id: 'chair_plastic', name: 'כיסא פלסטיק', category: 'SEATING', price: 5 },
  { id: 'chair_wood', name: 'כיסא עץ', category: 'SEATING', price: 12 },
  { id: 'table_round', name: 'שולחן עגול', category: 'SEATING', price: 40 },
  { id: 'tabun', name: 'טאבון נייד', category: 'KITCHEN', price: 450 },
  { id: 'cooling_unit', name: 'יחידת קירור', category: 'KITCHEN', price: 300 },
  { id: 'butcher_block', name: 'בוצ\'ר הגשה', category: 'SERVING', price: 25 },
  { id: 'cutlery_set', name: 'סט סכו"ם מלא (תוספת)', category: 'SERVING', price: 8 },
  { id: 'wine_glass', name: 'כוס יין (תוספת)', category: 'SERVING', price: 3 },
  { id: 'beer_tap', name: 'ברז בירה נייד', category: 'SERVING', price: 250 },
];

export const INTERNAL_KITS = {
  SHIPKA_KITCHEN: [
    'ארגז כלי עבודה',
    'סיר פסטה גדול',
    'מחבת גדולה',
    'קומקום',
    'כירות גז + מילוי',
    'שולחן מתקפל',
    'סט סכינים',
    'קרש חיתוך'
  ],
  SHIPKA_SERVING: [
    'מגשי הגשה',
    'כפות הגשה',
    'מלקחיים',
    'קנקני מיץ',
    'סינרים',
    'מפות',
    'חד פעמי (כוסות/יין/סכו"ם/מפיות)',
    'כרטיסי ביקור וקטלוגים'
  ],
  SHIPKA_CONSUMABLES: [
    'שמן זית',
    'סילאן',
    'טחינה',
    'קיט תבלינים',
    'לימון',
    'שום',
    'נענע קצוצה',
    'מותססים',
    'קפה למכונה',
    'עוגיות לקפה'
  ]
};

export const MOCK_EVENTS: EventData[] = [];
