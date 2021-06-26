import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Text,
  Card,
  CardItem,
  Right,
  Icon,
  View,
  Button,
  Left,
  Label,
  List,
  ListItem,
  Body
} from 'native-base';

import SpinnerScreen from '../../../base/SpinnerScreen';
import {
  callAxios,
  setLoading,
  handleError,
} from '../../../../redux/actions/commonActions';
import globalStyles from '../../../../styles/globalStyle';
import { FlatList } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { SafeAreaView, ScrollView, RefreshControl } from 'react-native';

export const DeliveryList = ({
  userState,
  commonState,
  navigation,
  setLoading,
  handleError,
}) => {
  const [deliveryList, setDeliverList] = useState([]);
  const [reload, setReload] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const _refresh = React.useCallback(() => {
    wait(20).then(() => setRefreshing(false));
    getDeliveryList();
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
      getDeliveryList();
    }
  }, [reload]);

  const renderItem = ({ item }) => {
    return (

      <List>
        <ListItem thumbnail
          onPress={() => navigation.navigate('DeliveryDetail', { id: item.name })}
        >
          <Icon style={globalStyles.homeIcon} name="check" type="SimpleLineIcons" />
          <Body>
            <Text>{item.delivery_note}</Text>
            <Text note numberOfLines={1}>Branch : {item.branch}</Text>
          </Body>
          <Right>
            {item.confirmation_status === 'In Transit' ? (
              <Text style={{ color: 'red', fontWeight: "bold" }}>{item.confirmation_status}</Text>
            ) : (
                <Text>{item.confirmation_status}</Text>
              )}
          </Right>
        </ListItem>
      </List>
    );
  };

  const getDeliveryList = async () => {
    const params = {
      fields: JSON.stringify([
        'name',
        'docstatus',
        'delivery_note',
        'branch',
        'confirmation_status',
      ]),
      filters: JSON.stringify([
        ['user', '=', userState.login_id],
        // ['docstatus', '!=', 2],
      ]),
    };
    try {
      const response = await callAxios(
        `resource/Delivery Confirmation?order_by=creation desc&fields=["name","docstatus","delivery_note","confirmation_status","branch"]&filters=[["user","=",${userState.login_id
        }]]`,
      );
      setDeliverList(response.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
      <Container style={globalStyles.listContent}>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={globalStyles.container}
            refreshControl={
              <RefreshControl
                colors={['#689F38', '#9Bd35A']}
                refreshing={refreshing}
                onRefresh={_refresh}
              />
            }>
            {deliveryList.length > 0 ? (
              <Button
                block
                info
                iconLeft
                style={globalStyles.mb10}
                onPress={() => navigation.navigate('DeliverySummary')}>
                <Text>Delivery Summary</Text>
              </Button>
            ) : (
                <Fragment />
              )}
            <NavigationEvents
              onWillFocus={_ => {
                setReload(1);
              }}
              onWillBlur={_ => {
                setReload(0);
              }}
            />
            {deliveryList.length > 0 ? (
              <FlatList
                data={deliveryList}
                renderItem={renderItem}
                keyExtractor={item => item.name}
              />
            ) : (
                <Text style={globalStyles.emptyString}>
                  Currently no delivery in transit for your order.
                </Text>
              )}
          </ScrollView>
        </SafeAreaView>
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
)(DeliveryList);
