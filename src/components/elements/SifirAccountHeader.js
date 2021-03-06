import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import SifirBTCAmount from '@elements/SifirBTCAmount';
import LinearGradient from 'react-native-linear-gradient';
const BTN_WIDTH = C.SCREEN_WIDTH / 2;

const SifirAccountHeader = ({
  loading,
  loaded,
  type,
  balance,
  btcUnit,
  label,
  headerText = C.STR_Cur_Balance,
  accountIconOnPress,
  accountIcon,
}) => {
  const [balanceViewDimensions, setDimensions] = useState({});
  const {width} = balanceViewDimensions;
  const balanceTxtFontSize = width / 5 || 25;
  return (
    <View style={styles.headerView}>
      <TouchableOpacity onPress={accountIconOnPress}>
        <LinearGradient
          height={BTN_WIDTH - 50}
          width={BTN_WIDTH - 40}
          colors={['#52d4cd', '#54a5b1', '#57658c']}
          style={styles.gradient}>
          <View>
            <Image source={accountIcon} style={styles.boxImage} />
            {loading === true && (
              <ActivityIndicator size="large" color={AppStyle.mainColor} />
            )}
            {loaded === true && loading === false && (
              <>
                <Text style={styles.boxTxt} numberOfLines={2}>
                  {label}
                </Text>
                {type === C.STR_WATCH_WALLET_TYPE && (
                  <Text style={styles.boxTxt}>{C.STR_WATCHING}</Text>
                )}
              </>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <View
        height={BTN_WIDTH - 30}
        width={BTN_WIDTH - 30}
        onLayout={event => {
          const {width, height} = event.nativeEvent.layout;
          setDimensions({width, height});
        }}
        style={styles.balanceView}>
        {loading === true && (
          <ActivityIndicator size="large" color={AppStyle.mainColor} />
        )}
        {loaded === true && loading === false && (
          <>
            <View>
              <Text
                textBreakStrategy="simple"
                style={[styles.balAmountTxt, {fontSize: balanceTxtFontSize}]}>
                <SifirBTCAmount amount={balance} unit={btcUnit} />
              </Text>
            </View>
            <Text style={styles.balanceTxt}>{headerText}</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    marginTop: 0,
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gradient: {
    flex: 4.6,
    borderWidth: 1,
    borderRadius: 15,
  },
  boxImage: {
    marginBottom: 10,
    marginTop: 15,
    marginLeft: 13,
    width: 43,
    height: 43,
    opacity: 0.6,
  },
  boxTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 24,
    marginLeft: 13,
    marginBottom: -10,
    marginRight: 4,
  },
  balanceView: {
    flex: 5,
    flexDirection: 'column-reverse',
    marginLeft: 25,
    justifyContent: 'center',
  },
  balAmountTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: BTN_WIDTH / 4,
  },
  balanceTxt: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFont,
    fontSize: 16,
    textAlignVertical: 'bottom',
    marginBottom: -5,
    marginLeft: 5,
  },
});
export default SifirAccountHeader;
