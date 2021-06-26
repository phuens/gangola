import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  Content,
  Body,
  CardItem,
} from 'native-base';
import {
  callAxios,
  handleError,
  setLoading,
} from '../../../redux/actions/commonActions';
import globalStyle from '../../../styles/globalStyle';

export const CustomerTermsRead = ({ userState, navigation, handleError, setLoading }) => {
  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    }
  }, []);

  const [tor, setTor] = useState([]);

  useEffect(() => {
    setLoading(true);
    getCustomerTor();
  }, []);

  const getCustomerTor = async () => {
    try {
      const response = await callAxios(
        'method/erpnext.crm_utils.get_tor?tor_type=Customer',
      );
      setTor(response.data.message);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Content>
      {tor.map((tac, idx) => (
        <Text style={globalStyle.termsText}>
          {tac.title}
        </Text>
      ))}
      <CardItem>
        <Body>
          {tor.map((tac, idx) => (
            <Text style={globalStyle.paragraphAlignment}>
              {tac.content}
            </Text>
          ))}
        </Body>
      </CardItem>
    </Content>
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerTermsRead);
