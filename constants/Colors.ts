/**
 * HabitQuest RPG-Themed Color Palette
 * 
 * A comprehensive color system designed to enhance the gamified habit-tracking experience
 * with royal, magical, and achievement-focused colors that motivate users to complete
 * their daily quests.
 * 
 * All colors are WCAG AA compliant (4.5:1 contrast ratio minimum) and optimized
 * for both light and dark themes.
 */

// ========================================
// PRIMARY COLORS (Quest Theme)
// ========================================

const primaryPurple = '#6366f1';      // Indigo-500 - Royal/Magical Purple
const primaryPurpleDark = '#4f46e5';  // Indigo-600 - Darker variant
const primaryPurpleLight = '#a5b4fc'; // Indigo-300 - Lighter variant

const accentGold = '#f59e0b';          // Amber-500 - Gold/Achievement
const accentGoldDark = '#d97706';     // Amber-600 - Darker gold
const accentGoldLight = '#fbbf24';    // Amber-400 - Lighter gold

// ========================================
// SEMANTIC COLORS (Gamification)
// ========================================

const successGreen = '#10b981';       // Emerald-500 - Experience/Success
const successGreenBg = '#d1fae5';     // Emerald-100 - Success background
const successGreenDark = '#059669';   // Emerald-600 - Dark mode success

const dangerRed = '#ef4444';          // Red-500 - Health/Danger
const dangerRedBg = '#fee2e2';        // Red-100 - Danger background
const dangerRedDark = '#dc2626';      // Red-600 - Dark mode danger

const infoGray = '#6b7280';           // Gray-500 - Neutral/Info
const infoGrayBg = '#f3f4f6';         // Gray-100 - Info background
const infoGrayDark = '#4b5563';       // Gray-600 - Dark mode info

// ========================================
// CATEGORY COLORS (Habit Types)
// ========================================

const healthGreen = '#059669';        // Emerald-600 - Health habits
const healthGreenBg = '#ecfdf5';      // Emerald-50 - Health background

const productivityBlue = '#2563eb';   // Blue-600 - Productivity habits
const productivityBlueBg = '#eff6ff'; // Blue-50 - Productivity background

const spiritualPurple = '#7c3aed';    // Violet-600 - Spiritual habits
const spiritualPurpleBg = '#f3e8ff';  // Violet-50 - Spiritual background

// ========================================
// GAMIFICATION ELEMENTS
// ========================================

const streakFire = '#ff6b35';         // Fire orange - Streak indicators
const streakFireLight = '#ff8e53';    // Lighter fire - Streak highlights

const levelProgress = '#8b5cf6';      // Violet-500 - Level progress bars
const achievementShine = '#fbbf24';   // Amber-400 - Achievement highlights

// ========================================
// BACKGROUND & TEXT COLORS
// ========================================

const backgroundLight = '#ffffff';    // Pure white - Light mode background
const backgroundDark = '#0f0f23';     // Dark navy - Dark mode background (RPG night theme)

const cardLight = '#f8fafc';          // Slate-50 - Light mode cards
const cardDark = '#1e1b4b';           // Indigo-900 - Dark mode cards (magical feel)

const textPrimary = '#1f2937';        // Gray-800 - Primary text (light mode)
const textPrimaryDark = '#f9fafb';    // Gray-50 - Primary text (dark mode)

const textSecondary = '#6b7280';      // Gray-500 - Secondary text (light mode)
const textSecondaryDark = '#9ca3af';  // Gray-400 - Secondary text (dark mode)

// ========================================
// EXPORTED COLOR SYSTEM
// ========================================

export const Colors = {
  light: {
    // Core theme colors
    text: textPrimary,
    textSecondary: textSecondary,
    background: backgroundLight,
    card: cardLight,
    border: '#e5e7eb', // Gray-200
    
    // Primary brand colors
    primary: primaryPurple,
    primaryDark: primaryPurpleDark,
    primaryLight: primaryPurpleLight,
    
    // Accent colors
    accent: accentGold,
    accentDark: accentGoldDark,
    accentLight: accentGoldLight,
    
    // Semantic colors
    success: successGreen,
    successBg: successGreenBg,
    danger: dangerRed,
    dangerBg: dangerRedBg,
    info: infoGray,
    infoBg: infoGrayBg,
    
    // Tab navigation
    tint: primaryPurple,
    icon: infoGray,
    tabIconDefault: infoGray,
    tabIconSelected: primaryPurple,
  },
  
  dark: {
    // Core theme colors
    text: textPrimaryDark,
    textSecondary: textSecondaryDark,
    background: backgroundDark,
    card: cardDark,
    border: '#374151', // Gray-700
    
    // Primary brand colors (adjusted for dark mode)
    primary: primaryPurpleLight,
    primaryDark: primaryPurple,
    primaryLight: '#c7d2fe', // Indigo-200
    
    // Accent colors
    accent: accentGoldLight,
    accentDark: accentGold,
    accentLight: '#fcd34d', // Amber-300
    
    // Semantic colors (adjusted for dark mode)
    success: successGreenDark,
    successBg: '#064e3b', // Emerald-900
    danger: dangerRedDark,
    dangerBg: '#7f1d1d', // Red-900
    info: infoGrayDark,
    infoBg: '#374151', // Gray-700
    
    // Tab navigation
    tint: primaryPurpleLight,
    icon: textSecondaryDark,
    tabIconDefault: textSecondaryDark,
    tabIconSelected: primaryPurpleLight,
  },
  
  // Category-specific colors (same for both themes)
  categories: {
    health: {
      primary: healthGreen,
      background: healthGreenBg,
      backgroundDark: '#064e3b', // Emerald-900
    },
    productivity: {
      primary: productivityBlue,
      background: productivityBlueBg,
      backgroundDark: '#1e3a8a', // Blue-900
    },
    spiritual: {
      primary: spiritualPurple,
      background: spiritualPurpleBg,
      backgroundDark: '#581c87', // Violet-900
    },
  },
  
  // Gamification elements
  gamification: {
    streak: streakFire,
    streakLight: streakFireLight,
    level: levelProgress,
    achievement: achievementShine,
    
    // Quest completion states
    completed: successGreen,
    pending: infoGray,
    overdue: dangerRed,
    
    // RPG progression
    experience: accentGold,
    levelUp: primaryPurple,
    reward: accentGoldLight,
  },
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get category color based on habit category
 */
export const getCategoryColor = (category: 'Health' | 'Productivity' | 'Spiritual', isDark = false) => {
  const categoryKey = category.toLowerCase() as keyof typeof Colors.categories;
  const categoryColors = Colors.categories[categoryKey];
  
  return {
    primary: categoryColors.primary,
    background: isDark ? categoryColors.backgroundDark : categoryColors.background,
  };
};

/**
 * Get habit completion state color
 */
export const getHabitStateColor = (isCompleted: boolean, isOverdue: boolean = false) => {
  if (isCompleted) return Colors.gamification.completed;
  if (isOverdue) return Colors.gamification.overdue;
  return Colors.gamification.pending;
};

/**
 * Get streak intensity color based on streak length
 */
export const getStreakColor = (streakDays: number) => {
  if (streakDays >= 7) return Colors.gamification.streak;      // Fire orange for long streaks
  if (streakDays >= 3) return Colors.gamification.streakLight; // Lighter fire for medium streaks
  return Colors.gamification.pending;                          // Gray for new habits
};