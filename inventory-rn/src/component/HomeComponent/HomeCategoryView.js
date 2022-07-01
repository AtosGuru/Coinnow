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

function HomeCategory(props) {
  return (
    <View>
      <View style={styles.catHeading}>
        <Text style={GlobalStyles.boxHeading}>Top Categories</Text>
        <TouchableOpacity
          style={{ flex: 0.5 }}
          onPress={() => props.navigation.navigate('Categories')}>
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
                type: 'category',
                id: item.category_id,
                childerns: item.children != undefined ? item.children : [],
                title: item.category_description.name,
              })
            }>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: ASSETS_DIR + 'category/' + item.image }}
                style={styles.imageView}
                resizeMode="cover"
              />
            </View>
            <Text numberOfLines={2} style={styles.catName}>
              {item.category_description.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default HomeCategoryView = React.memo(HomeCategory);

const styles = StyleSheet.create({
  catHeading: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  catBox: {
    height: hp('12.5%'),
    width: wp('15%'),
    marginHorizontal: wp('1.5%'),
    borderRadius: 5,
  },
  imageContainer: {
    backgroundColor: Colors.categoryBG,
    height: hp('7.5%'),
  },
  imageView: {
    resizeMode: 'cover',
    alignSelf: 'center',
    height: hp('7.5%'),
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
