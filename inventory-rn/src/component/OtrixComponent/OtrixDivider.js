import React from 'react';
import { View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

function Divider(props) {
  let size = '1%';
  if (props.size == 'md') {
    size = '2.5%';
  } else if (props.size == 'lg') {
    size = '3.5%';
  } else if (props.size == 'xl') {
    size = '5%';
  }

  return <View style={{ height: hp(size) }} />;
}

export default OtrixDivider = React.memo(Divider);
