import React, { Fragment } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Text, Icon, Container, Content, Header } from 'native-base';
import Config from 'react-native-config';
import { Image, TouchableOpacity } from 'react-native';

//Header functions
import Logout from '../header/Logout';
import Call from '../header/Call';
import MyBackButton from '../header/CustombackButton';

//Base Screens
import LoadingScreen from '../LoadingScreen';

//Auth Screens
import Login from '../../auth/Login';
import Signup from '../../auth/Signup';
import PinRecover from '../../auth/PinRecover';

//info pages
import About from '../../info/About';
import Help from '../../info/Help';
import ContactUs from '../../info/ContactUs';
import Faq from '../../info/Faq';

//User Screens
import ModeSelector from '../../apps/user/ModeSelector';
import UserDetail from '../../apps/user/UserDetail';
import Settings from '../../apps/user/Settings';
import Feedback from '../../apps/user/Feedback';
import FaqAuth from '../../apps/user/FaqAuth';
import ProductRequisition from '../../apps/user/ProductRequisition';

//Customer Screens
import CustomerTerms from '../../apps/customer/CustomerTerms';
import CustomerTermsRead from '../../apps/customer/CustomerTermsRead';

import TransporterTerms from '../../apps/transporter/TransporterTerms';
import TransporterTermsRead from '../../apps/transporter/TransporterTermsRead';

import CustomerDashboard from '../../apps/customer/CustomerDashboard';
import TimberDashboard from '../../apps/customer/TimberDashboard';
import BoulderAggreDashboard from '../../apps/customer/BoulderAggreDashboard';
import SiteDashboard from '../../apps/customer/SiteDashboard';
import AddSite from '../../apps/customer/sites/AddSite';
import TimberSiteList from '../../apps/customer/sites/TimberSiteList';
import TimberSiteDetail from '../../apps/customer/sites/TimberSiteDetail';
import ListSite from '../../apps/customer/sites/ListSite';
import SiteDetail from '../../apps/customer/sites/SiteDetail';
import SiteStatus from '../../apps/customer/sites/SiteStatus';
import ExtendSite from '../../apps/customer/sites/ExtendSite';
import ExtendQty from '../../apps/customer/sites/ExtendQty';
import AddVehicle from '../../apps/customer/vehicles/AddVehicle';
import BoulderVehicleList from '../../apps/customer/vehicles/BoulderVehicleList';
import ListVehicle from '../../apps/customer/vehicles/ListVehicle';
import VehicleDetail from '../../apps/customer/vehicles/VehicleDetail';
import UpdateDriver from '../../apps/customer/vehicles/UpdateDriver';
import ListOrder from '../../apps/customer/orders/ListOrder';
import BoulderOrderList from '../../apps/customer/orders/BoulderOrderList';
import AddBoulderOrder from '../../apps/customer/orders/AddBoulderOrder';
import TimberOrder from '../../apps/customer/orders/TimberOrder';
import AddOrder from '../../apps/customer/orders/AddOrder';
import Payment from '../../apps/customer/orders/Payment';
import OrderDetail from '../../apps/customer/orders/OrderDetail';
import TimberOrderDetail from '../../apps/customer/orders/TimberOrderDetail';
import DeliveryList from '../../apps/customer/Delivery/DeliveryList';
import DeliveryDetail from '../../apps/customer/Delivery/DeliveryDetail';
import DeliverySummary from '../../apps/customer/Delivery/DeliverySummary';
import SuccessMsg from '../../apps/customer/orders/SuccessMsg';
import TimberVehicleRegistration from '../../apps/customer/vehicles/TimberVehicleRegistration';
import BoulderSiteList from '../../apps/customer/sites/BoulderSiteList';
import AddBoulderSite from '../../apps/customer/sites/AddBoulderSite';

//Transporter Screens
import TransporterDashboard from '../../apps/transporter/TransporterDashboard';
import AddTransport from '../../apps/transporter/transport/AddTransport';
import ListTransport from '../../apps/transporter/transport/ListTransport';
import TransportDetail from '../../apps/transporter/transport/TransportDetail';
import TransportDriverUpdate from '../../apps/transporter/transport/TransportDriverUpdate';
import AddToQueue from '../../apps/transporter/Queue/AddToQueue';

import DrawerSideMenu from '../header/DrawerSideMenu';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import globalStyle from '../../../styles/globalStyle';
import { startLogout } from '../../../redux/actions/userActions';

import TimberByFinishProductOrderList from '../../apps/customer/orders/TimberByFinishProductOrderList';
import TimberByFinishProductOrder from '../../apps/customer/orders/TimberByFinishProductOrder';


const AppNavigator = createStackNavigator(
  {
    ModeSelector: {
      screen: ModeSelector,
      navigationOptions: { title: Config.APP_NAME },
    },
    CustomerTerms: {
      screen: CustomerTerms,
      navigationOptions: { title: 'Customer Terms & Conditions', headerLeft: <MyBackButton /> },
    },
    CustomerTermsRead: {
      screen: CustomerTermsRead,
      navigationOptions: { title: 'Customer Terms & Conditions', headerLeft: <MyBackButton /> },
    },

    TransporterTerms: {
      screen: TransporterTerms,
      navigationOptions: { title: 'Terms & Conditions', headerLeft: <MyBackButton /> },
    },

    TransporterTermsRead: {
      screen: TransporterTermsRead,
      navigationOptions: { title: 'Terms & Conditions', headerLeft: <MyBackButton /> },
    },

    CustomerDashboard: {
      screen: CustomerDashboard,
      navigationOptions: {
        title: 'Sand', headerLeft: <MyBackButton />
      },
    },
    TimberDashboard: {
      screen: TimberDashboard,
      navigationOptions: {
        title: 'Timber', headerLeft: <MyBackButton />
      },
    },
    BoulderAggreDashboard: {
      screen: BoulderAggreDashboard,
      navigationOptions: {
        title: 'Boulder/Aggregate', headerLeft: <MyBackButton />
      },
    },
    SiteDashboard: {
      screen: SiteDashboard,
      navigationOptions: {
        title: 'Site Dashboard', headerLeft: <MyBackButton />
      },
    },
    AddSite: {
      screen: AddSite,
      navigationOptions: {
        title: 'Add Sand Site', headerLeft: <MyBackButton />
      },
    },

    TimberSiteList: {
      screen: TimberSiteList,
      navigationOptions: {
        title: 'Timber Site', headerLeft: <MyBackButton />
      },
    },
    TimberSiteDetail: {
      screen: TimberSiteDetail,
      navigationOptions: {
        title: 'Add Timber Site', headerLeft: <MyBackButton />
      },
    },
    TimberOrderDetail: {
      screen: TimberOrderDetail,
      navigationOptions: {
        title: 'Timber Order', headerLeft: <MyBackButton />
      },
    },
    ListSite: {
      screen: ListSite,
      navigationOptions: {
        title: 'Sand Sites', headerLeft: <MyBackButton />
      },
    },
    SiteDetail: {
      screen: SiteDetail,
      navigationOptions: {
        title: 'Site Detail', headerLeft: <MyBackButton />
      },
    },
    SiteStatus: {
      screen: SiteStatus,
      navigationOptions: {
        title: 'Site Status', headerLeft: <MyBackButton />
      },
    },
    ExtendSite: {
      screen: ExtendSite,
      navigationOptions: {
        title: 'Site Extension', headerLeft: <MyBackButton />
      },
    },
    ExtendQty: {
      screen: ExtendQty,
      navigationOptions: {
        title: 'Qty Extension', headerLeft: <MyBackButton />
      },
    },

    AddVehicle: {
      screen: AddVehicle,
      navigationOptions: {
        title: 'Add Vehicle', headerLeft: <MyBackButton />
      },
    },
    ListVehicle: {
      screen: ListVehicle,
      navigationOptions: {
        title: 'My Vehicles', headerLeft: <MyBackButton />
      },
    },
    VehicleDetail: {
      screen: VehicleDetail,
      navigationOptions: {
        title: 'Vehicle Detail', headerLeft: <MyBackButton />
      },
    },
    UpdateDriver: {
      screen: UpdateDriver,
      navigationOptions: {
        title: 'Update Driver Info', headerLeft: <MyBackButton />
      },
    },
    ListOrder: {
      screen: ListOrder,
      navigationOptions: {
        title: 'Sand Order List', headerLeft: <MyBackButton />
      },
    },
    BoulderOrderList: {
      screen: BoulderOrderList,
      navigationOptions: {
        title: 'Boulder Order List', headerLeft: <MyBackButton />
      },
    },
    AddBoulderOrder: {
      screen: AddBoulderOrder,
      navigationOptions: {
        title: 'Add Boulder Order', headerLeft: <MyBackButton />
      },
    },
    TimberOrder: {
      screen: TimberOrder,
      navigationOptions: {
        title: 'Timber Order', headerLeft: <MyBackButton />
      },
    },
    AddOrder: {
      screen: AddOrder,
      navigationOptions: {
        title: 'Place Order', headerLeft: <MyBackButton />
      },
    },
    Payment: {
      screen: Payment,
      navigationOptions: {
        title: 'Payment', headerLeft: <MyBackButton />
      },
    },
    OrderDetail: {
      screen: OrderDetail,
      navigationOptions: {
        title: 'Order Detail', headerLeft: <MyBackButton />
      },
    },
    DeliveryList: {
      screen: DeliveryList,
      navigationOptions: {
        title: 'Delivery List', headerLeft: <MyBackButton />
      },
    },

    DeliveryDetail: {
      screen: DeliveryDetail,
      navigationOptions: {
        title: 'Delivery Detail', headerLeft: <MyBackButton />
      },
    },

    DeliverySummary: {
      screen: DeliverySummary,
      navigationOptions: {
        title: 'Delivery Summary', headerLeft: <MyBackButton />
      },
    },

    TransporterDashboard: {
      screen: TransporterDashboard,
      navigationOptions: {
        title: 'Transporter', headerLeft: <MyBackButton />
      },
    },
    AddTransport: {
      screen: AddTransport,
      navigationOptions: {
        title: 'Add Transport', headerLeft: <MyBackButton />
      },
    },
    ListTransport: {
      screen: ListTransport,
      navigationOptions: {
        title: 'My Transport', headerLeft: <MyBackButton />
      },
    },
    TransportDriverUpdate: {
      screen: TransportDriverUpdate,
      navigationOptions: {
        title: 'Transport Driver Update', headerLeft: <MyBackButton />
      },
    },
    TransportDetail: {
      screen: TransportDetail,
      navigationOptions: {
        title: 'Transport Detail', headerLeft: <MyBackButton />
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        title: 'Settings', headerLeft: <MyBackButton />
      },
    },
    Feedback: {
      screen: Feedback,
      navigationOptions: {
        title: 'Feedback', headerLeft: <MyBackButton />
      },
    },
    FaqAuth: {
      screen: FaqAuth,
      navigationOptions: {
        title: 'FAQ', headerLeft: <MyBackButton />
      },
    },
    AddToQueue: {
      screen: AddToQueue,
      navigationOptions: {
        title: 'Manage Queue', headerLeft: <MyBackButton />
      },
    },
    TimberVehicleRegistration: {
      screen: TimberVehicleRegistration,
      navigationOptions: {
        title: 'Register Vehicle', headerLeft: <MyBackButton />
      },
    },
    TimberByFinishProductOrderList: {
      screen: TimberByFinishProductOrderList,
      navigationOptions: {
        title: 'Other Timber Order List', headerLeft: <MyBackButton />
      }
    },

    TimberByFinishProductOrder: {
      screen: TimberByFinishProductOrder,
      navigationOptions: {
        title: 'Other Timber Order', headerLeft: <MyBackButton />
      }
    },

    BoulderSiteList: {
      screen: BoulderSiteList,
      navigationOptions: {
        title: 'Boulder & Aggregate Site', headerLeft: <MyBackButton />
      },
    },
    AddBoulderSite: {
      screen: AddBoulderSite,
      navigationOptions: {
        title: 'Register Site', headerLeft: <MyBackButton />
      },
    },
    ProductRequisition: {
      screen: ProductRequisition,
      navigationOptions: {
        title: 'Product Requisition', headerLeft: <MyBackButton />
      },
    },

    BoulderVehicleList: {
      screen: BoulderVehicleList,
      navigationOptions: {
        title: 'Vehicle List', headerLeft: <MyBackButton />
      },
    }
  },

  {
    initialRouteName: 'ModeSelector',
    defaultNavigationOptions: {
      gestureEnabled: true,
      cardOverlayEnabled: true,
      headerStyle: {
        backgroundColor: Config.APP_HEADER_COLOR,
      },
      headerTitleStyle: {
        color: 'white',
      },
      headerTintColor: '#fff',

      headerRight: (
        <Fragment>
          <Call />
          <DrawerSideMenu />
        </Fragment>
      ),
    },
  },
);

const AuthNavigator = createStackNavigator(
  {
    Login: { screen: Login, navigationOptions: { title: Config.APP_NAME } },
    Signup: { screen: Signup, navigationOptions: { title: 'Register', headerLeft: <MyBackButton /> } },
    PinRecover: { screen: PinRecover, navigationOptions: { title: 'Reset PIN', headerLeft: <MyBackButton /> } },
    About: { screen: About, navigationOptions: { title: 'About', headerLeft: <MyBackButton /> } },
    ContactUs: { screen: ContactUs, navigationOptions: { title: 'Contact Us', headerLeft: <MyBackButton /> } },
    Faq: { screen: Faq, navigationOptions: { title: 'FAQ', headerLeft: <MyBackButton /> } },
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      gestureEnabled: true,
      cardOverlayEnabled: true,
      headerStyle: {
        backgroundColor: Config.APP_HEADER_COLOR,
      },
      headerTitleStyle: {
        color: 'white',
      },
      headerTintColor: '#fff',
      headerRight: <Call />,
    },
  },
);


const AcknowledgeNavigator = createStackNavigator(
  {
    UserDetail: { screen: UserDetail, navigationOptions: { title: 'User Detail' } },
  },
  {
    initialRouteName: 'UserDetail',
    defaultNavigationOptions: {
      gestureEnabled: true,
      cardOverlayEnabled: true,
      headerStyle: {
        backgroundColor: Config.APP_HEADER_COLOR,
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerTintColor: '#fff',

      headerRight: (
        <Fragment>
          <Call />
          <Logout />
        </Fragment>
      ),
    },
  },
);

const InfoNavigator = createStackNavigator(
  {
    Login: { screen: Login, navigationOptions: { title: '' } },
    About: { screen: About, navigationOptions: { title: 'About', headerLeft: <MyBackButton /> } },
    ContactUs: { screen: ContactUs, navigationOptions: { title: 'Contact Us', headerLeft: <MyBackButton /> } },
    Faq: { screen: Faq, navigationOptions: { title: 'FAQ', headerLeft: <MyBackButton /> } },
    Help: { screen: Help, navigationOptions: { title: 'Help', headerLeft: <MyBackButton /> } },
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      gestureEnabled: true,
      cardOverlayEnabled: true,
      headerStyle: {
        backgroundColor: Config.APP_HEADER_COLOR,
      },
      headerTitleStyle: {
        color: 'white',
      },
      headerTintColor: '#fff',
      headerRight: (
        <Fragment>
          <Call />
          <Logout />
        </Fragment>
      ),
    },
  },
);

const CustomDrawerContentComponent = (props) => (
  <Container>
    <Content>
      <DrawerItems {...props} />
      <TouchableOpacity>
        <Logout />
      </TouchableOpacity>
    </Content>
  </Container>
)

const performLogout = () => {
  startLogout();
  NavigationService.navigate('Login');
};


const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: AppNavigator,
    navigationOptions: {
      title: 'HOME',
      drawerIcon: (
        <Icon trans name="home" style={globalStyle.drawerIcon} />
      ),
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'PROFILE',
      drawerIcon: (
        <Icon trans name="settings" style={globalStyle.drawerIcon} />
      ),
    },
  },
  Feedback: {
    screen: Feedback,
    navigationOptions: {
      title: 'FEEDBACK',
      drawerIcon: (
        <Icon trans name="feedback" type="MaterialIcons" style={globalStyle.drawerIcon} />
      ),
    },
  },
  FaqAuth: {
    screen: FaqAuth,
    navigationOptions: {
      title: 'FAQ',
      drawerIcon: (
        <Icon trans name="help-circle-outline" style={globalStyle.drawerIcon} />
      ),
    },
  },

  CustomerTermsRead: {
    screen: CustomerTermsRead,
    navigationOptions: {
      title: 'CUSTOMER TOR',
      drawerIcon: (
        <Icon trans name="assignment" type="MaterialIcons" style={globalStyle.drawerIcon} />
      ),
    },
  },

  TransporterTermsRead: {
    screen: TransporterTermsRead,
    navigationOptions: {
      title: 'TRANSPORTER TOR',
      drawerIcon: (
        <Icon trans name="assignment" type="MaterialIcons" style={globalStyle.drawerIcon} />
      ),
    },
  },
},

  {
    initialRouteName: 'Home',
    drawerPosition: 'right',
    contentComponent: CustomDrawerContentComponent,
  });





export default createAppContainer(
  createSwitchNavigator(
    {
      Drawer: DrawerNavigator,
      AuthLoading: LoadingScreen,
      App: AppNavigator,
      Auth: AuthNavigator,
      Info: InfoNavigator,
      Ack: AcknowledgeNavigator,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
