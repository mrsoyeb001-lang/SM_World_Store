// src/components/order/OrderConfirmation.tsx
import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, User, Home, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

export const OrderConfirmation = () => {
  const navigate = useNavigate();

  // ডেমো ডেটা (পরবর্তীতে API থেকে ডায়নামিক করতে পারবেন)
  const order = {
    id: "ORD-20250831-1234",
    customer: {
      name: "Md Soyeb",
      email: "mdsoyeb@example.com",
    },
    shipping: {
      address: "123, Green Road, Dhaka, Bangladesh",
      method: "Standard Delivery",
      estimated: "3-5 Business Days",
    },
    payment: {
      method: "Credit Card (**** 4242)",
      total: 2599,
      currency: "৳",
    },
    items: [
      { name: "Wireless Headphones", qty: 1, price: 1599 },
      { name: "Phone Cover", qty: 2, price: 1000 },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Success Icon */}
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold mt-4">Thank You for Your Order!</h1>
        <p className="text-muted-foreground mt-2">
          Your order has been placed successfully. A confirmation email has been sent to{" "}
          <span className="font-medium">{order.customer.email}</span>.
        </p>
      </motion.div>

      {/* Order Details */}
      <div className="mt-10 grid gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Order ID:</span>
              <span>{order.id}</span>
            </div>
            <Separator />
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>
                  {order.payment.currency}
                  {item.price}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>
                {order.payment.currency}
                {order.payment.total}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Name:</span> {order.customer.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {order.customer.email}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Shipping Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex items-start gap-2">
              <Home className="h-4 w-4 mt-0.5" /> {order.shipping.address}
            </p>
            <p>
              <span className="font-medium">Method:</span> {order.shipping.method}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Estimated Delivery: {order.shipping.estimated}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => navigate("/products")} className="px-6">
          Continue Shopping
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="px-6"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};
