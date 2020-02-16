import React, {Component} from 'react';
import {PGP_KEYS_UNLOCK_FAILED} from '@utils/constants';
import {connect} from 'react-redux';
import {event, log, error} from '@io/events/';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import {
  pairPhoneWithToken,
  genAndSaveDevicePgpKeys,
  initAndUnlockDeviceKeys,
  setAuthInfoState,
  loadDevicePgpKeys,
  storeEncryptedAuthInfo,
  deleteDevicePgpKeys,
} from '@actions/auth';
import {decryptMessage} from '@io/pgp';
import uuid from 'uuid/v4';
class UnlockORGenKeys extends Component {
  constructor(props, context) {
    super(props, context);
  }
  state = {
    scannedToken: this.props.route.params.scannedToken,
    encAuthInfo: this.props.route.params.encAuthInfo || null,
    passphrase: '',
    retryablePairingError: '',
  };

  passphraseUpdated(pass) {
    this.setState({passphrase: pass});
  }
  async passwordEntered() {
    try {
      if (!this.state.passphrase.length || this.state.passphrase.length < 6) {
        throw 'ERROR_ENTER_PASSWORD';
      }
      let {pubkeyArmored, privkeyArmored} = this.props.auth.devicePgpKey;
      const {scannedToken, passphrase, encAuthInfo} = this.state;
      if (pubkeyArmored && privkeyArmored && encAuthInfo) {
        const unlockedKeys = await this.props.initAndUnlockDeviceKeys({
          privkeyArmored,
          passphrase,
        });
        if (!unlockedKeys) {
          throw PGP_KEYS_UNLOCK_FAILED;
        }
        const decryptedAuthInfo = await decryptMessage(encAuthInfo);
        const {token, key, nodePubkey} = JSON.parse(decryptedAuthInfo);
        if (!token || !key || !nodePubkey) {
          throw 'Pairing info is invalid or corrupted, please delete and repair';
        }
        await this.props.setAuthInfoState({token, key, nodePubkey});
        event('app.init.unlocked');
        return;
      } else if (scannedToken) {
        const {token, key} = scannedToken;
        if (!pubkeyArmored || !privkeyArmored) {
          const {nodeKeyId} = token;
          const generatedKeys = await this.props.genAndSaveDevicePgpKeys({
            user: uuid(),
            email: `${nodeKeyId}@sifir.io`,
            passphrase,
          });
          if (!generatedKeys) {
            throw 'Failed to generate keys for device, please retry';
          }
          ({privkeyArmored, pubkeyArmored} = generatedKeys);
          log('Device:Generated new keys', pubkeyArmored);
        } else {
          log('Device:keys already exists', pubkeyArmored);
        }
        const unlockedKeys = await this.props.initAndUnlockDeviceKeys({
          privkeyArmored,
          passphrase,
        });
        if (!unlockedKeys) {
          throw PGP_KEYS_UNLOCK_FAILED;
        }
        const pairingResult = await this.props.pairPhoneWithToken({token, key});
        if (!pairingResult) {
          throw 'Error pairing with token';
        }
        const {nodePubkey} = pairingResult;
        event('app.init.paired', {type: token.eventType});
        await this.props.storeEncryptedAuthInfo({token, key, nodePubkey});
        await this.props.setAuthInfoState({token, key, nodePubkey});
        log('pairing info stored, ready to app');
        return;
      } else {
        //not paired on auth info , send back to Landing
        //FIXME handle errorin root
        error('unlockOrGenkeys.invalid.state');
        log('invalid state', this.props.auth);
      }
    } catch (err) {
      switch (err) {
        case PGP_KEYS_UNLOCK_FAILED:
          this.setState({
            retryablePairingError:
              'Error unlocking your keys, probably wrong password.',
          });
          break;
        case 'ERROR_ENTER_PASSWORD':
          this.setState({
            retryablePairingError:
              'Please make sure you enter a valid password that is at least 6 characters long',
          });
          break;
        default:
          // more serious error, notify and try again
          error('unlockOrGenkeys.pairingError', err);
          this.setState({
            retryablePairingError:
              'An unexpected error happened while trying to pair:' +
              err.toString(),
          });
          break;
      }
    }
  }

  render() {
    const {
      passphrase,
      scannedToken,
      retryablePairingError,
      encAuthInfo,
    } = this.state;
    const {devicePgpKey, pairing, paired} = this.props.auth;
    const {pubkeyArmored} = devicePgpKey;

    let view;
    if (pairing || paired) {
      view = (
        <View style={styles.mainView}>
          <View style={styles.progressView}>
            <ActivityIndicator size="large" style={styles.progress} />
          </View>
          <View style={styles.mainContent}>
            <Image
              source={pairing ? Images.icon_header : Images.icon_done}
              style={styles.checkImg}
            />
            <Text style={styles.resultTxt}>
              {pairing ? C.STR_PAIRING_METHOD_IN_PROGRESS : C.STR_SUCCESS}
            </Text>
          </View>
        </View>
      );
      return view;
    }
    if (retryablePairingError) {
      view = (
        <View style={styles.mainView}>
          <View style={styles.mainContent}>
            <Text style={styles.resultTxt}>{C.STR_FAILED}</Text>
            <Text style={styles.descriptionTxt}>{retryablePairingError}</Text>
            <TouchableOpacity
              onPress={() => this.setState({retryablePairingError: null})}
              style={styles.doneTouch}>
              <View
                shadowColor="black"
                shadowOffset="30"
                style={styles.doneView}>
                <Text style={styles.doneTxt}>{C.STR_TRY_AGAIN}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
      return view;
    }
    const [welcomeText, ctaText, mainText] =
      pubkeyArmored && encAuthInfo
        ? [C.STR_WELCOME_BACK, C.STR_ENTER_PASS_TO_UNLOCK_WALLET, '']
        : [
            `${
              C.STR_PAIRING_METHOD
            } ${scannedToken.token.eventType.toUpperCase()}`,
            C.STR_ENTER_PASS_TO_ENCRYPT_WITH,
            'For maximum privacy and security, Sifir encrypts and signs all data it stores and communicates using PGP keys. PGP keys them selfs are encrypted and protected with a password so they can only be used by you',
          ];
    view = (
      <>
        <Text style={styles.resultTxt}>{welcomeText}</Text>
        <Text style={styles.descriptionTxt}>{mainText}</Text>
        <View style={styles.inputView}>
          <TextInput
            placeholderTextColor="white"
            placeholder={ctaText}
            style={[styles.inputTxtStyle]}
            value={passphrase}
            onChangeText={pass => this.passphraseUpdated(pass)}
          />
        </View>
        <TouchableOpacity
          onPress={() => this.passwordEntered()}
          style={styles.doneTouch}>
          <View shadowColor="black" shadowOffset="30" style={styles.doneView}>
            <Text style={styles.doneTxt}>{C.STR_CONTINUE}</Text>
          </View>
        </TouchableOpacity>
      </>
    );
    return (
      <View style={styles.mainView}>
        <View style={styles.mainContent}>{view}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  doneTouch: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  descriptionTxt: {
    color: AppStyle.mainColor,
    fontSize: 12,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: AppStyle.mainFontBold,
  },
  resultTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 8 * C.vh,
    marginTop: 0,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
    width: C.SCREEN_WIDTH * 0.8,
    marginLeft: C.SCREEN_WIDTH * 0.1,
    height: 70,
    borderRadius: 10,
    borderColor: AppStyle.mainColor,
    borderWidth: 2,
  },
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
  },
  doneView: {
    width: C.SCREEN_WIDTH * 0.5,
    flexDirection: 'row',
    height: 9.5 * C.vh,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  inputTxtStyle: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    textAlign: 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  mainContent: {alignItems: 'center', flex: 3, marginTop: 12 * C.vh},
  doneTxt: {
    color: AppStyle.backgroundColor,
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: 15,
  },
  checkImg: {width: 8 * C.vh, height: 8 * C.vh, marginTop: 2 * C.vh},
  progressView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = {
  pairPhoneWithToken,
  genAndSaveDevicePgpKeys,
  initAndUnlockDeviceKeys,
  setAuthInfoState,
  storeEncryptedAuthInfo,
  loadDevicePgpKeys,
  deleteDevicePgpKeys,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnlockORGenKeys);