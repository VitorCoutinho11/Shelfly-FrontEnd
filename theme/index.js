// theme/index.js

const colors = {
  primary: '#0F766E',
  primaryForeground: '#FFFFFF',
  accent: '#FB923C',
  accentForeground: '#FFFFFF',
  background: '#FFFFFF',
  foreground: '#1C1C1E',
  card: '#FFFFFF',
  cardForeground: '#1C1C1E',
  muted: '#ECECF0',
  mutedForeground: '#717182',
  inputBackground: '#F3F3F5',
  inputBorder: 'rgba(0,0,0,0.1)',
  statusWantBg: '#DBEAFE',
  statusWantText: '#1D4ED8',
  statusReadingBg: '#FEF3C7',
  statusReadingText: '#B45309',
  statusReadBg: '#D1FAE5',
  statusReadText: '#047857',
  destructive: '#D4183D',
  destructiveForeground: '#FFFFFF',
  border: 'rgba(0,0,0,0.1)',
  ring: '#A1A1AA',
};

const spacing = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24,
  7: 28, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80, 24: 96,
};

const typography = {
  h1: { fontSize: 24, fontWeight: '500', lineHeight: 36 },
  h2: { fontSize: 20, fontWeight: '500', lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: '500', lineHeight: 27 },
  h4: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  small: { fontSize: 14, fontWeight: '400', lineHeight: 21 },
  xs: { fontSize: 12, fontWeight: '400', lineHeight: 18 },
  label: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  button: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  input: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
};

const borderRadius = {
  none: 0, sm: 6, md: 8, lg: 10, xl: 14, '2xl': 16, full: 9999,
};

const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
};

// ✅ Evita undefined mesmo se import errado
const Theme = { colors, spacing, typography, borderRadius, shadows };

// Garante compatibilidade com ES Modules e CommonJS
export default Theme;
export { colors, spacing, typography, borderRadius, shadows };
