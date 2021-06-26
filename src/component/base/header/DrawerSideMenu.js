import React from 'react';
import {Button, Icon} from 'native-base';
import globalStyle from '../../../styles/globalStyle';

import {withNavigation} from 'react-navigation';

class DrawerSideMenu extends React.Component {
  render() {
    return (
      <Button transparent onPress={() => this.props.navigation.openDrawer()}>
        <Icon trans name="menu" style={globalStyle.icon} />
      </Button>
    );
  }
}

export default withNavigation(DrawerSideMenu);

// import React, { useEffect } from 'react';
// import { Linking } from 'react-native';
// import Config from 'react-native-config';
// // import {Button, Icon} from 'native-base';
// import globalStyle from '../../../styles/globalStyle';

// import {
//     Icon,
//     View,
//     Text,
//     Content,
//     Button,
//     CardItem
// } from 'native-base';

// const DrawerMenu = ({ navigation }) => {
//     return (
//         <Button transparent
//             onPress={() => {
//                 navigation.openDrawer();
//             }}
//         >
//             <Icon name="menu" style={globalStyle.icon} />
//         </Button>
//     );
// };

// export default DrawerMenu;
