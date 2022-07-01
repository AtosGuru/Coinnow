import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixDivider,
  OtirxBackButton,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from '@helpers/Fonts';
function LanguageScreen(props) {
  useEffect(() => {}, []);

  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: Colors.light_white }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.goBack()}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Languages</Text>
        </View>
      </OtrixHeader>

      {/* Orders Content start from here */}
      <OtrixDivider size={'md'} />
      <TouchableOpacity
        style={[
          styles.langBox,
          { borderWidth: 1, borderColor: Colors.themeColor },
        ]}>
        <Text style={[styles.langTxt, { color: Colors.themeColor }]}>
          English
        </Text>
      </TouchableOpacity>
      <View style={styles.langBox}>
        <Text style={[styles.langTxt, { opacity: 0.5 }]}>
          Arabic (Coming soon)
        </Text>
      </View>
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(LanguageScreen);

const styles = StyleSheet.create({
  langBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp('2%'),
    backgroundColor: Colors.white,
    marginVertical: hp('1%'),
    marginHorizontal: wp('5%'),
    borderRadius: wp('2%'),
    borderWidth: 0.5,
    borderColor: Colors.custom_gray,
  },
  langTxt: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.text_color,
    textAlign: 'left',
  },
});
