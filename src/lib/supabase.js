import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if we have credentials
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabaseInstance = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
}

// Fallback Mock database for instant out-of-the-box operation
class MockDatabase {
  constructor() {
    this.storageKey = 'freelens_mock_db_v2';
    this.initDefaultData();
  }

  initDefaultData() {
    if (typeof window === 'undefined') return;
    
    const existing = localStorage.getItem(this.storageKey);
    if (!existing) {
      const defaultState = {
        // Start logged out so the user can experience the login page!
        session: null, 
        registered_users: [
          {
            id: 'mock-user-id',
            email: 'creator@freelens.co',
            password: 'password123',
            user_metadata: {
              full_name: 'Khushal',
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
              role: 'Motion Designer & Video Creator',
              monthly_goal: 50000,
            }
          }
        ],
        projects: [
          { id: 'p1', name: 'Podcast Edit - Ep 12', amount: 3000, client: 'TechItBro', category: 'Video Editing', date: '2026-06-20', status: 'Completed' },
          { id: 'p2', name: 'YouTube Shorts Package (10)', amount: 2200, client: 'Sarah Tech', category: 'Video Editing', date: '2026-06-18', status: 'Completed' },
          { id: 'p3', name: '5x YouTube Thumbnails', amount: 1500, client: 'Design Studio', category: 'Thumbnails', date: '2026-06-15', status: 'Completed' },
          { id: 'p4', name: 'Logo Motion Intro', amount: 4500, client: 'VibeMedia', category: 'Motion Design', date: '2026-06-10', status: 'Completed' },
          { id: 'p5', name: 'Web Intro Animation', amount: 8000, client: 'Stripe Fan', category: 'Motion Design', date: '2026-05-28', status: 'Completed' },
          { id: 'p6', name: 'Tech Review Video Edit', amount: 12000, client: 'TechItBro', category: 'Video Editing', date: '2026-05-15', status: 'Completed' },
          { id: 'p7', name: 'Monthly Design Retainer', amount: 15000, client: 'StartupHub', category: 'Thumbnails', date: '2026-04-20', status: 'Completed' },
        ],
        clients: [
          { id: 'c1', name: 'TechItBro', avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=80&h=80&q=80', revenue: 15000, projects: 2, growth: 25 },
          { id: 'c2', name: 'StartupHub', avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=80&h=80&q=80', revenue: 15000, projects: 1, growth: 15 },
          { id: 'c3', name: 'VibeMedia', avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=80&h=80&q=80', revenue: 4500, projects: 1, growth: 10 },
          { id: 'c4', name: 'Sarah Tech', avatar: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=80&h=80&q=80', revenue: 2200, projects: 1, growth: 5 },
          { id: 'c5', name: 'Design Studio', avatar: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=80&h=80&q=80', revenue: 15000, projects: 1, growth: -2 }
        ],
        goals: {
          monthly_target: 50000,
          current: 42800 // calculated from p1-p7 for current month
        },
        achievements: [
          { id: 'ach1', name: 'First Client', desc: 'Secure your first paid creative gig', unlocked: true, date: '2026-04-20', icon: '🤝' },
          { id: 'ach2', name: 'First ₹10,000', desc: 'Earn your first ten thousand rupees', unlocked: true, date: '2026-05-15', icon: '💰' },
          { id: 'ach3', name: 'First ₹1 Lakh', desc: 'Reach ₹100,000 in total creative earnings', unlocked: false, date: null, icon: '👑' },
          { id: 'ach4', name: '100 Projects', desc: 'Complete 100 creative deliverables', unlocked: false, date: null, icon: '🔥' },
          { id: 'ach5', name: 'Top Month Ever', desc: 'Exceed your previous highest monthly earnings', unlocked: true, date: '2026-06-20', icon: '🚀' }
        ]
      };
      localStorage.setItem(this.storageKey, JSON.stringify(defaultState));
    }
  }

  getData() {
    if (typeof window === 'undefined') return {};
    this.initDefaultData();
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  saveData(data) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}

export const mockDb = new MockDatabase();

export const supabase = supabaseInstance || {
  auth: {
    signUp: async ({ email, password, options }) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = mockDb.getData();
      
      const newUser = {
        id: 'mock-user-id-' + Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: {
          full_name: options?.data?.full_name || 'Creative Pro',
          avatar_url: options?.data?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
          role: options?.data?.role || 'Creative Freelancer',
          monthly_goal: 50000
        }
      };
      
      data.registered_users.push({
        ...newUser,
        password: password
      });
      data.session = newUser;
      mockDb.saveData(data);
      return { data: { user: newUser }, error: null };
    },
    signInWithPassword: async ({ email, password }) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = mockDb.getData();
      
      const registered = data.registered_users.find(u => u.email === email && u.password === password);
      if (!registered) {
        return { data: { user: null }, error: { message: 'Invalid email or password.' } };
      }
      
      const sessionUser = {
        id: registered.id,
        email: registered.email,
        user_metadata: registered.user_metadata
      };
      data.session = sessionUser;
      mockDb.saveData(data);
      return { data: { user: sessionUser }, error: null };
    },
    signOut: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = mockDb.getData();
      data.session = null;
      mockDb.saveData(data);
      return { error: null };
    },
    getUser: async () => {
      const data = mockDb.getData();
      return { data: { user: data.session || null }, error: null };
    },
    updateUser: async (attributes) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = mockDb.getData();
      if (!data.session) {
        return { data: { user: null }, error: { message: 'No active session.' } };
      }
      const updatedMetadata = {
        ...data.session.user_metadata,
        ...attributes.data
      };
      data.session.user_metadata = updatedMetadata;
      
      const userIndex = data.registered_users.findIndex(u => u.id === data.session.id);
      if (userIndex !== -1) {
        data.registered_users[userIndex].user_metadata = updatedMetadata;
      }
      
      mockDb.saveData(data);
      return { data: { user: data.session }, error: null };
    },
    onAuthStateChange: (callback) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};
