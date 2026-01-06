"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Message sent to Halal Grocery!");
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Could not send message. Please check your connection.");
      }
    } catch (err) {
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <CheckCircle2 className="w-20 h-20 text-orange-500 mx-auto" />
          <h2 className="text-3xl font-black">Thank You!</h2>
          <p className="">
            Your message has been sent. We'll reply within 2 hours.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="rounded-xl"
          >
            Send Another Message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen py-12 px-6 lg:py-24"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={itemVariants}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Get in <span className="text-orange-600">Touch</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Have questions about your order or Halal certification? We are here
            to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 space-y-6"
          >
            <ContactInfoCard
              icon={<Phone className="text-orange-600" />}
              title="Call Us"
              content="+880 1625 842642"
              subContent="9AM - 10PM"
            />
            <ContactInfoCard
              icon={<Mail className="text-orange-600" />}
              title="Email"
              content="support@halalgrocery.com"
              subContent="24/7 Support"
            />
            <ContactInfoCard
              icon={<MapPin className="text-orange-600" />}
              title="Location"
              content="123 Halal Street, Mirpur"
              subContent="Dhaka, Bangladesh"
            />

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-orange-600 rounded-3xl p-8  relative overflow-hidden group shadow-xl shadow-orange-200"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32  rounded-full group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-xl font-bold relative z-10">
                Instant Support
              </h3>
              <p className="text-sm mb-4 relative z-10">
                Chat with us on WhatsApp for faster response.
              </p>
              <a
                href="https://wa.me/8801625842642"
                className="flex items-center justify-center gap-2  text-orange-600 p-3 rounded-xl font-bold relative z-10"
              >
                <FaWhatsapp size={20} /> WhatsApp
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-2  rounded-[2.5rem] shadow-2xl shadow-gray-100 p-8 md:p-12 border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Full Name
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Abdullah Al Mamun"
                    className="h-14 rounded-xl focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Email
                  </label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="h-14 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Subject
                </label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Order Inquiry"
                  className="h-14 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Message
                </label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="How can we help you?"
                  className="min-h-[150px] rounded-2xl p-4"
                />
              </div>
              <Button
                disabled={loading}
                type="submit"
                className="w-full h-16 rounded-2xl bg-orange-600 hover:bg-orange-700  text-lg font-bold shadow-lg shadow-orange-200"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send size={20} className="ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function ContactInfoCard({ icon, title, content, subContent }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-3xl border border-gray-100  flex items-start gap-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="w-12 h-12  rounded-2xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className=" text-xs font-bold uppercase">{title}</h4>
        <p className=" font-bold text-lg mt-1">{content}</p>
        <p className=" text-sm">{subContent}</p>
      </div>
    </motion.div>
  );
}
