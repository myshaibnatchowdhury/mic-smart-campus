export type SDUIComponentType =
  | 'banner_slider'
  | 'stats_card'
  | 'quick_actions_grid'
  | 'attendance_summary'
  | 'fee_due_card'
  | 'routine_timeline'
  | 'recent_notices'
  | 'upcoming_exams'
  | 'recent_results'
  | 'announcement_bar';

export interface SDUIComponentConfig {
  id: string;
  type: SDUIComponentType;
  title?: string;
  order: number;
  visible: boolean;
  props?: Record<string, any>;
  roles_allowed?: string[];
}

export interface SDUIThemeConfig {
  primary_color: string;
  secondary_color: string;
  accent_gold: string;
  background_light: string;
  background_dark: string;
  card_radius: number;
  font_family: string;
}

export interface SDUIAppConfig {
  institution_id?: string | null;
  version: string;
  min_supported_version: string;
  force_update: boolean;
  maintenance_mode: boolean;
  maintenance_message?: string | null;
  theme: SDUIThemeConfig;
  screens: {
    student_dashboard: {
      components: SDUIComponentConfig[];
    };
    teacher_dashboard: {
      components: SDUIComponentConfig[];
    };
    parent_dashboard: {
      components: SDUIComponentConfig[];
    };
  };
  navigation_items: {
    key: string;
    label_en: string;
    label_bn: string;
    icon: string;
    route: string;
    roles: string[];
    visible: boolean;
  }[];
  announcement_banner?: {
    enabled: boolean;
    text_en: string;
    text_bn: string;
    type: 'info' | 'warning' | 'alert';
    dismissible: boolean;
  } | null;
}

export const DEFAULT_SDUI_THEME: SDUIThemeConfig = {
  primary_color: '#064E3B', // Emerald / Deep Forest Green
  secondary_color: '#047857', // Forest Emerald
  accent_gold: '#D97706', // Subtle Academic Gold
  background_light: '#F8FAFC',
  background_dark: '#0F172A',
  card_radius: 16,
  font_family: 'Inter'
};

export const DEFAULT_SDUI_CONFIG: SDUIAppConfig = {
  version: '1.0.0',
  min_supported_version: '1.0.0',
  force_update: false,
  maintenance_mode: false,
  theme: DEFAULT_SDUI_THEME,
  screens: {
    student_dashboard: {
      components: [
        { id: 'announcement', type: 'announcement_bar', order: 1, visible: true },
        { id: 'stats', type: 'stats_card', order: 2, visible: true },
        { id: 'quick_actions', type: 'quick_actions_grid', order: 3, visible: true },
        { id: 'routine', type: 'routine_timeline', order: 4, visible: true },
        { id: 'notices', type: 'recent_notices', order: 5, visible: true },
        { id: 'exams', type: 'upcoming_exams', order: 6, visible: true },
        { id: 'results', type: 'recent_results', order: 7, visible: true }
      ]
    },
    teacher_dashboard: {
      components: [
        { id: 'stats', type: 'stats_card', order: 1, visible: true },
        { id: 'quick_actions', type: 'quick_actions_grid', order: 2, visible: true },
        { id: 'routine', type: 'routine_timeline', order: 3, visible: true },
        { id: 'notices', type: 'recent_notices', order: 4, visible: true }
      ]
    },
    parent_dashboard: {
      components: [
        { id: 'stats', type: 'stats_card', order: 1, visible: true },
        { id: 'quick_actions', type: 'quick_actions_grid', order: 2, visible: true },
        { id: 'routine', type: 'routine_timeline', order: 3, visible: true },
        { id: 'results', type: 'recent_results', order: 4, visible: true },
        { id: 'notices', type: 'recent_notices', order: 5, visible: true }
      ]
    }
  },
  navigation_items: [
    { key: 'dashboard', label_en: 'Dashboard', label_bn: 'ড্যাশবোর্ড', icon: 'dashboard', route: '/dashboard', roles: ['student', 'teacher', 'parent', 'institution_admin'], visible: true },
    { key: 'routine', label_en: 'Routine', label_bn: 'রুটিন', icon: 'schedule', route: '/routine', roles: ['student', 'teacher', 'parent'], visible: true },
    { key: 'attendance', label_en: 'Attendance', label_bn: 'উপস্থিতি', icon: 'how_to_reg', route: '/attendance', roles: ['student', 'teacher', 'parent'], visible: true },
    { key: 'exams', label_en: 'Exams & Marks', label_bn: 'পরীক্ষা ও ফলাফল', icon: 'grade', route: '/exams', roles: ['student', 'teacher', 'parent'], visible: true },
    { key: 'fees', label_en: 'Fees', label_bn: 'ফি ও পেমেন্ট', icon: 'payments', route: '/fees', roles: ['student', 'parent'], visible: true },
    { key: 'notices', label_en: 'Notices', label_bn: 'নোটিশ', icon: 'campaign', route: '/notices', roles: ['student', 'teacher', 'parent', 'institution_admin'], visible: true }
  ]
};
