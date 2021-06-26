import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
  Container,
  Text,
  Body,
  Right,
  Icon,
  Button,
  List,
  ListItem,
} from 'native-base';

import SpinnerScreen from '../../../base/SpinnerScreen';
import {
  callAxios,
  setLoading,
  handleError,
} from '../../../../redux/actions/commonActions';
import globalStyles from '../../../../styles/globalStyle';
import {FlatList} from 'react-native-gesture-handler';
import {NavigationEvents} from 'react-navigation';
import {SafeAreaView, ScrollView, RefreshControl} from 'react-native';
export const ListVehicle = ({
  userState,
  commonState,
  navigation,
  setLoading,
  handleError,
}) => {
  const [vehicle, setVehicle] = useState([]);
  const [reload, setReload] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const _refresh = React.useCallback(() => {
    wait(2000).then(() => setRefreshing(false));
    getActiveVehciles();
  }, [refreshing]);

  function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      setLoading(true);
      getActiveVehciles();
    }
  }, [reload]);

  const renderItem = ({item}) => {
    return (
      <List>
        <ListItem
          thumbnail
          onPress={() =>
            navigation.navigate('VehicleDetail', {id: item.name, is_boulder: 0})
          }>
          <Icon
            style={globalStyles.homeIcon}
            name="check"
            type="SimpleLineIcons"
          />
          <Body>
            <Text>{item.vehicle_no}</Text>
            <Text note numberOfLines={1}>
              Vehicle Capacity: {item.vehicle_capacity} m3
            </Text>
          </Body>
          <Right>
            {item.approval_status === 'Pending' ? (
              <Text style={{color: 'red'}}>{item.approval_status}</Text>
            ) : (
              <Text style={{color: 'green'}}>{item.approval_status}</Text>
            )}
          </Right>
        </ListItem>
      </List>
    );
  };

  const getActiveVehciles = async () => {
    const params = {
      fields: JSON.stringify([
        'name',
        'vehicle_capacity',
        'vehicle_no',
        'drivers_name',
        'contact_no',
        'approval_status',
      ]),
      filters: JSON.stringify([
        ['user', '=', userState.login_id],
        ['self_arranged', '=', 1],
        ['approval_status', '!=', 'Deregistered'],
      ]),
    };

    try {
      const response = await callAxios(
        `resource/Transport Request?order_by=creation desc,approval_status asc&fields=["name", "vehicle_capacity","vehicle_no","drivers_name","contact_no","approval_status"]&filters=[["user","=",${
          userState.login_id
        }],["is_boulder","=",0],["self_arranged", "=", 1],["approval_status", "!=", "Deregistered"],["docstatus", "=", 1]]`,
      );
      setVehicle(response.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
    <Container style={globalStyles.listContent}>
      <Button
        info
        style={globalStyles.mb10}
        onPress={() => navigation.navigate('AddVehicle')}>
        <Text>Add New Vehicle</Text>
        <Icon name="cart-plus" type="FontAwesome5" />
        {/* <Icon name="add-circle" /> */}
      </Button>
      <NavigationEvents
        onWillFocus={_ => {
          setReload(1);
        }}
        onWillBlur={_ => {
          setReload(0);
        }}
      />
      {/* <SafeAreaView style={{flex: 1}}> */}
      <ScrollView
        contentContainerStyle={globalStyles.container}
        refreshControl={
          <RefreshControl
            colors={['#689F38', '#9Bd35A']}
            refreshing={refreshing}
            onRefresh={_refresh}
          />
        }>
        {vehicle.length > 0 ? (
          <FlatList
            data={vehicle}
            renderItem={renderItem}
            keyExtractor={item => item.name}
          />
        ) : (
          <Text style={globalStyles.emptyString}>No approved vehicle yet</Text>
        )}
      </ScrollView>
      {/* </SafeAreaView> */}
    </Container>
  );
};

const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});

const mapDispatchToProps = {
  setLoading,
  handleError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListVehicle);
