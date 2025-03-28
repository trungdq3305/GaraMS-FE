"use client";

import React, { useState, useEffect } from "react";
import {
  updateDeliveryType,
  updatePaymentMethod,
  initiatePayPalPayment
} from "@/dbUtils/ManagerAPIs/invoiceService";
import {
  getCartItems,
  getCartTotal
} from "@/dbUtils/ManagerAPIs/cartService";
import { useRouter } from "next/navigation";
import { Button, Radio, Card, Typography, Divider, message } from "antd";

const { Title, Text } = Typography;

interface RawCartItem {
  inventoryInvoiceDetailId: number;
  inventory: {
    name: string;
    price: number;
  };
  price: number;
}

interface CartItem {
  inventoryInvoiceDetailId: number;
  inventory: {
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface ConsolidatedCartItem {
  inventory: {
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [consolidatedCartItems, setConsolidatedCartItems] = useState<ConsolidatedCartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [deliveryType, setDeliveryType] = useState<'Shipping' | 'AtStore' | null>(null);
  const [isPaymentReady, setIsPaymentReady] = useState(false);

  const fetchCartDetails = async () => {
    try {
      const cartResponse = await getCartItems();
      const totalResponse = await getCartTotal();

      const processedCartItems = cartResponse.map((item: RawCartItem) => ({
        inventoryInvoiceDetailId: item.inventoryInvoiceDetailId,
        inventory: {
          name: item.inventory.name,
          price: item.inventory.price
        },
        quantity: 1,
        price: item.price
      }));

      const consolidatedItems = processedCartItems.reduce((acc: ConsolidatedCartItem[], item: RawCartItem) => {
        const existingItem = acc.find(
          consolidatedItem =>
            consolidatedItem.inventory.name === item.inventory.name &&
            consolidatedItem.inventory.price === item.inventory.price
        );

        if (existingItem) {
          existingItem.quantity += 1;
          existingItem.totalPrice += item.price;
        } else {
          acc.push({
            inventory: item.inventory,
            quantity: 1,
            totalPrice: item.price
          });
        }

        return acc;
      }, []);

      setCartItems(processedCartItems);
      setConsolidatedCartItems(consolidatedItems);
      setCartTotal(totalResponse || 0);
    } catch (error) {
      console.error("Error fetching cart details:", error);
      message.error("Failed to load cart details");
    }
  };

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const handleDeliveryTypeChange = async (type: 'Shipping' | 'AtStore') => {
    try {
      await updateDeliveryType(type);
      setDeliveryType(type);
      // Enable payment button only after delivery type is selected
      setIsPaymentReady(true);
    } catch (error) {
      console.error("Error updating delivery type:", error);
      message.error("An error occurred while updating delivery type");
    }
  };

  const handlePayment = async () => {
    if (!isPaymentReady) {
      message.warning("Please select a delivery option first");
      return;
    }

    try {
      // First, update payment method to PayNow
      await updatePaymentMethod('PayNow');

      // Then initiate PayPal payment
      const paypalResponse = await initiatePayPalPayment(cartTotal);

      // Redirect to PayPal checkout
      window.location.href = paypalResponse;
    } catch (error) {
      console.error("Payment process error:", error);
      message.error("Failed to process payment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Title level={2} className="text-center mb-8 text-blue-900">
          Checkout
        </Title>

        <Card className="mb-6">
          <Title level={4}>Order Summary</Title>
          {consolidatedCartItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-2 pb-2 border-b"
            >
              <div>
                <Text>{item.inventory.name}</Text>
                <Text type="secondary" className="ml-2">
                  x {item.quantity}
                </Text>
              </div>
              <Text strong>${item.totalPrice.toFixed(2)}</Text>
            </div>
          ))}
          <Divider />
          <div className="flex justify-between">
            <Text strong>Total</Text>
            <Text strong className="text-xl">${cartTotal.toFixed(2)}</Text>
          </div>
        </Card>

        <Card className="mb-6">
          <Title level={4}>Delivery Options</Title>
          <Radio.Group
            value={deliveryType}
            onChange={(e) => handleDeliveryTypeChange(e.target.value)}
          >
            <Radio value="Shipping" className="block mb-2">
              <div>
                <Text strong>Home Delivery</Text>
                <Text type="secondary" className="block">
                  Shipping to your address
                </Text>
              </div>
            </Radio>
            <Radio value="AtStore" className="block">
              <div>
                <Text strong>Pick Up In-Store</Text>
                <Text type="secondary" className="block">
                  Collect from our location
                </Text>
              </div>
            </Radio>
          </Radio.Group>
        </Card>

        <Card className="mb-6">
          <Title level={4}>Payment</Title>
          <Button
            type="primary"
            block
            size="large"
            onClick={handlePayment}
            disabled={!isPaymentReady}
          >
            Pay Now
          </Button>
          {!isPaymentReady && (
            <Text type="secondary" className="block mt-2 text-center">
              Please select a delivery option first
            </Text>
          )}
        </Card>
      </div>
    </div>
  );
}