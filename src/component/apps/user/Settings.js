import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {
  Container,
  Form,
  Item,
  Input,
  Button,
  Text,
  Content,
  Picker,
  Label,
} from 'native-base';
import SpinnerScreen from '../../base/SpinnerScreen';
import {
  handleError,
  setLoading,
  callAxios,
  startSubmitBillingAddress,
  startSubmitPerAddress,
  startSubmitBankAddress,
} from '../../../redux/actions/commonActions';
import globalStyles from '../../../styles/globalStyle';

export const Setting = ({
  userState,
  commonState,
  startSubmitBillingAddress,
  startSubmitPerAddress,
  startSubmitBankAddress,
}) => {
  //state info for forms
  // const [first_name, setfirst_name] = useState(undefined);

  // const [user, setUser] = useState('');
  const [user, setUser] = useState({data: []});
  const [all_dzongkhag, setall_dzongkhag] = useState([]);
  const [all_gewog, setall_gewog] = useState([]);
  const [billing_address_line1, setbilling_address_line1] = useState(undefined);
  const [billing_address_line2, setbilling_address_line2] = useState(undefined);
  const [billing_dzongkhag, setbilling_dzongkhag] = useState(undefined);
  const [billing_gewog, setbilling_gewog] = useState(undefined);

  const [all_financial_inst, setall_financial_inst] = useState([]);
  const [all_financial_inst_branch, setall_financial_inst_branch] = useState(
    [],
  );
  const [
    financial_institution_branch,
    setFinancial_institution_branch,
  ] = useState(undefined);
  const [financial_institution, setFinancial_institution] = useState(undefined);
  const [account_number, setAccount_number] = useState(undefined);

  // setdzongkhag(user.billing_dzongkhag)

  useEffect(() => {
    if (!userState.logged_in) {
      navigation.navigate('Auth');
    } else if (!userState.profile_verified) {
      navigation.navigate('UserDetail');
    } else {
      getDzongkhags();
      getFinancialInstList();
      setLoading(true);
      getUserDetails(userState.login_id);
    }
  }, []);

  useEffect(() => {
    getGewogs();
  }, [billing_dzongkhag]);

  useEffect(() => {
    getFinancialInstBranchList();
  }, [financial_institution]);

  const getUserDetails = async id => {
    try {
      const response = await callAxios(`resource/User Account/${id}`);
      setUser(response.data.data);
      setbilling_address_line1(response.data.data.billing_address_line1);
      setbilling_address_line2(response.data.data.billing_address_line2);
      setbilling_dzongkhag(response.data.data.billing_dzongkhag);
      setbilling_gewog(response.data.data.billing_gewog);

      setFinancial_institution(response.data.data.financial_institution);
      setAccount_number(response.data.data.account_number);

      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };
  const getDzongkhags = async () => {
    setLoading(true);
    try {
      const dz_all = await callAxios(
        'resource/Dzongkhags?filters=[["is_crm_item","=",1]]&limit_page_length=100&order_by=name',
        'get',
      );
      setall_dzongkhag(dz_all.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const getGewogs = async () => {
    if (billing_dzongkhag !== undefined) {
      let params = {
        fields: JSON.stringify(['name']),
        filters: JSON.stringify([['dzongkhag', '=', billing_dzongkhag]]),
      };
      try {
        const gw_all = await callAxios('resource/Gewogs', 'get', params);
        setall_gewog(gw_all.data.data);
      } catch (error) {
        handleError(error);
      }
    }
  };

  const submitBillingAddress = () => {
    const billingAddressChangeRequestData = {
      approval_status: 'Pending',
      user: userState.login_id,
      request_type: 'Change Request',
      request_category: 'Address Details',
      new_address_type: 'Billing Address',
      new_address_line1: billing_address_line1,
      new_address_line2: billing_address_line1,
      new_dzongkhag: billing_dzongkhag,
      new_gewog: billing_gewog,
    };
    startSubmitBillingAddress(billingAddressChangeRequestData);
  };

  const submitBankInfo = () => {
    const bankDetail = {
      approval_status: 'Pending',
      user: userState.login_id,
      request_type: 'Change Request',
      request_category: 'Bank Details',
      new_financial_institution: financial_institution,
      new_financial_institution_branch: financial_institution_branch,
      new_account_number: account_number,
    };
    startSubmitBankAddress(bankDetail);
  };

  const getFinancialInstList = async () => {
    try {
      const bankList = await callAxios(
        `resource/Financial Institution?fields=["name", "bank_name", "bank_code", "short_form"]&filters=[["bank_code", "!=", null]]`,
        'get',
      );
      setall_financial_inst(bankList.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const getFinancialInstBranchList = async () => {
    if (financial_institution !== undefined) {
      let params = {
        filters: JSON.stringify([
          ['financial_institution', '=', financial_institution],
        ]),
      };
      try {
        const bankBranchList = await callAxios(
          'resource/Financial Institution Branch',
          'get',
          params,
        );
        setall_financial_inst_branch(bankBranchList.data.data);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    }
  };
  const checkNumeric = val => {
    var isNum = isNaN(val);
    if (isNum) {
      setAccount_number('');
    }
  };
  return commonState.isLoading ? (
    <SpinnerScreen />
  ) : (
    <Container>
      <Content style={globalStyles.content}>
        <Form>
          <View style={globalStyles.fieldSet}>
            <Text style={globalStyles.legend}>General Information</Text>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>User Name:</Label>
              <Input editable={false} value={user.first_name} />
            </Item>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>CID:</Label>
              <Input disabled value={user.cid} />
            </Item>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Mobile No:</Label>
              <Input disabled value={user.mobile_no} />
            </Item>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Alternative Mobile No:</Label>
              <Input disabled value={user.alternate_mobile_no} />
            </Item>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Email ID:</Label>
              <Input disabled value={user.email_id} />
            </Item>
          </View>

          <View style={globalStyles.fieldSet}>
            <Text style={globalStyles.legend}>Present Address</Text>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Address line 1:</Label>
              <Input
                value={billing_address_line1}
                onChangeText={val => setbilling_address_line1(val)}
              />
            </Item>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Address line 2:</Label>
              <Input
                value={billing_address_line2}
                onChangeText={val => setbilling_address_line2(val)}
              />
            </Item>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Dzongkhag:</Label>
              <Picker
                mode="dropdown"
                selectedValue={billing_dzongkhag}
                onValueChange={val => setbilling_dzongkhag(val)}>
                <Picker.Item
                  label={'Select Dzongkhag'}
                  value={undefined}
                  key={-1}
                />
                {all_dzongkhag &&
                  all_dzongkhag.map((val, idx) => {
                    return (
                      <Picker.Item
                        label={val.name}
                        value={val.name}
                        key={idx}
                      />
                    );
                  })}
              </Picker>
            </Item>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Gewog:</Label>
              <Picker
                mode="dropdown"
                selectedValue={billing_gewog}
                onValueChange={val => setbilling_gewog(val)}>
                <Picker.Item
                  label={'Select Gewog'}
                  value={undefined}
                  key={-1}
                />
                {all_gewog &&
                  all_gewog.map((val, idx) => {
                    return (
                      <Picker.Item
                        label={val.name}
                        value={val.name}
                        key={idx}
                      />
                    );
                  })}
              </Picker>
            </Item>
            <Button
              success
              onPress={submitBillingAddress}
              style={globalStyles.mb50}>
              <Text>Submit Billing Address</Text>
            </Button>
          </View>

          <View style={globalStyles.fieldSet}>
            <Text style={globalStyles.legend}>Permanent Address</Text>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Address line 1:</Label>
              <Input disabled value={user.perm_address_line1} />
            </Item>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Address line 2:</Label>
              <Input disabled value={user.perm_address_line2} />
            </Item>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Dzongkhag:</Label>
              <Picker
                disabled
                mode="dropdown"
                selectedValue={user.perm_dzongkhag}>
                <Picker.Item
                  label={'Select Dzongkhag'}
                  value={undefined}
                  key={-1}
                />
                {all_dzongkhag &&
                  all_dzongkhag.map((val, idx) => {
                    return (
                      <Picker.Item
                        label={val.name}
                        value={val.name}
                        key={idx}
                      />
                    );
                  })}
              </Picker>
            </Item>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Gewog:</Label>
              <Picker disabled mode="dropdown" selectedValue={user.perm_gewog}>
                <Picker.Item
                  label={'Select Gewog'}
                  value={undefined}
                  key={-1}
                />
                {all_gewog &&
                  all_gewog.map((val, idx) => {
                    return (
                      <Picker.Item
                        label={val.name}
                        value={val.name}
                        key={idx}
                      />
                    );
                  })}
              </Picker>
            </Item>
          </View>

          <View style={globalStyles.fieldSet}>
            <Text style={globalStyles.legend}>Bank Information</Text>
            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Bank:</Label>
              <Picker
                mode="dropdown"
                selectedValue={financial_institution}
                onValueChange={val => setFinancial_institution(val)}>
                <Picker.Item label={'Select Bank'} value={undefined} key={-1} />
                {all_financial_inst &&
                  all_financial_inst.map((val, idx) => {
                    return (
                      <Picker.Item
                        label={val.short_form}
                        value={val.short_form}
                        key={idx}
                      />
                    );
                  })}
              </Picker>
            </Item>

            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Branch:</Label>
              <Picker
                mode="dropdown"
                selectedValue={financial_institution_branch}
                onValueChange={val => setFinancial_institution_branch(val)}>
                <Picker.Item
                  label={'Select Branch'}
                  value={undefined}
                  key={-1}
                />
                {all_financial_inst_branch &&
                  all_financial_inst_branch.map((val, idx) => {
                    return (
                      <Picker.Item
                        label={val.name}
                        value={val.name}
                        key={idx}
                      />
                    );
                  })}
              </Picker>
            </Item>

            <Item regular inlineLabel style={globalStyles.mb10}>
              <Label>Account Number:</Label>
              <Input
                value={account_number}
                keyboardType="number-pad"
                onChangeText={val => {
                  setAccount_number(val), checkNumeric(val);
                }}
              />
            </Item>
            <Button success onPress={submitBankInfo} style={globalStyles.mb50}>
              <Text>Submit Bank Information</Text>
            </Button>
          </View>
        </Form>
      </Content>
    </Container>
  );
};

const mapStateToProps = state => ({
  userState: state.userState,
  commonState: state.commonState,
});

const mapDispatchToProps = {
  handleError,
  startSubmitBillingAddress,
  startSubmitPerAddress,
  startSubmitBankAddress,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Setting);
