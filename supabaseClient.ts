import { createClient } from '@supabase/supabase-js';

// הגדרת פרטי החיבור ל-Supabase
// במידה ומשתני הסביבה לא קיימים, נשתמש בפרטים שסופקו ישירות
const projectUrl = 'https://rrhaixmhfiopiwlfbbsd.supabase.co';
const projectKey = 'sb_publishable_k7bSANGO39hdZgy56msF7w_OP7O8Ufm';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || projectUrl;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || projectKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

// פונקציית עזר להמרת נתונים ממסד הנתונים (snake_case) לפורמט האפליקציה (camelCase)
export const mapEventFromDb = (dbEvent: any): any => {
  return {
    ...dbEvent,
    locationType: dbEvent.location_type,
    inHouseSubType: dbEvent.in_house_sub_type,
    selectedMenu: dbEvent.selected_menu || [],
    catering: dbEvent.catering || {},
    equipment: dbEvent.equipment || [],
    history: dbEvent.history || []
  };
};

// פונקציית עזר להמרת נתונים מהאפליקציה למסד הנתונים
export const mapEventToDb = (event: any): any => {
  return {
    id: event.id,
    status: event.status,
    name: event.name,
    date: event.date,
    budget: event.budget,
    attendees: event.attendees,
    location_type: event.locationType,
    in_house_sub_type: event.inHouseSubType,
    catering: event.catering,
    selected_menu: event.selectedMenu,
    equipment: event.equipment,
    history: event.history,
    updated_at: new Date().toISOString()
  };
};