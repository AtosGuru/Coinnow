import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
export const _roundDimensions = v => {
  var _borderRadius = Math.round((height + width) / 2),
    _height = Math.round(height),
    _width = Math.round(width);

  return { _borderRadius, _height, _width };
};
