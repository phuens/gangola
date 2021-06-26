import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Grid, Row, Col, Content, Button, Label, ListItem } from 'native-base';
import SpinnerScreen from '../../../base/SpinnerScreen';
import globalStyle from '../../../../styles/globalStyle';
import {
  setLoading,
  handleError,
  callAxios,
} from '../../../../redux/actions/commonActions';
import { ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-navigation';

export const DeliverySummary = ({
  userState,
  commonState,
  navigation,
  handleError,
  setLoading,
}) => {
  const [deliverList, setDeliverList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const _refresh = React.useCallback(() => {
    wait(20).then(() => setRefreshing(false));
    getDeliverySummary();
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
      getDeliverySummary();
    }
  }, []);

  const getDeliverySummary = async () => {
    const params = {
      fields: JSON.stringify([
        'name',
        'docstatus',
        'delivery_note',
        'branch',
        'qty',
        'customer_order',
        'confirmation_status',
      ]),
      filters: JSON.stringify([['user', '=', userState.login_id]]),
    };
    try {
      const res = await callAxios(
        `resource/Delivery Confirmation?order_by=creation desc&fields=["name","docstatus","delivery_note","customer_order","confirmation_status","branch","qty"]&filters=[["user","=",${userState.login_id
        }]]`,
      );
      setDeliverList(res.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };
  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
      <Container>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={globalStyle.container}
            refreshControl={
              <RefreshControl
                colors={['#689F38', '#9Bd35A']}
                refreshing={refreshing}
                onRefresh={_refresh}
              />
            }>
            <Content style={globalStyle.content}>
              <ListItem itemDivider>
                <Row>
                  <Col size={2} >
                    <Label style={globalStyle.labelBold}>DN No.</Label>
                  </Col>
                  <Col size={2.9} >
                    <Label style={globalStyle.labelBold}>Order No.</Label>
                  </Col>
                  <Col size={1} >
                    <Label style={globalStyle.labelBold}>Qty</Label>
                  </Col>
                  <Col size={1.3} >
                    <Label style={globalStyle.labelBold}>Status</Label>
                  </Col>
                </Row>
              </ListItem>
              {deliverList.map((deliver, idx) => (
                <ListItem last>
                  <Row key={idx}>
                    <Col size={1.7}>
                      <Text style={{ marginLeft: "-35%", fontSize: 14 }}>{deliver.delivery_note}</Text>
                    </Col>
                    <Col size={2.5}>
                      <Text style={{ fontSize: 14 }}>{deliver.customer_order}</Text>
                    </Col>
                    <Col size={1}>
                      <Text style={{ fontSize: 14 }}>{deliver.qty}</Text>
                    </Col>
                    <Col size={1.2}>
                      <Text style={{ fontSize: 14 }}>
                        {deliver.confirmation_status}
                      </Text>
                    </Col>
                  </Row>
                </ListItem>

              ))}
              <ListItem last></ListItem>
            </Content>
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
  handleError,
  setLoading,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeliverySummary);
