import {
  FulfillmentResult,
  PurchasingService,
  Receipt,
} from '@amazon-devices/keplerscript-appstore-iap-lib';
import { IAPConstants } from '../IAPConstants';
import { IAPSDKResponseHandler } from './IAPSDKResponseHandler';

export class IAPManager {
  public static triggerPurchase = (sku: string): void => {
    // If there are no purchases associated to a particular IAP item, purchase should be allowed.
    // If the IAP item is consumable, purchase should be allowed again.
    // Call purchase API to purchase the IAP item.
    PurchasingService.purchase({ sku: sku })
      .then((res) => {
        // Handle purchase response when it is available.
        return IAPSDKResponseHandler.handlePurchaseResponse(res);
      })
      .catch((err) => {
        console.error(`Exception while calling purchase API ${err}`);
      });
    return;
  };

  public static getPurchaseUpdates = () => {
    // Calling GetPurchaseUpdates API of SDK.
    PurchasingService.getPurchaseUpdates({ reset: false })
      .then((res) => {
        // Handle getPurchaseUpdates when it is available.
        return IAPSDKResponseHandler.handlePurchaseUpdatesResponse(res);
      })
      .catch((err) => {
        console.error(`Exception while calling getPurchaseUpdates ${err}`);
      });
  };

  /**
   * This method contains the business logic to fulfill the customer's purchase
   * based on the response from IAP SDK.
   * @param receipt
   * @param userData
   */
  public static async handleReceipt(
    userId: string,
    receipt: Receipt,
  ): Promise<void> {
    if (!receipt.isCancelled) {
      await this.grantPurchase(userId, receipt);
    }
  }

  /**
   * Utility method to grant purchase to the customer.
   * @param userId
   * @param receipt
   */
  private static async grantPurchase(
    userId: string,
    receipt: Receipt,
  ): Promise<void> {
    // Verify that the SKU is still applicable.
    if (
      !IAPConstants.SKUS.includes(receipt.sku) &&
      !IAPConstants.SKUS.includes(receipt.termSku)
    ) {
      console.warn(
        `The sku ${receipt.sku} + in the receipt ${receipt.receiptId} is not valid anymore`,
      );
      // if the sku is not applicable anymore, call notifyFulfillment with status "UNAVAILABLE"
      PurchasingService.notifyFulfillment({
        receiptId: receipt.receiptId,
        fulfillmentResult: FulfillmentResult.UNAVAILABLE,
      })
        .then((_res) => {
          console.debug(
            `NotifyFulfillment invocation complete for receipt ${receipt.receiptId} with status UNAVAILABLE`,
          );
        })
        .catch((err) => {
          console.error(`Exception while calling notifyFulfillment ${err}`);
        });
      return;
    }

    // Set the purchase status to fulfilled for your application
    PurchasingService.notifyFulfillment({
      receiptId: receipt.receiptId,
      fulfillmentResult: FulfillmentResult.FULFILLED,
    })
      .then((_res) => {
        console.debug(
          `NotifyFulfillment invocation complete for receipt ${receipt.receiptId} with status FULFILLED`,
        );
      })
      .catch((err) => {
        console.error(`Exception while calling notifyFulfillment ${err}`);
      });
  }
}
