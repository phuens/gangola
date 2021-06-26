import {Platform} from 'react-native';
import React, {Component, useEffect, useState} from 'react';
import {StyleSheet, Image, View, Dimensions} from 'react-native';
import Carousel from 'react-native-banner-carousel';
import Config from 'react-native-config';
import {callAxios, handleError} from '../../../redux/actions/commonActions';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height - 627
    : Dimensions.get('window').height - 0.69 * Dimensions.get('window').height;

export class Banner extends Component {
  state = {
    images: [],
  };

  componentDidMount() {
    this.getBannerImageList();
  }

  getBannerImageList = async () => {
    try {
      if (this.state.images.length == 0) {
        const res = await callAxios(
          'method/erpnext.crm_utils.get_slider_images',
          'GET',
          {enabled: 1},
        );
        this.setState({images: res.data.message});
      }
    } catch (error) {
      handleError(error);
    }
  };

  renderPage(image, index) {
    return (
      <View key={index}>
        <Image
          resizeMode="cover"
          style={{width: BannerWidth, height: BannerHeight}}
          source={{uri: Config.BASE_URL + image}}
        />
      </View>
    );
  }
  render() {
    return (
      <View>
        <Carousel
          autoplay
          autoplayTimeout={3000}
          loop
          index={0}
          pageSize={BannerWidth}>
          {this.state.images.map((image, index) =>
            this.renderPage(image.banner, index),
          )}
        </Carousel>
      </View>
    );
  }
}
export default Banner;
