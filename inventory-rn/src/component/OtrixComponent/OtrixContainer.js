import React from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { GlobalStyles, Colors } from '@helpers';

function Container(props) {
  return (
    <>
      <StatusBar backgroundColor={Colors.light_white} barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_white }}>
        <View style={[GlobalStyles.mainView, props.customStyles]}>
          {props.children}
        </View>
      </SafeAreaView>
    </>
  );
}

export default OtrixContainer = React.memo(Container);
