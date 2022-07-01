import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixDivider,
  OtirxBackButton,
  OtrixContent,
  OtrixLoader,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from '@helpers/Fonts';
import getApi from '@apis/getApi';
import { logfunction } from '@helpers/FunctionHelper';
import RenderHtml from 'react-native-render-html';

function TermsandconditionScreen(props) {
  const [state, setState] = React.useState({
    content: [],
    loading: true,
    heading: null,
  });
  const { content, heading, loading } = state;

  useEffect(() => {
    getApi.getData('getPages/2', []).then(response => {
      if (response.status == 1) {
        logfunction('RESPONSEEE ', response);
        setState({
          ...state,
          heading: response.data.heading,
          content: response.data.description,
          loading: false,
        });
      }
    });
  }, []);

  const { width } = useWindowDimensions();
  const tagsStyles = {
    p: {
      color: Colors.black,
      fontFamily: Fonts.Font_Reguler,
      fontSize: wp('3.5%'),
      lineHeight: hp('2.4%'),
    },
  };

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
          <Text style={GlobalStyles.headingTxt}> {heading}</Text>
        </View>
      </OtrixHeader>

      {/* Orders Content start from here */}
      {loading && <OtrixLoader />}
      {!loading && (
        <OtrixContent>
          <View style={styles.box}>
            <RenderHtml
              contentWidth={width}
              source={{
                html: content,
              }}
              tagsStyles={tagsStyles}
            />
          </View>
          <OtrixDivider size={'md'} />
        </OtrixContent>
      )}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(TermsandconditionScreen);

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp('1.5%'),
    backgroundColor: Colors.white,
    marginVertical: hp('1%'),
    marginHorizontal: wp('1%'),
    borderRadius: wp('2%'),
    borderWidth: 0.5,
    borderColor: Colors.custom_gray,
  },
  txt: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.text_color,
    textAlign: 'left',
  },
});
