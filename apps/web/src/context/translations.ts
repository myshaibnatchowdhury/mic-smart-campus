export type Language = 'bn' | 'en';
export type ThemeMode = 'light' | 'dark';

export const translations = {
  en: {
    // Nav
    brand: 'MIC Smart Campus',
    tagline: 'Learn • Connect • Grow',
    nav_features: 'Features',
    nav_institutions: 'Institutions',
    nav_about: 'About Platform',
    nav_contact: 'Contact',
    nav_login: 'Portal Login',
    nav_register: 'Admission / Register',
    theme_day: 'Day',
    theme_dark: 'Dark',
    lang_en: 'English',
    lang_bn: 'বাংলা',

    // Hero
    hero_badge: 'Enterprise Multi-Tenant Smart Campus Solution',
    hero_title_1: 'Learn',
    hero_title_2: 'Connect',
    hero_title_3: 'Grow',
    hero_subtitle: 'Empower your school, college, or university with MIC Smart Campus — the centralized cloud platform unifying academic management, live attendance, automated GPA results, fee collections, and native mobile apps with remote Server-Driven UI.',
    hero_cta_portal: 'Access Campus Portal',
    hero_cta_onboard: 'Onboard Your Institution',
    stat_rls_num: '100%',
    stat_rls_text: 'PostgreSQL RLS Isolated',
    stat_sdui_num: 'Realtime',
    stat_sdui_text: 'Server-Driven UI',
    stat_bdt_num: 'BDT / Dhaka',
    stat_bdt_text: 'Native Localization',

    // Hero Preview Card
    card_live: 'Live System',
    card_active_tenant: 'Active Tenant',
    card_tier: 'Enterprise Tier',
    card_attendance: "Today's Attendance",
    card_attendance_sub: 'Biometric & Web sync',
    card_invoices: 'Pending Invoices',
    card_invoices_sub: 'bKash / Bank verified',
    card_sdui_title: 'Server-Driven UI Remote Sync',
    card_sdui_desc: 'Super Admin can remotely customize mobile dashboards, toggle feature blocks, and update banner themes without requiring re-compilation of APK.',

    // Portals
    portals_title: 'Dedicated Portals for Every Academic Role',
    portals_subtitle: 'Role-Based Access Control (RBAC) guarantees that each stakeholder sees strictly what they need with zero data leakage.',
    enter_portal: 'Enter Portal',
    role_super_admin: 'Super Admin',
    role_super_admin_desc: 'Multi-tenant provisioning, subscription control, audit logs, and global SDUI configuration.',
    role_tenant_admin: 'Tenant Admin',
    role_tenant_admin_desc: 'Academic sessions, class routines, teacher allocations, fee invoices, and institution settings.',
    role_teacher: 'Teacher / Faculty',
    role_teacher_desc: 'Assigned classroom roster, real-time student attendance, and examination marks grading.',
    role_student: 'Student',
    role_student_desc: 'Daily routine schedule, personal attendance %, examination report cards, and pending fees.',
    role_parent: 'Parent / Guardian',
    role_parent_desc: 'Linked children academic performance, real-time absence alerts, and online fee payments.',

    // Features
    features_badge: 'Platform Capabilities',
    features_title: 'Engineered for Complete Institutional Governance',
    features_subtitle: 'Eliminate disconnected spreadsheets and siloed legacy systems with an all-in-one verified campus solution.',
    feat_1_title: 'Strict Multi-Tenant Isolation',
    feat_1_desc: 'Every query enforces PostgreSQL Row Level Security (RLS) checked directly in the database engine. Institution data is isolated by default.',
    feat_2_title: 'Server-Driven Flutter App',
    feat_2_desc: 'Dynamic Android mobile client dynamically reads its widget layout, branding, themes, and banners from Supabase in real-time.',
    feat_3_title: 'Class Routine & Schedules',
    feat_3_desc: 'Visual multi-period routine generator with clash detection across teachers, rooms, and sections.',
    feat_4_title: 'Exams & Automated GPA',
    feat_4_desc: 'Configurable Bangladeshi grading scales (A+, A, B, C, D, F) with automated calculation of GPA, total marks, and published report cards.',
    feat_5_title: 'Fee Management & Invoicing',
    feat_5_desc: 'Automated invoice generation for tuition, admission, exams, and transport with support for manual cash collection and mobile banking.',
    feat_6_title: 'Comprehensive Audit Logs',
    feat_6_desc: 'Every sensitive operation on student profiles, examination marks, and billing triggers an immutable database audit log with user and IP.',

    // Institutions
    inst_title: 'Institutions Powered by MIC Smart Campus',
    inst_subtitle: 'Supporting universities, colleges, and high schools under a unified enterprise infrastructure.',
    active_tenant: 'Active Tenant',
    currency_label: 'Currency',

    // CTA
    cta_title: 'Ready to Transform Your Campus Experience?',
    cta_subtitle: 'Deploy MIC Smart Campus today with turnkey Supabase multi-tenancy and ready-to-run Android APK.',
    cta_signin: 'Sign In to Your Account',
    cta_register: 'Register New Campus',

    // Login
    login_title: 'Portal Sign In',
    login_subtitle: 'Sign in with your registered email and password to access your portal',
    login_email_label: 'Official Campus or Registered Email',
    login_email_placeholder: 'Type your email address (e.g. yourname@gmail.com)',
    login_pass_label: 'Account Password',
    login_pass_placeholder: 'Type your password',
    login_forgot_pass: 'Forgot password?',
    login_btn: 'Sign In to Campus Portal',
    login_authenticating: 'Authenticating...',
    login_secure: 'Secure Credentials Required',
    login_apply_link: 'Apply / Register Now',
    login_err_empty_email: 'Please enter your campus email or registered email.',
    login_err_empty_pass: 'Please enter your account password.',

    // Forgot Password Flow
    forgot_title: 'Reset Account Password',
    forgot_sub: 'Enter your registered Gmail to receive a 6-digit verification code',
    forgot_send_btn: 'Send 6-Digit Code to Gmail',
    forgot_sending: 'Sending code to Gmail...',
    forgot_step2_title: 'Verify Code & Set Password',
    forgot_step2_sub: 'Enter the 6-digit code received on your Gmail and your new password',
    forgot_code_label: '6-Digit Verification Code',
    forgot_code_placeholder: 'e.g. 849201',
    forgot_new_pass_label: 'New Password',
    forgot_confirm_pass_label: 'Confirm New Password',
    forgot_reset_btn: 'Confirm & Reset Password',
    forgot_resetting: 'Updating password...',
    forgot_back_to_login: 'Back to Sign In',
    forgot_success: 'Password reset successfully! You can now sign in with your new password.',

    // Register
    reg_student_tab: 'Student Admission Application',
    reg_inst_tab: 'Institution Onboarding',
    reg_submit: 'Submit Application',
    reg_submitting: 'Submitting...',

    // Footer
    footer_desc: 'Next-generation multi-tenant academic management ecosystem empowering schools, colleges, and universities across Bangladesh.',
    footer_rights: 'All rights reserved.',
    footer_modules: 'Platform Modules',
    footer_portals: 'Institutional Portals',
    footer_contact: 'Contact & Security',
    footer_location: 'Dhaka, Bangladesh',
    footer_rls_enforced: 'Row Level Security (RLS) Enforced',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_security: 'Security Architecture'
  },

  bn: {
    // Nav
    brand: 'এমআইসি স্মার্ট ক্যাম্পাস',
    tagline: 'শিখুন • যুক্ত হোন • এগিয়ে যান',
    nav_features: 'ফিচারসমূহ',
    nav_institutions: 'প্রতিষ্ঠানসমূহ',
    nav_about: 'প্ল্যাটফর্ম পরিচিতি',
    nav_contact: 'যোগাযোগ',
    nav_login: 'পোর্টাল লগইন',
    nav_register: 'ভর্তি / নিবন্ধন',
    theme_day: 'লাইট',
    theme_dark: 'ডার্ক',
    lang_en: 'English',
    lang_bn: 'বাংলা',

    // Hero
    hero_badge: 'এন্টারপ্রাইজ মাল্টি-টেন্যান্ট স্মার্ট ক্যাম্পাস প্ল্যাটফর্ম',
    hero_title_1: 'শিখুন',
    hero_title_2: 'যুক্ত হোন',
    hero_title_3: 'এগিয়ে যান',
    hero_subtitle: 'আপনার স্কুল, কলেজ বা বিশ্ববিদ্যালয়কে পরিচালনা করুন MIC Smart Campus দিয়ে — সেন্ট্রালাইজড ক্লাউড ভিত্তিক একাডেমিক ম্যানেজমেন্ট, লাইভ বায়োমেট্রিক ও ওয়েব উপস্থিতি, স্বয়ংক্রিয় জিপিএ ফলাফল, ফি কালেকশন এবং সার্ভার-ড্রিভেন অ্যান্ড্রয়েড মোবাইল অ্যাপ।',
    hero_cta_portal: 'ক্যাম্পাস পোর্টালে প্রবেশ',
    hero_cta_onboard: 'আপনার প্রতিষ্ঠান যুক্ত করুন',
    stat_rls_num: '১০০%',
    stat_rls_text: 'পোস্টগ্রেস RLS সুরক্ষিত',
    stat_sdui_num: 'রিয়েলটাইম',
    stat_sdui_text: 'সার্ভার-ড্রিভেন UI',
    stat_bdt_num: 'টাকা (৳) / ঢাকা',
    stat_bdt_text: 'লোকালাইজড সিস্টেম',

    // Hero Preview Card
    card_live: 'লাইভ সিস্টেম',
    card_active_tenant: 'সক্রিয় প্রতিষ্ঠান',
    card_tier: 'এন্টারপ্রাইজ টিয়ার',
    card_attendance: 'আজকের উপস্থিতি',
    card_attendance_sub: 'বায়োমেট্রিক ও ওয়েব সিঙ্ক',
    card_invoices: 'বকেয়া ইনভয়েস',
    card_invoices_sub: 'বিকাশ ও ব্যাংক ভেরিফাইড',
    card_sdui_title: 'সার্ভার-ড্রিভেন UI রিমোট সিঙ্ক',
    card_sdui_desc: 'সুপার অ্যাডমিন রিমোটলি মোবাইল অ্যাপের ড্যাশবোর্ড, ফিচার ব্লক ও ব্যানার থিম পরিবর্তন করতে পারেন—নতুন APK রি-বিল্ড ছাড়াই।',

    // Portals
    portals_title: 'প্রতিটি অ্যাকাডেমিক ভূমিকার জন্য ডেডিকেটেড পোর্টাল',
    portals_subtitle: 'রোল-বেসড এক্সেস কন্ট্রোল (RBAC) নিশ্চিত করে যে প্রতিটি স্টেকহোল্ডার কেবল তাদের প্রয়োজনীয় তথ্যই দেখতে পাবেন, শূন্য ডাটা লিক সহ।',
    enter_portal: 'পোর্টালে প্রবেশ করুন',
    role_super_admin: 'সুপার অ্যাডমিন',
    role_super_admin_desc: 'মাল্টি-টেন্যান্ট প্রভিশনিং, সাবস্ক্রিপশন প্ল্যান, অডিট লগ এবং গ্লোবাল SDUI কনফিগারেশন।',
    role_tenant_admin: 'প্রতিষ্ঠান অ্যাডমিন',
    role_tenant_admin_desc: 'একাডেমিক সেশন, ক্লাস রুটিন, শিক্ষক বণ্টন, ফি ইনভয়েস এবং প্রতিষ্ঠান সেটিংস।',
    role_teacher: 'শিক্ষক / অনুষদ',
    role_teacher_desc: 'নির্ধারিত ক্লাসরুম রোস্টার, লাইভ উপস্থিতি গ্রহণ এবং পরীক্ষার নম্বর ও গ্রেডিং এন্ট্রি।',
    role_student: 'শিক্ষার্থী',
    role_student_desc: 'দৈনিক ক্লাস রুটিন, উপস্থিতি হার %, গ্রেড কার্ড ও ফলাফল এবং বকেয়া ফি পরিশোধ।',
    role_parent: 'অভিভাবক',
    role_parent_desc: 'সন্তানের একাডেমিক অগ্রগতি পর্যবেক্ষণ, অনুপস্থিতির নোটিফিকেশন এবং অনলাইন ফি পেমেন্ট।',

    // Features
    features_badge: 'প্ল্যাটফর্মের সক্ষমতা',
    features_title: 'সম্পূর্ণ প্রাতিষ্ঠানিক সুশাসনের জন্য নির্মিত',
    features_subtitle: 'অগোছালো স্প্রেডশিট ও পুরনো সফটওয়্যার বাদ দিয়ে একটি সর্বাধুনিক ও নিরাপদ ক্যাম্পাসে রূপান্তর করুন।',
    feat_1_title: 'কঠোর মাল্টি-টেন্যান্ট আইসোলেশন',
    feat_1_desc: 'প্রতিটি ডাটাবেজ কুয়েরি সরাসরি PostgreSQL Row Level Security (RLS) দিয়ে সুরক্ষিত। প্রতিটি প্রতিষ্ঠানের ডাটা স্বয়ংক্রিয়ভাবে আলাদা থাকে।',
    feat_2_title: 'সার্ভার-ড্রিভেন ফ্লাটার অ্যাপ',
    feat_2_desc: 'ডায়নামিক অ্যান্ড্রয়েড ক্লায়েন্ট লাইভ সুপাবেস থেকে রিয়েলটাইমে উইজেট লেআউট, ব্র্যান্ডিং, থিম ও ব্যানার গ্রহণ করে।',
    feat_3_title: 'ক্লাস রুটিন ও শিডিউল',
    feat_3_desc: 'শিক্ষক, কক্ষ ও সেকশনের মধ্যে সময় সংঘাত (Clash Detection) মুক্ত আধুনিক ভিজ্যুয়াল রুটিন জেনারেটর।',
    feat_4_title: 'পরীক্ষা ও স্বয়ংক্রিয় GPA',
    feat_4_desc: 'বাংলাদেশের জাতীয় গ্রেডিং পদ্ধতি (A+, A, B, C, D, F) অনুযায়ী স্বয়ংক্রিয় জিপিএ এবং ডিজিটাল রিপোর্ট কার্ড তৈরি।',
    feat_5_title: 'ফি ম্যানেজমেন্ট ও ইনভয়েস',
    feat_5_desc: 'টিউশন ফি, ভর্তি, পরীক্ষা ও পরিবহনের স্বয়ংক্রিয় চালান তৈরি এবং ক্যাশ ও মোবাইল ব্যাংকিং ট্র্যাকিং।',
    feat_6_title: 'নিরাপদ ডিজিটাল অডিট লগ',
    feat_6_desc: 'শিক্ষার্থীর তথ্য, পরীক্ষার নম্বর এবং আর্থিক লেনদেনের প্রতিটি পরিবর্তনের বিপরীতে তৈরি হয় অপরিবর্তনযোগ্য অডিট লগ।',

    // Institutions
    inst_title: 'MIC Smart Campus দ্বারা পরিচালিত প্রতিষ্ঠানসমূহ',
    inst_subtitle: 'একই নির্ভরযোগ্য ক্লাউড অবকাঠামোর অধীনে বিশ্ববিদ্যালয়, কলেজ এবং হাই স্কুল পরিচালনা।',
    active_tenant: 'সক্রিয় প্রতিষ্ঠান',
    currency_label: 'মুদ্রা',

    // CTA
    cta_title: 'আপনার ক্যাম্পাসের পরিচালন ব্যবস্থা আধুনিক করতে প্রস্তুত?',
    cta_subtitle: 'আজই MIC Smart Campus ব্যবহার শুরু করুন সম্পূর্ণ রেডি সুপাবেস ডাটাবেজ এবং অ্যান্ড্রয়েড APK সহ।',
    cta_signin: 'অ্যাকাউন্টে সাইন ইন করুন',
    cta_register: 'নতুন ক্যাম্পাস নিবন্ধন করুন',

    // Login
    login_title: 'পোর্টাল সাইন ইন',
    login_subtitle: 'আপনার পোর্টালে প্রবেশ করতে নিবন্ধিত ইমেইল ও পাসওয়ার্ড দিয়ে সাইন ইন করুন',
    login_email_label: 'অফিসিয়াল ক্যাম্পাস অথবা নিবন্ধিত ইমেইল',
    login_email_placeholder: 'আপনার ইমেইল অ্যাড্রেস লিখুন (যেমন: name@gmail.com)',
    login_pass_label: 'অ্যাকাউন্ট পাসওয়ার্ড',
    login_pass_placeholder: 'আপনার পাসওয়ার্ড লিখুন',
    login_forgot_pass: 'পাসওয়ার্ড ভুলে গেছেন?',
    login_btn: 'ক্যাম্পাস পোর্টালে সাইন ইন করুন',
    login_authenticating: 'যাচাই করা হচ্ছে...',
    login_secure: 'সুরক্ষিত ক্রেডেনশিয়াল আবশ্যক',
    login_apply_link: 'আবেদন বা নিবন্ধন করুন',
    login_err_empty_email: 'অনুগ্রহ করে ক্যাম্পাস ইমেইল বা নিবন্ধিত ইমেইল প্রদান করুন।',
    login_err_empty_pass: 'অনুগ্রহ করে অ্যাকাউন্টের পাসওয়ার্ড প্রদান করুন।',

    // Forgot Password Flow
    forgot_title: 'পাসওয়ার্ড রিসেট করুন',
    forgot_sub: '৬ ডিজিটের ভেরিফিকেশন কোড পেতে আপনার নিবন্ধিত জিমেইল লিখুন',
    forgot_send_btn: 'জিমেইলে ৬ ডিজিট কোড পাঠান',
    forgot_sending: 'জিমেইলে কোড পাঠানো হচ্ছে...',
    forgot_step2_title: 'ভেরিফিকেশন কোড ও নতুন পাসওয়ার্ড',
    forgot_step2_sub: 'আপনার জিমেইলে আসা ৬ ডিজিটের কোড এবং নতুন পাসওয়ার্ড দিয়ে রিসেট সম্পন্ন করুন',
    forgot_code_label: '৬ ডিজিটের ভেরিফিকেশন কোড',
    forgot_code_placeholder: 'যেমন: 849201',
    forgot_new_pass_label: 'নতুন পাসওয়ার্ড',
    forgot_confirm_pass_label: 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
    forgot_reset_btn: 'পাসওয়ার্ড পরিবর্তন ও নিশ্চিত করুন',
    forgot_resetting: 'পাসওয়ার্ড পরিবর্তন হচ্ছে...',
    forgot_back_to_login: 'লগইনে ফিরে যান',
    forgot_success: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।',

    // Register
    reg_student_tab: 'শিক্ষার্থী ভর্তি আবেদন',
    reg_inst_tab: 'নতুন প্রতিষ্ঠান অনবোর্ডিং',
    reg_submit: 'আবেদন জমা দিন',
    reg_submitting: 'জমা হচ্ছে...',

    // Footer
    footer_desc: 'বাংলাদেশের স্কুল, কলেজ ও বিশ্ববিদ্যালয়সমূহের প্রাতিষ্ঠানিক ব্যবস্থাপনার জন্য সর্বাধুনিক ক্লাউড প্ল্যাটফর্ম।',
    footer_rights: 'সর্বস্বত্ব সংরক্ষিত।',
    footer_modules: 'প্ল্যাটফর্ম মডিউল',
    footer_portals: 'প্রাতিষ্ঠানিক পোর্টাল',
    footer_contact: 'যোগাযোগ ও নিরাপত্তা',
    footer_location: 'ঢাকা, বাংলাদেশ',
    footer_rls_enforced: 'Row Level Security (RLS) সক্রিয়',
    footer_privacy: 'গোপনীয়তা নীতি',
    footer_terms: 'ব্যবহারের শর্তাবলী',
    footer_security: 'সিকিউরিটি আর্কিটেকচার'
  }
};

export type TranslationKey = keyof typeof translations['en'];
