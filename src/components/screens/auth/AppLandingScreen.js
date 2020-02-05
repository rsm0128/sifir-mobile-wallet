import React from 'react';
import {connect} from 'react-redux';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {loadAuthInfo} from '@actions/auth';

class AppLandingScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this._bootstrapAsync();
  }
  _bootstrapAsync = async () => {
    await this.props.loadAuthInfo();
    //const {
    //  auth: {token, key, paired},
    //} = this.props;
    //if (token && key && paired) {
    //  this.props.navigation.navigate('App');
    //} else {
    //  this.props.navigation.navigate('Pair');
    //}
    //FIXME remove this
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <View style={styles.mainView}>
        <ActivityIndicator size="large" style={styles.progress} />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    // justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progress: {},
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};
const mapDispatchToProps = {loadAuthInfo};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppLandingScreen);
