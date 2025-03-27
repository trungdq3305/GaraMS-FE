"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import useAuthStore from "@/app/login/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { 
  getCartItems, 
  removeCartItem, 
  addInventoryToCart, 
  getCartTotal 
} from "@/dbUtils/ManagerAPIs/cartService";
import { Badge, Button, message } from "antd";

interface Inventory {
  inventoryId: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  
}

interface CartItem {
  inventoryInvoiceDetailId: number;
  inventoryId: number;
  price: number;
  inventory?: Inventory;
  quantity: number;
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const isAuthenticated = !!user;
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const fetchCartItems = async () => {
    try {
      const cartResponse = await getCartItems();
      const totalResponse = await getCartTotal();
  
      // Nhóm các sản phẩm có cùng inventoryId và đếm số lượng
      const groupedItems: Record<number, CartItem & { quantity: number }> = {};
  
      cartResponse.forEach((item: CartItem) => {
        if (!groupedItems[item.inventoryId]) {
          groupedItems[item.inventoryId] = { ...item, quantity: 1 };
        } else {
          groupedItems[item.inventoryId].quantity += 1;
        }
      });
  
      setCartItems(Object.values(groupedItems));
      setCartTotal(totalResponse || 0);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      message.error("Failed to load cart items");
    }
  };
  

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Hàm tăng số lượng sản phẩm
  const handleIncreaseQuantity = async (inventoryId: number) => {
    try {
      await addInventoryToCart(inventoryId);
      await fetchCartItems();
      message.success("Added one more item");
    } catch (error) {
      console.error("Error increasing item quantity:", error);
      message.error("Failed to add item");
    }
  };

  // Hàm giảm số lượng sản phẩm
  const handleDecreaseQuantity = async (inventoryInvoiceDetailId: number, quantity: number) => {
    try {
      await removeCartItem(inventoryInvoiceDetailId);
      await fetchCartItems();
      if (quantity === 1) {
        message.success("Item removed from cart");
      } else {
        message.success("Decreased quantity");
      }
    } catch (error) {
      console.error("Error decreasing item quantity:", error);
      message.error("Failed to decrease item quantity");
    }
  };

  return (
    <nav className="bg-gray-800 shadow-md w-full flex relative justify-between items-center px-7 h-20 z-50">
      {/* Left Navigation Links */}
      <div className="hidden md:block">
        <Link href="/" className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold text-white">
          Home
        </Link>
        <Link href="/services" className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold text-white">
          Services
        </Link>
        <Link href="/promotions" className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold text-white">
          Promotions
        </Link>
        <Link href="/inventories" className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold text-white">
          Inventory
        </Link>
        <Link href="/term_policy" className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold text-white">
          Term and Policy
        </Link>
        <Link href="/report" className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold text-white">
          Report
        </Link>
      </div>

      {/* Logo */}
      <Link href="/" className="text-4xl font-bold text-white">
        G A R A M S
      </Link>

      {/* Right Side - Auth and Cart */}
      <div className="flex-initial relative">
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Custom Cart Dropdown */}
              <div className="relative" ref={cartRef}>
                <Badge count={cartItems.length} size="small">
                  <ShoppingCart
                    className="text-white w-6 h-6 cursor-pointer hover:text-gray-300"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                  />
                </Badge>

                {isCartOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg p-5 z-50">
                    <div className="max-h-80 overflow-y-auto">
                      {cartItems.length === 0 ? (
                        <div className="text-center text-gray-500 text-lg">Your cart is empty</div>
                      ) : (
                        cartItems.map((item) => (
                          <div key={item.inventoryId} className="border-b last:border-b-0 py-4 flex items-center">
                            <div className="flex-grow">
                              <div className="font-semibold text-lg">{item.inventory?.name || "Unknown Item"}</div>
                              <div className="text-gray-600 text-sm">{item.inventory?.description || "No description"}</div>
                              <div className="flex items-center space-x-3 mt-2">
                                <span className="text-lg font-bold text-blue-600">Price: ${item.price}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
  <Button 
    icon={<Minus size={16} />} 
    type="text" 
    onClick={() => handleDecreaseQuantity(item.inventoryInvoiceDetailId, item.quantity)}
    disabled={item.quantity <= 1}
  />
  <span className="px-3">{item.quantity}</span>
  <Button 
    icon={<Plus size={16} />} 
    type="text" 
    onClick={() => handleIncreaseQuantity(item.inventoryId)}
  />
 <Button 
                                icon={<Trash2 size={20} />} 
                                type="text" 
                                danger
                                onClick={() => handleDecreaseQuantity(item.inventoryInvoiceDetailId, 1)}
                              />
</div>

                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-5 flex justify-between items-center">
                      <div className="text-xl font-bold">Total: ${cartTotal.toFixed(2)}</div>
                      <Button type="primary" onClick={() => router.push('/checkout')} disabled={cartItems.length === 0}>
                        Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/profile"><User className="text-white w-6 h-6" /></Link>
              <button onClick={handleLogout} className="text-white font-semibold">Logout</button>
            </>
          ) : (
            <div className="flex space-x-4 mt-4">
              <Link
                href="/login"
                className="px-6 py-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-lg font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 border border-gray-700"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-lg font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 border border-purple-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
