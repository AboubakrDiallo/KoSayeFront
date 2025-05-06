import { Platform } from 'react-native';

export const fonts = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'Arial'
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'Arial'
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'Arial'
  })
};

export default fonts;
