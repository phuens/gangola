import React, { Fragment } from 'react';
import { Button, Icon, Text } from 'native-base';
import NavigationService from '../navigation/NavigationService';
import { connect } from 'react-redux';

import { startLogout } from '../../../redux/actions/userActions';
import globalStyle from '../../../styles/globalStyle';

const Logout = ({ userState, startLogout }) => {
  const performLogout = () => {
    startLogout();
    NavigationService.navigate('Login');
  };

  return (userState.logged_in && userState.profile_verified ? (
    <Fragment>
      <Button
        block
        transparent
        // iconRight
        style={{ marginRight: 130 }}
        onPress={performLogout}>
        <Icon style={globalStyle.drawerIcon} name="log-out" />
        <Text style={{ color: 'black' }}>Logout</Text>
      </Button>
    </Fragment>
  ) :
    <Fragment>
      <Button transparent onPress={performLogout}>
        <Icon name="log-out" style={globalStyle.icon} />
      </Button>
    </Fragment>
  )
};

const mstp = state => ({
  userState: state.userState,
});

export default connect(mstp, { startLogout })(Logout);
