import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaPhone, FaComments, FaWhatsapp, FaTelegram, FaFacebook, FaRobot } from "react-icons/fa";

// Dummy AI Widget Component (floating button)
const AIChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-xl border p-4">
          <h3 className="font-bold text-lg mb-2">🤖 AI Assistant</h3>
          <div className="h-40 overflow-y-auto border rounded p-2 mb-2 text-sm">
            <p><b>User:</b> Hi, I need help.</p>
            <p><b>AI:</b> Sure! How can I assist you today?</p>
          </div>
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full border rounded p-2 text-sm"
          />
          <Button className="mt-2 w-full">Send</Button>
        </div>
      )}
      <Button
        className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-blue-600 hover:bg-blue-700"
        onClick={() => setOpen(!open)}
      >
        <FaRobot size={22} className="text-white" />
      </Button>
    </div>
  );
};

export default function Support() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Support & Help Center</h1>
        <p className="text-center text-gray-600 mb-10">
          Need help? Choose an option below or connect with our AI Assistant for instant support.
        </p>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <FaEnvelope size={32} className="mx-auto text-blue-500 mb-3" />
              <h3 className="font-semibold text-lg">Email Support</h3>
              <p className="text-gray-600 mb-3">Get help via email from our support team.</p>
              <Button asChild>
                <a href="mailto:support@example.com">Send Email</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <FaPhone size={32} className="mx-auto text-green-500 mb-3" />
              <h3 className="font-semibold text-lg">Call Us</h3>
              <p className="text-gray-600 mb-3">Talk directly with our support agents.</p>
              <Button asChild>
                <a href="tel:+123456789">+1 234 567 89</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <FaComments size={32} className="mx-auto text-purple-500 mb-3" />
              <h3 className="font-semibold text-lg">Live Chat</h3>
              <p className="text-gray-600 mb-3">Chat with our team in real-time.</p>
              <Button asChild>
                <a href="/live-chat">Start Chat</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Social & Instant Messaging */}
        <h2 className="text-2xl font-bold mb-4">Connect with us</h2>
        <div className="flex gap-4 mb-12">
          <Button variant="outline" asChild>
            <a href="https://wa.me/123456789" target="_blank">
              <FaWhatsapp className="mr-2 text-green-500" /> WhatsApp
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://t.me/example" target="_blank">
              <FaTelegram className="mr-2 text-sky-500" /> Telegram
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://facebook.com/example" target="_blank">
              <FaFacebook className="mr-2 text-blue-600" /> Facebook
            </a>
          </Button>
        </div>

        {/* FAQ Section */}
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How can I reset my password?</AccordionTrigger>
            <AccordionContent>
              Go to the login page, click "Forgot Password", and follow the instructions in your email.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Where can I track my order?</AccordionTrigger>
            <AccordionContent>
              You can track your order in the "My Orders" section of your account dashboard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
            <AccordionContent>
              Yes, we offer a 7-day money-back guarantee. Please read our refund policy for details.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Floating AI Widget */}
      <AIChatWidget />
    </div>
  );
}
