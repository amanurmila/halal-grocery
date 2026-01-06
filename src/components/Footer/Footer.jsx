"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RefreshCcw,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="font-sans">
      {/* --- Section 1: Newsletter & Trust Badges --- */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Freshness delivered to <br />
                <span className="text-orange-500">your doorstep.</span>
              </h2>
              <p className="max-w-md text-gray-400">
                Subscribe to our newsletter for exclusive discounts, halal
                recipes, and fresh stock alerts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* WhatsApp Contact Card */}
              <a
                href="https://wa.me/8801625842642"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-4 bg-white/5 border border-white/10 p-2 pl-4 pr-6 rounded-2xl hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-500 w-full sm:w-auto"
              >
                {/* Pulsing Status Dot */}
                <div className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </div>

                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <FaWhatsapp size={28} />
                </div>

                {/* Text Details */}
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold">
                    Fast Support
                  </span>
                  <span className="text-white font-bold text-lg">
                    +880 1625 842642
                  </span>
                </div>
              </a>

              {/* Secondary Action Button */}
              <Button
                asChild
                className="h-16 px-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white font-bold transition-all w-full sm:w-auto"
              >
                <a href="https://wa.me/8801625842642" target="_blank">
                  Order via WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 2: Main Links --- */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link
              href="/"
              className="text-2xl font-black text-white flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full opacity-80" />
              </div>
              Halal<span className="text-orange-500">Grocery</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Premium quality 100% Halal certified groceries. Sourced
              responsibly, delivered freshly, and served with integrity.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<FaFacebookF />} />
              <SocialIcon icon={<FaInstagram />} />
              <SocialIcon icon={<FaWhatsapp />} />
              <SocialIcon icon={<FaTwitter />} />
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h4 className=" font-bold uppercase tracking-widest text-xs">
              Help & Support
            </h4>
            <ul className="space-y-4 text-sm">
              <FooterLink href="/track">Track Your Order</FooterLink>
              <FooterLink href="/returns">Return Policy</FooterLink>
              <FooterLink href="/shipping">Shipping Info</FooterLink>
              <FooterLink href="/faq">Help Center / FAQ</FooterLink>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-6">
            <h4 className=" font-bold uppercase tracking-widest text-xs">
              Our Company
            </h4>
            <ul className="space-y-4 text-sm">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/halal-certification">
                Halal Certification
              </FooterLink>
              <FooterLink href="/farmers">Our Farmers</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs">
              Get In Touch
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                <span>
                  123 Halal Street, Fresh Market, <br />
                  Dhaka, Bangladesh
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                <span>+880 1234 567 890</span>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                <span>support@halalgrocery.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 3: Bottom Bar --- */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs">
            © {currentYear}{" "}
            <span className=" font-medium">Halal Grocery Ltd.</span> All Rights
            Reserved.
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <FaCcVisa size={30} />
            <FaCcMastercard size={30} />
            <FaCcPaypal size={30} />
            <div className="h-6 w-[1px] bg-white/20 mx-2" />
            <span className="text-[10px] font-bold border border-white/20 px-2 py-1 rounded">
              SSL SECURE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Helper Components ---

function FooterLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="hover:text-orange-500 transition-colors duration-300 flex items-center group"
      >
        <div className="w-0 group-hover:w-2 h-[1px] bg-orange-500 mr-0 group-hover:mr-2 transition-all" />
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon }) {
  return (
    <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
      {icon}
    </button>
  );
}
