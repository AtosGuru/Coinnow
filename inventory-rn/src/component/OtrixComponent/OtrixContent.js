import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { GlobalStyles, Colors } from '@helpers';

function Content(props) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={10}
      bounces={false}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      style={[GlobalStyles.contentView, props.customStyles]}>
      {props.children}
    </ScrollView>
  );
}

export default OtrixContent = React.memo(Content);
