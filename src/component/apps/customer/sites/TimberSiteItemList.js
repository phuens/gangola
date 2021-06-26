import React, {Fragment}from 'react';
import { Text, Button, Icon, Grid, Row, Col, } from 'native-base';
import globalStyles from '../../../../styles/globalStyle';

const TimberSiteItemList = ({ data, removeItem }) => {
  const RenderItem = ({ item, index }) => {
    return (
      <Row
        size={1}
        style={{
          borderWidth: 0.2,
          borderColor: 'black',
        }}>
        <Col size={2} style={globalStyles.colContainer}>
          <Text style={globalStyles.siteItem}>{item.product_category}</Text>
        </Col>
        <Col size={2} style={globalStyles.colContainer}>
          <Text style={globalStyles.siteItem}>
            {item.expected_quantity}
            {/* {item.uom} */}
          </Text>
        </Col>
        <Col size={2} style={globalStyles.colContainer}>
          <Text style={globalStyles.siteItem}>{item.branch}</Text>
        </Col>
        <Col size={1.5}>
          <Button transparent small onPress={() => removeItem(index)}>
            <Icon name="delete" type="AntDesign" style={{ color: 'red' }} />
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <Row style={[globalStyles.materialContainer]}>
      <Grid
        style={{
          width: '100%',
          marginHorizontal: 0,
        }}>
        {data.length == 0 ? (
        <Fragment></Fragment>
        ) : (
            <Row
              size={1}
              style={globalStyles.tableHeaderContainer}>
              <Col size={2} style={globalStyles.colContainer}>
                <Text style={globalStyles.siteItem, globalStyles.tableHeaderText}>{'Item'}</Text>
              </Col>
              <Col size={2} style={globalStyles.siteCol}>
                <Text style={globalStyles.siteItem, globalStyles.tableHeaderText}>{'Qty (CFT)'}</Text>
              </Col>
              <Col size={2} style={globalStyles.siteCol}>
                <Text style={globalStyles.siteItem, globalStyles.tableHeaderText}>{'Source'}</Text>
              </Col>
              <Col size={1.5}>
                <Text style={globalStyles.siteItem,globalStyles.tableHeaderText}>{'Remove'} </Text>
              </Col>
            </Row>
          )}

        {data.map((val, index) => {
          return <RenderItem item={val} index={index} key={index} />;
        })}
      </Grid>
    </Row>
  );
};

export default TimberSiteItemList;
