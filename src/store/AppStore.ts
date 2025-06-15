import { supabase } from './../lib/supabase';
import { create } from 'zustand';

export const useAppStore = create((set) => ({
  isAuthenticated: false,
  userType: null,
  loading: {
    auth: true,
  },

  initializeApp: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const userId = session.user.id;

      // 👇 ดึง role จากตาราง users (คุณอาจมี column `role` ใน users)
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (data && !error) {
        set({
          isAuthenticated: true,
          userType: data.role,
          loading: { auth: false },
        });
      } else {
        set({
          isAuthenticated: true,
          userType: null,
          loading: { auth: false },
        });
      }
    } else {
      set({
        isAuthenticated: false,
        userType: null,
        loading: { auth: false },
      });
    }
  },
}));
