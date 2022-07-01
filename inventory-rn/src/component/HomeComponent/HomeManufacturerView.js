import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ASSETS_DIR } from '@env';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import Fonts from '@helpers/Fonts';
import { logfunction } from '@helpers/FunctionHelper';

function HomeManufacturer(props) {
  logfunction('dir ', ASSETS_DIR + 'category/');

  return (
    <View>
      <View style={styles.catHeading}>
        <Text style={GlobalStyles.boxHeading}>Shop By Brands</Text>
        <TouchableOpacity
          style={{ flex: 0.5 }}
          onPress={() => props.navigation.navigate('MenufecturerScreen')}>
          <Text style={GlobalStyles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <OtrixDivider size={'sm'} />
      <FlatList
        style={{ padding: wp('1%') }}
        data={props.data}
        contentContainerStyle={{ paddingRight: wp('3%') }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.7}
        keyExtractor={(contact, index) => String(index)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.catBox}
            key={item.id}
            onPress={() =>
              props.navigation.navigate('ProductListScreen', {
                type: 'menufacturer',
                id: item.id,
                title: item.name,
              })
            }>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: ASSETS_DIR + 'manufacturer/' + item.image }}
                style={styles.imageView}
                resizeMode="contain"
              />
            </View>
            <Text numberOfLines={2} style={styles.catName}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default HomeManufacturerView = React.memo(HomeManufacturer);

const styles = StyleSheet.create({
  catHeading: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: hp('1%'),
  },
  catBox: {
    height: hp('12.5%'),
    width: wp('20%'),
    marginHorizontal: wp('1.5%'),
    borderRadius: 5,
  },
  imageContainer: {
    backgroundColor: Colors.light_white,
    height: hp('7.5%'),
    justifyContent: 'center',
  },
  imageView: {
    alignSelf: 'center',
    height: hp('6.5%'),
    resizeMode: 'contain',
    borderRadius: 5,
    width: wp('15.5%'),
  },
  catName: {
    fontSize: wp('3%'),
    fontFamily: Fonts.Font_Reguler,
    textAlign: 'center',
    color: Colors.text_color,
  },
});
