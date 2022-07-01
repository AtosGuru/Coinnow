import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { OtrixContainer, OtrixHeader, OtrixContent } from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import Fonts from '@helpers/Fonts';

function UnauthorizeScreen(props) {
  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: Colors.light_white }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.goBack()}>
          {/* <OtirxBackButton /> */}
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Unauthorize</Text>
        </View>
      </OtrixHeader>

      {/* Content Start from here */}
      <OtrixContent>
        <Text style={styles.txt}>You don't have access!</Text>
      </OtrixContent>
    </OtrixContainer>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {})(UnauthorizeScreen);

const styles = StyleSheet.create({
  txt: {
    fontSize: wp('6%'),
    marginVertical: hp('1.5%'),
    fontFamily: Fonts.Font_Semibold,
    color: 'red',
    textAlign: 'center',
  },
});
