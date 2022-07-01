import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@helpers';

function Loader() {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <ActivityIndicator size="large" color={Colors.themeColor} />
    </View>
  );
}

export default OtrixLoader = React.memo(Loader);
