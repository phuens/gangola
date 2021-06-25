import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Footer, FooterTab, Button, Icon } from 'native-base';
import Config from 'react-native-config';

import NavigationService from '../navigation/NavigationService';
import globalStyle from '../../../styles/globalStyle';


export const AppFooter = ({ userState, navigation }) => {
 
  const navigateToLogin = async () => {
    if (!userState.logged_in) {
      NavigationService.navigate('Login');
    } else {
      NavigationService.navigate('UserDetail');
    }
  };

  return (
    <Container style={globalStyle.bottom}>
      <Footer>
        <FooterTab style={{ backgroundColor: Config.APP_HEADER_COLOR }}>
          <Button vertical onPress={() => navigateToLogin()}>
            <Icon name="home" style={globalStyle.icon} />
            <Text style={globalStyle.iconTextFooter}>Home</Text>
          </Button>
          <Button vertical onPress={() => NavigationService.navigate('About')}>
            <Icon name="list" style={globalStyle.icon} />
            <Text style={globalStyle.iconTextFooter}>About</Text>
          </Button>
          <Button vertical onPress={() => NavigationService.navigate('ContactUs')}>
            <Icon name="call" style={globalStyle.icon} />
            <Text style={globalStyle.iconTextFooter}>Contact Us</Text>
          </Button>
          <Button vertical onPress={() => NavigationService.navigate('Faq')}>
            <Icon name="help-circle-outline" style={globalStyle.icon} />
            <Text style={globalStyle.iconTextFooter}>FAQ</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
};

const mapStateToProps = state => ({
  userState: state.userState,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AppFooter);
