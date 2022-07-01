import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
const { width: screenWidth } = Dimensions.get('window');
import { ASSETS_DIR } from '@env';

function Slider(props) {
  let images = [];

  props.data.images.map(function (item) {
    images.push(ASSETS_DIR + 'banner/' + item.image);
  });

  const _renderItem = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{ uri: item }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.0}
          {...parallaxProps}
        />
      </View>
    );
  };

  return (
    <View>
      <Carousel
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 55}
        data={images}
        inactiveSlideOpacity={0.5}
        inactiveSlideScale={1}
        renderItem={_renderItem}
        firstItem={1}
        loop={true}
        autoplayDelay={2500}
        autoplay={true}
        activeAnimationType={'spring'}
        activeSlideAlignment={'center'}
        hasParallaxImages={true}
      />
    </View>
  );
}

export default HomeSlider = React.memo(Slider);

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 55,
    height: screenWidth - 220,
    right: wp('3.5%'),
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: wp('1.5%'),
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});
