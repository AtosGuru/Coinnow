import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixDivider,
  OtirxBackButton,
  OtrixContent,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from '@helpers/Fonts';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import getApi from '@apis/getApi';
import { Button } from 'native-base';

function NotificationScreen(props) {
  const [state, setState] = React.useState({
    foryouchk: true,
    categoriesSelectedArr: [],
    categoryArr: [],
  });
  const { foryouchk, categoriesSelectedArr, categoryArr } = state;

  const addToArr = id => {
    let storeToarr;
    if (categoriesSelectedArr.length > 0) {
      if (!categoriesSelectedArr.includes(id)) {
        categoriesSelectedArr.push(id);
      } else {
        const index = categoriesSelectedArr.indexOf(id);
        if (index > -1) {
          categoriesSelectedArr.splice(index, 1);
        }
      }
      storeToarr = categoriesSelectedArr;
    } else {
      storeToarr = [id];
    }
    setState({
      ...state,
      categoriesSelectedArr: storeToarr,
    });
  };

  useEffect(() => {
    const unsubscribe = getApi.getData('getCategories', []).then(response => {
      if (response.status == 1) {
        setState({
          ...state,
          categoryArr: response.data,
          loading: false,
        });
      }
    });
    return unsubscribe; //unsubscribe
  }, []);

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
          <Text style={GlobalStyles.headingTxt}> Notification Settings</Text>
        </View>
      </OtrixHeader>

      {/* Orders Content start from here */}
      <OtrixContent>
        <Text style={styles.title}>Enable notifications for</Text>
        <OtrixDivider size={'sm'} />
        <View style={styles.box}>
          <TouchableOpacity
            style={styles.checkboxContent}
            onPress={() => setState({ ...state, foryouchk: !foryouchk })}>
            {foryouchk == true ? (
              <Ionicons
                name="checkbox-marked"
                color={Colors.themeColor}
                style={[
                  styles.chkBox,
                  { color: Colors.themeColor, fontSize: wp('6.5%') },
                ]}
              />
            ) : (
              <Fontisto name="checkbox-passive" style={styles.chkBox} />
            )}
          </TouchableOpacity>
          <Text style={styles.textchk}>For you</Text>
        </View>
        <OtrixDivider size={'md'} />
        <Text style={styles.title}>Categories Wise Notification</Text>
        <OtrixDivider size={'sm'} />
        {categoryArr.length > 0 &&
          categoryArr.map((item, index) => (
            <View style={styles.box}>
              <TouchableOpacity
                key={index}
                style={styles.checkboxContent}
                onPress={() => addToArr(item.category_id)}>
                {categoriesSelectedArr.includes(item.category_id) == true ? (
                  <Ionicons
                    name="checkbox-marked"
                    color={Colors.themeColor}
                    style={[
                      styles.chkBox,
                      { color: Colors.themeColor, fontSize: wp('6.5%') },
                    ]}
                  />
                ) : (
                  <Fontisto name="checkbox-passive" style={styles.chkBox} />
                )}
              </TouchableOpacity>
              <Text style={styles.textchk}>
                {item.category_description.name}
              </Text>
            </View>
          ))}
      </OtrixContent>
      <Button
        size="md"
        variant="solid"
        bg={Colors.themeColor}
        style={[
          GlobalStyles.button,
          { marginHorizontal: wp('5%'), marginBottom: hp('1%') },
        ]}
        onPress={() => props.navigation.goBack()}>
        <Text style={GlobalStyles.buttonText}> Save</Text>
      </Button>
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(NotificationScreen);

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('3.8%'),
    color: Colors.text_color,
    marginLeft: wp('2%'),
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('6%'),
    paddingLeft: wp('4%'),
    backgroundColor: Colors.white,
    marginVertical: hp('0.8%'),
    marginHorizontal: wp('1%'),
    borderRadius: wp('0.3%'),
    borderWidth: 0.08,
    borderColor: Colors.black,
  },
  txt: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.text_color,
    textAlign: 'left',
  },
  checkboxContent: {
    flex: 0.1,
    justifyContent: 'center',
  },
  chkBox: {
    color: Colors.secondry_text_color,
    fontSize: wp('5%'),
  },
  textchk: {
    color: Colors.text_color,
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Semibold,
    flex: 0.9,
  },
});
