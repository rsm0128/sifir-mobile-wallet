import React, {Component} from 'react';

import {View, TouchableOpacity, Image} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as Animatable from 'react-native-animatable';
import {AppStyle, Images, Constants} from '@common';
import {RNCamera} from 'react-native-camera';
const SCREEN_HEIGHT = Constants.SCREEN_HEIGHT;
const SCREEN_WIDTH = Constants.SCREEN_WIDTH;

console.disableYellowBox = true;

class SifirQrCodeCamera extends Component {
  onSuccess(e) {
    this.props.closeHandler(true, e.data);
  }

  state = {
    isFlashOn: false,
  };
  makeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.18,
      },
      to: {
        [translationType]: fromValue,
      },
    };
  }

  render() {
    return (
      <QRCodeScanner
        showMarker
        onRead={this.onSuccess.bind(this)}
        cameraStyle={{height: SCREEN_HEIGHT}}
        flashMode={
          this.state.isFlashOn
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        customMarker={
          <View style={styles.rectangleContainer}>
            <View style={styles.topOverlay}>
              <View style={styles.titleContainer}>
                <TouchableOpacity
                  onPress={() => this.props.closeHandler(false, '')}
                  style={styles.buttonBg}>
                  <Image
                    source={Images.icon_back_trans}
                    style={styles.actionBtn}
                  />
                </TouchableOpacity>
                <View style={{flex: 1}} />
                <TouchableOpacity
                  onPress={() => {
                    // Toast.show('Choose photo form library');
                  }}
                  style={styles.buttonBg}>
                  <Image
                    source={Images.icon_gallery}
                    style={styles.actionBtn}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({isFlashOn: !this.state.isFlashOn});
                  }}
                  style={[styles.buttonBg, {marginLeft: 16}]}>
                  <Image source={Images.icon_torch} style={styles.actionBtn} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View style={styles.leftAndRightOverlay} />

              <View style={styles.rectangle}>
                <Animatable.View
                  style={styles.scanBar}
                  direction="alternate-reverse"
                  iterationCount="infinite"
                  duration={1700}
                  easing="linear"
                  animation={this.makeSlideOutTranslation(
                    'translateY',
                    SCREEN_WIDTH * 0.2,
                  )}
                />
              </View>
              <View style={styles.leftAndRightOverlay} />
            </View>

            <View style={styles.bottomOverlay} />
          </View>
        }
      />
    );
  }
}

const styles = {
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: Constants.rectDimensions,
    width: Constants.rectDimensions,
    borderWidth: Constants.rectBorderWidth,
    borderColor: AppStyle.mainColor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  topOverlay: {
    flex: 1.4,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: Constants.overlayColor,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },

  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: Constants.overlayColor,
    paddingBottom: SCREEN_WIDTH * 0.25,
  },

  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.65,
    width: SCREEN_WIDTH,
    backgroundColor: Constants.overlayColor,
  },

  scanBar: {
    width: Constants.scanBarWidth,
    height: Constants.scanBarHeight,
    backgroundColor: Constants.scanBarColor,
  },

  buttonBg: {
    backgroundColor: 'transparent',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
};

export default SifirQrCodeCamera;