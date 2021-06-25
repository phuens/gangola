import React from 'react';
import { Button, Icon } from 'native-base';
import NavigationService from '../navigation/NavigationService';

class CustombackButton extends React.Component {
  render() {
    return (
      <Button transparent onPress={() => NavigationService.goBack()}>
        <Icon name="left" type="AntDesign" style={{ color: 'white' }} />
      </Button>
    );
  }
}

export default CustombackButton;
