import {
  PurchaseResponse,
  PurchaseResponseCode,
  PurchaseUpdatesResponse,
  PurchaseUpdatesResponseCode,
  PurchasingService,
  UserData,
} from '@amazon-devices/keplerscript-appstore-iap-lib';

import { IAPManager } from './IAPManager';
/**
 * Sample SDK Response handler that takes care of handling response for each of the SDK APIs.
 * This will have logic to handle response status specific to this sample app.
 */
export class IAPSDKResponseHandler {
  /**
   * Utility method to handle GetPurchaseUpdates API response.
   * Apart from consumable receipts that are marked as FULFILLED in Amazon Appstore,
   * We will receive receipts for each of the IAP item in the response.
   * We need to call {@link IAPManager.handleReceipt} for each of the receipt.
   * @param PurchaseUpdatesResponse
   * @returns userData retrieved from getPurchaseUpdates
   */
  public static handlePurchaseUpdatesResponse = async (
    response: PurchaseUpdatesResponse,
  ): Promise<UserData> => {
    const responseCode = response.responseCode;
    switch (responseCode) {
      case PurchaseUpdatesResponseCode.SUCCESSFUL:
        console.debug('GetPurchaseUpdatesStatus: SUCCESSFUL');
        console.debug(
          `GetPurchaseUpdatesResponse: UserId: ${response.userData.userId.toString()} MarketPlace: ${
            response.userData.marketplace
          }`,
        );

        // Handle each receipt
        for (const receipt of response.receiptList) {
          console.debug(
            `GetPurchaseUpdatesResponse: Processing receipt: ${receipt.receiptId}`,
          );
          await IAPManager.handleReceipt(response.userData.userId, receipt);
        }

        // if there are more receipts, call the getPurchaseUpdates API again.
        if (response.hasMore) {
          PurchasingService.getPurchaseUpdates({ reset: false })
            .then((res) => {
              return this.handlePurchaseUpdatesResponse(res);
            })
            .catch((err) => {
              console.error(
                `Exception while calling getPurchaseUpdates ${err}`,
              );
            });
        }
        break;
      case PurchaseUpdatesResponseCode.FAILED:
        console.debug('GetPurchaseUpdatesStatus: FAILED');
        break;
      case PurchaseUpdatesResponseCode.NOT_SUPPORTED:
        console.debug('GetPurchaseUpdatesStatus: NOT_SUPPORTED');
        break;
      default:
        console.debug(
          'Unknown response code received from GetPurchaseUpdates call',
        );
        break;
    }
    return response.userData;
  };

  /**
   * Utility method to handle purchase response.
   * SUCCESSFUL - call {@link IAPManager.handleReceipt} for granting the purchase.
   * @param PurchaseResponse
   * @returns userData retrieved from PurchaseResponse
   */
  public static handlePurchaseResponse = async (
    response: PurchaseResponse,
  ): Promise<UserData> => {
    const responseCode = response.responseCode;
    switch (responseCode) {
      case PurchaseResponseCode.SUCCESSFUL:
        console.debug('PurchaseStatus: SUCCESSFUL');
        console.debug(
          `PurchaseResponse: UserId: ${response.userData.userId.toString()} MarketPlace: ${
            response.userData.marketplace
          }`,
        );
        await IAPManager.handleReceipt(
          response.userData.userId,
          response.receipt,
        );
        break;
      case PurchaseResponseCode.ALREADY_PURCHASED:
        console.debug(
          'PurchaseResponse: The product is already purchased. You have to verify the purchase on their end and unlock the content to the customer.',
        );
        break;
      case PurchaseResponseCode.INVALID_SKU:
        console.debug(
          'PurchaseResponse: The sku sent in the purchase request is invalid.',
        );
        break;
      case PurchaseResponseCode.FAILED:
        console.debug('PurchaseStatus: FAILED');
        break;
      case PurchaseResponseCode.NOT_SUPPORTED:
        console.debug('PurchaseStatus: NOT_SUPPORTED');
        break;
      default:
        console.debug('Unknown response code received from purchase API call');
        break;
    }
    return response.userData;
  };
}
