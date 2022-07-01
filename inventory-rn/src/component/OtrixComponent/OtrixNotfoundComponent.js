import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Colors } from '@helpers';
import Fonts from '@helpers/Fonts';

function NotfoundComponent(props) {
  return (
    <View style={styles.container}>
      <Image source={props.image} style={styles.image} />
      <Text style={styles.text}>{props.title}</Text>
    </View>
  );
}

export default OtrixNotfoundComponent = React.memo(NotfoundComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('10%'),
  },
  image: {
    tintColor: Colors.custom_gray,
    height: hp('28%'),
    resizeMode: 'contain',
  },
  text: {
    color: Colors.secondry_text_color,
    marginTop: hp('4%'),
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Semibold,
  },
});
