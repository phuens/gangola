import {
  showToast,
  setLoading,
  callAxios,
  handleError,
  attachFile,
  showSuccessMsg,
} from './commonActions';
import {
  siteItemSchema,
  siteSchema,
  siteStatusSchema,
  siteExtensionSchema,
  qtyItemExtensionSchema,
  qtyExtensionSchema,
  driverInfoSchema,
  vehilceSchema,
  driverInfoSchemaSelf,
} from '../../validation/schema/siteSchema';
import {paymentOTPSchema} from '../../validation/schema/customerSchema';
import NavigationService from '../../components/base/navigation/NavigationService';
import Config from 'react-native-config';

/**
 *
 * @param {details of site to be registered} site_info
 * @param {any supporting documents} images
 */
export const startSiteRegistration = (site_info, images, isBuilding) => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      site_info.items.map(async item => {
        try {
          await siteItemSchema.validate(item);
        } catch (error) {
          dispatch(handleError(error));
        }
      });
      await siteSchema.validate(site_info);
      if (isBuilding == 1 && site_info.number_of_floors == null) {
        dispatch(showToast('Number of floors is madatory'));
      } else if (isBuilding == 1 && site_info.plot_no == null) {
        dispatch(showToast('Plot/Thram No is mandatory'));
      } else if (images.length <= 0) {
        dispatch(showToast('Please Attach Construction Approval Documents'));
      } else {
        let res = await callAxios(
          'resource/Site Registration/',
          'POST',
          null,
          site_info,
        );

        const docname = res.data.data.name;
        const doctype = res.data.data.doctype;

        images.map(async image => {
          await attachFile(doctype, docname, image);
        });

        NavigationService.navigate('TimberSiteDetail');
        dispatch(setLoading(false));
        showSuccessMsg(
          'Site Registration request sent, please wait for approval.',
        );
      }
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

export const startBoulderSiteRegistration = (site_info, images, isBuilding) => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      site_info.items.map(async item => {
        try {
          await siteItemSchema.validate(item);
        } catch (error) {
          dispatch(handleError(error));
        }
      });
      await siteSchema.validate(site_info);
      if (isBuilding == 1 && site_info.number_of_floors == null) {
        dispatch(showToast('Number of floors is madatory'));
      } else if (isBuilding == 1 && site_info.plot_no == null) {
        dispatch(showToast('Plot/Thram No is mandatory'));
      } else if (images.length <= 0) {
        dispatch(showToast('Please Attach Construction Approval Documents'));
      } else {
        let res = await callAxios(
          'resource/Site Registration/',
          'POST',
          null,
          site_info,
        );
        const docname = res.data.data.name;
        const doctype = res.data.data.doctype;

        images.map(async image => {
          await attachFile(doctype, docname, image);
        });

        NavigationService.navigate('BoulderSiteList');
        dispatch(setLoading(false));
        showSuccessMsg(
          'Site Registration request sent, please wait for approval.',
        );
      }
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

/**
 *
 * @param {timber site registration} site_info
 * @param {any supporting documents} images
 */
export const timberSiteRegistration = (site_info, images, isBuilding) => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      site_info.items.map(async item => {
        try {
          await siteItemSchema.validate(item);
        } catch (error) {
          dispatch(handleError(error));
        }
      });
      await siteSchema.validate(site_info);
      if (isBuilding == 1 && site_info.number_of_floors == null) {
        dispatch(showToast('Number of floors is madatory'));
      } else if (isBuilding == 1 && site_info.plot_no == null) {
        dispatch(showToast('Plot/Thram No is mandatory'));
      } else if (images.length <= 0) {
        dispatch(showToast('Please Attach Construction Approval Documents'));
      } else {
        let res = await callAxios(
          'resource/Site Registration/',
          'POST',
          null,
          site_info,
        );

        const docname = res.data.data.name;
        const doctype = res.data.data.doctype;

        images.map(async image => {
          await attachFile(doctype, docname, image);
        });

        NavigationService.navigate('TimberSiteList');
        dispatch(setLoading(false));
        showSuccessMsg(
          'Site Registration request sent, please wait for approval.',
        );
      }
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

//Submitting the sales order and nagivate to payment screen.
export const submitSalesOrder = (
  data,
  allLocation,
  totalPayableAmount,
  productCategory,
) => {
  return async dispatch => {
    dispatch(setLoading(true));

    if (productCategory == Config.timber_product_category) {
      if (data.item != undefined && data.item == 'Item') {
        if (allLocation.length > 0 && data.location == undefined) {
          return dispatch(showToast('Please material source'));
        }
      }
    }
    if (
      productCategory == Config.boulder_product_category ||
      productCategory == Config.sand_product_category
    ) {
      if (allLocation.length > 0 && data.location == undefined) {
        return dispatch(showToast('Please select location'));
      }
    }
    //proceed for payment
    try {
      const res = await callAxios(
        'resource/Customer Order/',
        'POST',
        null,
        data,
      );
      if (res.status == 200) {
        NavigationService.navigate('Payment', {
          orderNumber: res.data.data.name,
          site_type: res.data.data.site_type,
          totalPayableAmount: totalPayableAmount,
          approval_status: '', //This is passed to hide and show the paylater button and attachment at payment screen for special project.
          productCategory: productCategory,
        });
      }
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

//Credit payment
export const submitCreditPayment = (data, approvalDocmage = []) => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      const res = await callAxios(
        'resource/Customer Payment/',
        'POST',
        null,
        data,
      );
      const docname = res.data.data.name;
      const doctype = res.data.data.doctype;
      approvalDocmage.map(async image => {
        await attachFile(doctype, docname, image);
      });

      if (res.status == 200) {
        dispatch(setLoading(false));
        showSuccessMsg(
          'Your request for the credit payment was submitted successfully, please wait for approval.',
        );
        NavigationService.navigate('ListOrder');
      }
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

//Payment confrimation from remitter
export const submitMakePayment = data => {
  return async dispatch => {
    // dispatch(setLoading(true));
    try {
      await paymentOTPSchema.validate(data);
      const res = await callAxios(
        'method/erpnext.crm_api.make_payment',
        'post',
        data,
      );
      return res;
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

/**
 *
 * @param {details of site to change status} site_info
 */
export const startSiteStatusChange = site_info => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      await siteStatusSchema.validate(site_info);
      await callAxios('resource/Site Status/', 'POST', null, site_info);
      NavigationService.navigate('ListSite');
      dispatch(setLoading(false));
      showSuccessMsg('Your request has been sent.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

/**
 *
 * @param {details of site to extend end date} site_info
 * @param {supporting documents, if any} images
 */
export const startSiteExtension = (site_info, images = [], product_type) => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      await siteExtensionSchema.validate(site_info);

      const res = await callAxios(
        'resource/Site Extension/',
        'POST',
        null,
        site_info,
      );

      const docname = res.data.data.name;
      const doctype = res.data.data.doctype;

      images.map(async image => {
        await attachFile(doctype, docname, image);
      });
      if (product_type === Config.sand_product_category) {
        NavigationService.navigate('ListSite');
      } else if (product_type === Config.timber_product_category) {
        NavigationService.navigate('TimberSiteList');
      } else if (product_type === Config.boulder_product_category) {
        NavigationService.navigate('BoulderSiteList');
      }

      dispatch(setLoading(false));
      showSuccessMsg('Your request has been sent.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

/**
 *
 * @param {details of qty extension} site_info
 * @param {supporting documents} images
 */
export const startQtyExtension = (site_info, product_category, images) => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      site_info.items.map(async item => {
        try {
          await qtyItemExtensionSchema.validate(item);
        } catch (error) {
          dispatch(handleError(error));
        }
      });

      await qtyExtensionSchema.validate(site_info);

      const res = await callAxios(
        'resource/Quantity Extension/',
        'POST',
        null,
        site_info,
      );

      if (product_category === Config.sand_product_category) {
        NavigationService.navigate('ListSite');
      } else if (product_category === Config.timber_product_category) {
        NavigationService.navigate('TimberSiteList');
      } else if (product_category === Config.boulder_product_category) {
        NavigationService.navigate('BoulderSiteList');
      }

      dispatch(setLoading(false));
      showSuccessMsg('Your request has been sent, please wait for approval.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

/**
 *
 * @param {details of vehicle to register} vehicle_info
 * @param {bluebook document} bluebook
 * @param {marriage certificate, if any} mc
 */
export const startVehicleRegistration = (
  vehicle_info,
  bluebook = [],
  mc = [],
) => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      await vehilceSchema.validate(vehicle_info);
      if (bluebook.length <= 0) {
        dispatch(
          showToast('Bluebook and Driving Licence Attachment is mandatory'),
        );
      } else if (vehicle_info.owner_cid == '') {
        dispatch(showToast('Spouse CID Number is mandatory'));
      } else if (vehicle_info.owner == 'Spouse' && mc.length <= 0) {
        dispatch(showToast('Marriage certificate Attachment is mandatory'));
      } else {
        let res = await callAxios(
          'resource/Transport Request/',
          'POST',
          null,
          vehicle_info,
        );
        const docname = res.data.data.name;
        const doctype = res.data.data.doctype;

        bluebook.map(async image => {
          await attachFile(doctype, docname, image);
        });

        mc.map(async image => {
          await attachFile(doctype, docname, image);
        });
        dispatch(setLoading(false));
        showSuccessMsg(
          'Vehicle Registration request sent, Please wait for approval.',
        );
        NavigationService.navigate('ListVehicle');
      }
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

export const startVehicleRegistrationBoulder = vehicle_info => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      const res = await callAxios(
        'resource/Transport Request/',
        'POST',
        null,
        vehicle_info,
      );
      dispatch(setLoading(false));
      showSuccessMsg('Successfully registered vehicle.');

      NavigationService.navigate('BoulderVehicleList');
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

/**
 *
 * @param {driver's information} driver_info
 */
export const startUpdateDriverDetail = driver_info => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      await driverInfoSchema.validate(driver_info);
      await callAxios('resource/Vehicle Update/', 'POST', null, driver_info);

      NavigationService.navigate('ListTransport');
      dispatch(setLoading(false));
      showSuccessMsg('Update Info request sent, Please wait for approval.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};
/**
 *
 * @param {driver's information} driver_info
 */
export const startUpdateDriverDetailSelf = driver_info => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      await driverInfoSchemaSelf.validate(driver_info);
      await callAxios('resource/Vehicle Update/', 'POST', null, driver_info);

      NavigationService.navigate('ModeSelector');
      dispatch(setLoading(false));
      showSuccessMsg('Update Info request sent, Please wait for approval');
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

/**
 *
 * @param {site data to set site active or inactive} site_data
 */
export const startSetSiteStatus = (site_data, product_type) => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      await callAxios(
        'method/erpnext.crm_api.set_site_status',
        'post',
        site_data,
      );

      dispatch(setLoading(false));
      if (product_type === Config.sand_product_category) {
        NavigationService.navigate('ListSite');
      } else if (product_type === Config.timber_product_category) {
        NavigationService.navigate('TimberSiteList');
      } else if (product_type === Config.boulder_product_category) {
        NavigationService.navigate('BoulderSiteList');
      }
      showSuccessMsg('Successfully changed site status.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

/**
 *
 * @param {vehicle no to be deregistered} vehicle
 */
export const startVehicleDeregistration = vehicle => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      await callAxios(
        'method/erpnext.crm_api.deregister_vehicle',
        'post',
        vehicle,
      );
      dispatch(setLoading(false));
      NavigationService.navigate('ModeSelector');
      showSuccessMsg('Successfully deregistered vehicle.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

/**
 *
 */
export const confirmRecived = data => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      const res = await callAxios(
        'method/erpnext.crm_api.delivery_confirmation',
        'post',
        data,
      );
      dispatch(setLoading(false));
      NavigationService.navigate('DeliveryList');
      showSuccessMsg('Infomartation successfuly updated.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

export const submitApplyForQueue = queueDetail => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      await callAxios('resource/Load Request/', 'post', null, queueDetail);
      dispatch(setLoading(false));
      showSuccessMsg(
        'Your vehicle has been successfully applied to the queue.',
      );
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

export const submitCancelFromQueue = (user, vehicle, remarks) => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      await callAxios(
        'method/erpnext.crm_api.cancel_load_request_with_remarks',
        'post',
        {
          user,
          vehicle,
          remarks,
        },
      );
      dispatch(setLoading(false));
      showSuccessMsg('Cancelled successfully.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

export const cancelOrder = customer_order => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      await callAxios('method/erpnext.crm_api.cancel_customer_order', 'post', {
        customer_order,
      });
      dispatch(setLoading(false));
      showSuccessMsg('Cancelled successfully. You may reorder.');
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};
