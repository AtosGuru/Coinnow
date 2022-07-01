import React, { useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import OtrixHeader from '../OtrixComponent/OtrixHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '@helpers/Fonts';
import { close } from '@common';
import { _roundDimensions } from '@helpers/util';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import PriceList from '../items/PriceList';
import RateList from '../items/RateList';
import FilterTags from './FilterTags';
import RangeSlider from './RangeSlider';
import { Button } from 'native-base';
let minSlider = 0;
let maxSlider = 0;
function FilterComponent(props) {
  return (
    <View>
      {Platform.OS === 'ios' && <View style={{ height: hp('5%') }} />}
      <View style={styles.modelView}>
        {/* Model header */}
        <OtrixHeader customStyles={{ backgroundColor: Colors.light_white }}>
          <TouchableOpacity
            style={GlobalStyles.headerLeft}
            onPress={() => props.closeFilter(false)}>
            <View style={styles.round}>
              <Image source={close} style={styles.button} />
            </View>
          </TouchableOpacity>
          <View style={[GlobalStyles.headerCenter]}>
            <Text style={GlobalStyles.headingTxt}>{'Filter'}</Text>
          </View>
          <TouchableOpacity
            style={styles.headerRight}
            onPress={() => props.closeFilter(true)}>
            <Text style={styles.clearTxt}> Clear All</Text>
          </TouchableOpacity>
        </OtrixHeader>
        <OtrixDivider size={'sm'} />
        <View style={GlobalStyles.horizontalLine} />
        <OtrixDivider size={'md'} />

        <View style={styles.filterView}>
          {/* Brand View  */}
          <Text style={styles.titleTxt}>Price:</Text>
          <OtrixDivider size={'sm'} />

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: wp('1%'),
            }}>
            {PriceList.map((item, index) => (
              <FilterTags
                tagName={item.name}
                tagID={item.value}
                type="price"
                key={item.id}
                selectedPrice={props.filterPriceVal}
                selectedRating={props.filterRatingVal}
                onFilterPress={props.onFilterPress}
              />
            ))}
          </View>

          <OtrixDivider size={'md'} />
          <View style={GlobalStyles.horizontalLine} />
          <OtrixDivider size={'md'} />

          {/* Price Range View  */}
          <Text style={styles.titleTxt}>Price Range:</Text>
          <View style={styles.rangeView}>
            <RangeSlider
              name="Price"
              icon="ticket-percent-outline"
              boundaryMin={0}
              boundaryMax={1000}
              initValMin={
                props.filterPriceRangeVal ? props.filterPriceRangeVal.min : 40
              }
              initValMax={
                props.filterPriceRangeVal ? props.filterPriceRangeVal.max : 600
              }
              onChange={(min, max) => {
                (minSlider = min), (maxSlider = max);
              }}
            />
          </View>

          <OtrixDivider size={'md'} />
          <View style={GlobalStyles.horizontalLine} />
          <OtrixDivider size={'md'} />
          <Text style={styles.titleTxt}>Rating:</Text>
          <OtrixDivider size={'sm'} />

          <View
            style={{
              flexDirection: 'column',
              flexWrap: 'wrap',
              marginHorizontal: wp('1%'),
            }}>
            {RateList.map((item, index) => (
              <FilterTags
                tagName={item.name}
                tagID={item.value}
                type="rating"
                key={item.id}
                selectedPrice={props.filterPriceVal}
                selectedRating={props.filterRatingVal}
                onFilterPress={props.onFilterPress}
              />
            ))}
          </View>

          {/* Colors View  */}
          {/* <Text style={styles.titleTxt}>Colors:</Text>
                    <OtrixDivider size={'sm'} />
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: wp('1%') }}>
                        <TouchableOpacity style={[styles.colorBox, { backgroundColor: '#7d9128' }]} >
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.colorBox, styles.borderBox, { backgroundColor: Colors.themeColor }]} >
                            {true && <Image source={checkround2} style={styles.imageView} />}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.colorBox, { backgroundColor: '#c2da0c' }]} >
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.colorBox, styles.borderBox, { backgroundColor: '#ff1e1a' }]} >
                            {true && <Image source={checkround2} style={styles.imageView} />}
                        </TouchableOpacity>
                    </View> */}

          {/* <OtrixDivider size={'lg'} />
                    <Text style={styles.titleTxt}>Sizes:</Text>
                    <OtrixDivider size={'sm'} />
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: wp('1%') }}>
                        {
                            SizeTagDummy.map((item, index) =>
                                <SizeTags tagName={item.name} tagID={item.id} key={item.id} selected={props.selectedFilter} onFilterPress={props.onFilterPress} />
                            )
                        }
                    </View> */}
        </View>

        <OtrixDivider size={'md'} />
        <Button
          size="md"
          variant="solid"
          bg={Colors.themeColor}
          style={[GlobalStyles.button, { marginHorizontal: wp('4%') }]}
          onPress={() => props.applyFilter({ min: minSlider, max: maxSlider })}>
          <Text style={GlobalStyles.buttonText}>Apply Filter</Text>
        </Button>
      </View>
    </View>
  );
}

export default FilterComponent;

const styles = StyleSheet.create({
  modelView: {
    height: hp('100%'),
    width: wp('100%'),
    backgroundColor: Colors.light_white,
  },
  filter: {
    height: _roundDimensions()._height * 0.028,
    width: _roundDimensions()._height * 0.028,
  },
  round: {
    justifyContent: 'center',
    alignItems: 'center',
    height: _roundDimensions()._height * 0.042,
    width: _roundDimensions()._height * 0.04,
    borderRadius: _roundDimensions()._borderRadius,
    backgroundColor: Colors.white,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    height: _roundDimensions()._height * 0.016,
    width: _roundDimensions()._height * 0.016,
  },
  headerRight: {
    flex: 0.25,
    marginRight: wp('2%'),
  },
  clearTxt: {
    color: Colors.link_color,
    textTransform: 'uppercase',
    fontSize: wp('3%'),
    fontFamily: Fonts.Font_Reguler,
  },
  horiLine: {
    width: wp('90%'),
    alignSelf: 'center',
    height: 0.5,
    backgroundColor: Colors.line_color,
  },
  filterView: {
    marginHorizontal: wp('4%'),
  },
  titleTxt: {
    color: Colors.text_color,
    textTransform: 'capitalize',
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Semibold,
  },

  colorBox: {
    height: hp('4%'),
    width: wp('18%'),
    flexDirection: 'row',
    marginHorizontal: wp('2%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: Colors.light_gray,
    borderWidth: 1,
    alignItems: 'center',
  },
  borderBox: {
    borderColor: Colors.themeColor,
    borderWidth: 1,
  },

  imageView: {
    height: hp('2%'),
    width: wp('4%'),
    borderRadius: 50,
    marginHorizontal: wp('1%'),
  },
  rangeView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: hp('2%'),
    marginBottom: hp('8%'),
  },
});
