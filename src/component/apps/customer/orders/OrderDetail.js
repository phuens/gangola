import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Grid, Row, Col, Content, Button, Input, Item, Label, List, ListItem, Right, Left } from 'native-base';
import SpinnerScreen from '../../../base/SpinnerScreen';
import globalStyle from '../../../../styles/globalStyle';
import {
  setLoading,
  callAxios,
  handleError,
} from '../../../../redux/actions/commonActions';
import { startVehicleDeregistration } from '../../../../redux/actions/siteActions';
import { default as commaNumber } from 'comma-number';
import { ScrollView } from 'react-native';
import Config from 'react-native-config';

export const OrderDetail = ({
  userState,
  commonState,
  navigation,
  handleError,
  setLoading,
}) => {
  const [order, setOrder] = useState({});

  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      setLoading(true);
      getOrderDetails(navigation.state.params.id);
    }
  }, []);

  const getOrderDetails = async id => {
    try {
      const response = await callAxios(`resource/Customer Order/${id}`);
      setOrder(response.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const proceedPayment = async () => {
    const params = {
      fields: JSON.stringify(['name', 'approval_status']),
      filters: JSON.stringify([
        ['user', '=', userState.login_id],
        ['customer_order', '=', navigation.state.params.id],
      ]),
    };

    try {
      const response = await callAxios(
        `resource/Customer Payment?fields=["name","approval_status"]&filters=[["user","=","${userState.login_id
        }"],["customer_order","=","${navigation.state.params.id}"]]`,
      );
      setLoading(false);

      navigation.navigate('Payment', {
        orderNumber: navigation.state.params.id,
        site_type: order.site_type,
        totalPayableAmount: order.total_balance_amount,
        approval_status:
          response.data.data.length > 0
            ? response.data.data[0].approval_status
            : '', //empty string means payments fails for credit allowed site. This is required while show and hide pay later button.
        productCategory: navigation.state.params.product_category
      });
    } catch (error) {
      handleError(error);
    }
  };

  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
      <Container>
        <ScrollView>
          <Content style={globalStyle.content}>

            <ListItem last>
              <Row >
                <Col size={1.7} >
                  <Label >Order Number :</Label>
                </Col>
                <Col size={2.5}>
                  <Text style={{ alignSelf: "flex-start" }}>{navigation.state.params.id}</Text>
                </Col>
              </Row>
            </ListItem>
            {Config.timber_by_product_category !== navigation.state.params.product_category &&
              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Site :</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{order.site}</Text>
                  </Col>
                </Row>
              </ListItem>
            }

            <ListItem last>
              <Row >
                <Col size={1.7} >
                  <Label >Item :</Label>
                </Col>
                <Col size={2.5}>
                  <Text style={{ alignSelf: "flex-start" }}>{order.item_name == null ? order.product_group : order.item_name}</Text>
                </Col>
              </Row>
            </ListItem>

            <ListItem last>
              <Row >
                <Col size={1.7} >
                  <Label >Branch :</Label>
                </Col>
                <Col size={2.5}>
                  <Text style={{ alignSelf: "flex-start" }}>{order.branch}</Text>
                </Col>
              </Row>
            </ListItem>
            {Config.sand_product_category == navigation.state.params.product_category &&
              <ListItem last>
                <Row >
                  <Col size={1.7} >
                    <Label >Transport Mode :</Label>
                  </Col>
                  <Col size={2.5}>
                    <Text style={{ alignSelf: "flex-start" }}>{order.transport_mode}</Text>
                  </Col>
                </Row>
              </ListItem>
            }

            <ListItem last>
              <Row >
                <Col size={1.7} >
                  <Label >Total Order Qty:</Label>
                </Col>
                <Col size={2.5}>
                  <Text style={{ alignSelf: "flex-start" }}>{
                    Config.sand_product_category == navigation.state.params.product_category ?
                      order.total_quantity + " m3" : order.total_quantity + " cft"
                  }</Text>
                </Col>
              </Row>
            </ListItem>
            {order != undefined && (
              <List>
                <ListItem last itemDivider>
                  <Row >
                    <Col size={3} >
                      <Label >Particulars</Label>
                    </Col>
                    <Col size={2}>
                      <Label style={{ alignSelf: "center" }}>Amount (Nu.)</Label>
                    </Col>
                  </Row>
                </ListItem>

                <ListItem last>
                  <Row >
                    <Col size={3} >
                      <Text style={{ alignSelf: "flex-start" }}>Total Item Amt</Text>
                    </Col>
                    <Col size={2}>
                      <Text style={{ alignSelf: "flex-end" }}>{commaNumber(order.total_item_rate != undefined ? order.total_item_rate.toFixed(2) : 0)}</Text>
                    </Col>
                  </Row>
                </ListItem>

                <ListItem last>
                  <Row >
                    <Col size={3} >
                      <Text style={{ alignSelf: "flex-start" }}>Total Transportation Amt</Text>
                    </Col>
                    <Col size={2}>
                      <Text style={{ alignSelf: "flex-end" }}>{commaNumber(order.total_transportation_rate != undefined ? order.total_transportation_rate.toFixed(2) : 0)}</Text>
                    </Col>
                  </Row>
                </ListItem>
                <ListItem last>
                  <Row >
                    <Col size={3} >
                      <Text style={{ alignSelf: "flex-start", fontWeight: "bold" }}>Total Payable Amt</Text>
                    </Col>
                    <Col size={2}>
                      <Text style={{ alignSelf: "flex-end", fontWeight: "bold" }}>{commaNumber(order.total_payable_amount != undefined ? order.total_payable_amount.toFixed(2) : 0)}</Text>
                    </Col>
                  </Row>
                </ListItem>
                <ListItem last>
                  <Row >
                    <Col size={3} >
                      <Text style={{ alignSelf: "flex-start", fontWeight: "bold" }}>Total Balance Amt</Text>
                    </Col>
                    <Col size={2}>
                      <Text style={{ alignSelf: "flex-end", fontWeight: "bold" }}>{commaNumber(order.total_balance_amount != undefined ? order.total_balance_amount.toFixed(2) : 0)}</Text>
                    </Col>
                  </Row>
                </ListItem>
              </List>
            )}


            {order.total_balance_amount > 0 ? (
              <Button
                block
                success
                iconLeft
                style={globalStyle.mb10}
                onPress={proceedPayment}>
                <Text>Proceed to Payment</Text>
              </Button>
            ) : (
                <Fragment />
              )}
          </Content>
        </ScrollView>
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
  startVehicleDeregistration,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderDetail);
