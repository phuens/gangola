import React, { Fragment } from 'react';
import {Icon, Row, Col, Label, List, ListItem, Right } from 'native-base';
import globalStyles from '../../../../styles/globalStyle';
import { default as commaNumber } from 'comma-number';
// import { Right } from 'react-bootstrap/lib/media';

const TimberOrderQty = ({ data, removeItem }) => {
  const RenderItem = ({ item, index }) => {
    return (
      <ListItem>
        <Row style={{ marginLeft: -15 }}>
          <Col size={3} >
            <Label >{"Item: " + item.item_name + ",Size: " + item.size + ",Length: " + item.length + ", Qty: " + item.qty}</Label>
          </Col>
          <Col size={1.5} style={{ alignItems: "flex-end",marginRight:"-10%" }} >
            <Label >{commaNumber(item.amount)}</Label>
          </Col>
        </Row>
        <Right style={{ marginRight: -15}}>
          <Icon
             onPress={() => removeItem(index)}
            type="FontAwesome" name="minus-circle"/>
        </Right>
      </ListItem>

    );
  };

  return (
    <List>
      {data.length == 0 ? (
        <Fragment></Fragment>
      ) : (
          <ListItem itemDivider >
            <Row style={{ marginLeft: -15 }}>
              <Col size={3} >
                <Label style={globalStyles.labelBold}>Particular</Label>
              </Col>
              <Col size={1.2}  style={{ alignItems: "flex-end",marginRight:"-10%" }} >
                <Label style={globalStyles.labelBold}>Amount</Label>
              </Col>
            </Row>
            <Right style={{ marginRight: -15 }}>
            </Right>
          </ListItem>
        )}

      {data.map((val, index) => {
        return <RenderItem item={val} index={index} key={index} />;
      })}
    </List>
  );
};

export default TimberOrderQty;