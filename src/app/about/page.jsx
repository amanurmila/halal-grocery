"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaLeaf, FaTruck, FaClock, FaHandsHelping } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi";
// If you use shadcn/ui, uncomment these imports and adapt if necessary
// import { Button } from '@/components/ui/button';

export default function AboutUs() {
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto">
      {/* HERO */}
      <header className="">
        <div className="container mx-auto px-6 py-16 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-3 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                <HiOutlineShoppingCart className="w-5 h-5" />
                Halal Grocery — Trusted & Local
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Fresh. Pure. Halal — Delivered to Your Door
              </h1>

              <p className="max-w-xl text-lg opacity-95">
                We bring carefully curated halal groceries — from local farms
                and global suppliers — to your kitchen. Quality, transparency,
                and community are at the heart of everything we do.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                {/* Use shadcn Button if available, otherwise fallback button */}
                <a
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-md bg-white text-orange-700 px-5 py-3 font-semibold shadow-md hover:shadow-lg transition"
                >
                  Shop Fresh Now
                </a>

                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border border-white/30 text-white px-4 py-2 text-sm hover:bg-white/10 transition"
                >
                  Contact Us
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Replace /public/hero.jpg with your actual image path */}
              <Image
                src="/Images/Home/slider1.png"
                alt="Halal Grocery Hero"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="container mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FeatureCard
            icon={<FaLeaf className="w-6 h-6 text-orange-600" />}
            title="100% Halal Verified"
            desc="Every product is certified or carefully verified to meet halal standards."
          />

          <FeatureCard
            icon={<FaTruck className="w-6 h-6 text-orange-600" />}
            title="Fast Local Delivery"
            desc="Same-day delivery in select areas and reliable nationwide shipping."
          />

          <FeatureCard
            icon={<FaHandsHelping className="w-6 h-6 text-orange-600" />}
            title="Community First"
            desc="We partner with local growers and small businesses to support our community."
          />

          <FeatureCard
            icon={<FaClock className="w-6 h-6 text-orange-600" />}
            title="Transparency"
            desc="Full ingredient lists, sourcing info, and traceability for peace of mind."
          />
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-lg max-w-xl">
              To make halal living simple and delightful by providing fresh,
              trustworthy groceries with clear ingredient sourcing and fast
              delivery. We want to make it easy for families to put healthy,
              halal food on the table.
            </p>

            <h3 className="text-xl font-semibold mt-6">Our Vision</h3>
            <p className="max-w-xl">
              A world where ethical food choices are available to everyone —
              where local communities thrive and halal options are never a
              compromise.
            </p>

            <div className="flex gap-3 pt-4">
              <a
                href="/learn-more"
                className="rounded-md bg-orange-600 px-5 py-2 text-white font-medium shadow hover:bg-orange-700 transition"
              >
                Buy Products
              </a>

              <a
                href="/donate"
                className="rounded-md border border-orange-200 px-5 py-2 text-orange-700 font-medium hover:bg-orange-50 transition"
              >
                Support Local Farms
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden shadow-lg  p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatBlock label="Products" value="1,200+" />
              <StatBlock label="Local Partners" value="80+" />
              <StatBlock label="Cities" value="25" />
              <StatBlock label="Years" value="5" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* STORY / TIMELINE */}
      <section className=" py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Our Story</h2>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-1 bg-orange-200 h-full" />

            <div className="space-y-8">
              <TimelineItem
                side="left"
                year="2019"
                title="Humble Beginnings"
                desc="Started as a small farmers-market stall with a simple idea: trustworthy halal food."
              />

              <TimelineItem
                side="right"
                year="2020"
                title="Growing Community"
                desc="We expanded to online orders and partnered with 20+ local suppliers."
              />

              <TimelineItem
                side="left"
                year="2022"
                title="Regional Delivery"
                desc="Introduced same-day delivery in major cities and improved cold-chain logistics."
              />

              <TimelineItem
                side="right"
                year="2024"
                title="Halal Grocery Today"
                desc="A trusted brand for families, with transparency and community at our core."
              />
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Meet the Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PersonCard
            name="Amina Rahman"
            title="Founder & CEO"
            imgSrc="/images/team/amina.jpg"
          />
          <PersonCard
            name="Omar Khan"
            title="Head of Sourcing"
            imgSrc="/images/team/omar.jpg"
          />
          <PersonCard
            name="Rina Chowdhury"
            title="Operations Lead"
            imgSrc="/images/team/rina.jpg"
          />
          <PersonCard
            name="Sajid Ali"
            title="Customer Experience"
            imgSrc="/images/team/sajid.jpg"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">
              Ready to taste the difference?
            </h3>
            <p className="opacity-90">
              Join thousands of families who trust Halal Grocery for fresh,
              halal food.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/shop"
              className="rounded-md bg-white text-orange-700 px-5 py-2 font-semibold shadow"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="rounded-md border border-white/40 px-4 py-2"
            >
              Send Order
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className=" border-t border-gray-100 py-8">
        <div className="container mx-auto px-6 text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            © {new Date().getFullYear()} Halal Grocery — All rights reserved.
          </div>
          <div className="flex gap-4 items-center">
            <a href="/privacy" className="hover:underline">
              Privacy
            </a>
            <a href="/terms" className="hover:underline">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------- Subcomponents ------------------------- */
function FeatureCard({ icon, title, desc }) {
  return (
    <div className=" rounded-2xl p-6 shadow-md flex gap-4 items-start">
      <div className="rounded-lg  p-3">{icon}</div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="p-4  rounded-lg shadow-sm flex flex-col">
      <span className="text-2xl font-bold text-orange-700">{value}</span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}

function TimelineItem({ side = "left", year, title, desc }) {
  const isLeft = side === "left";
  return (
    <div
      className={`flex flex-col lg:flex-row items-start gap-6 ${
        isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      <div className="lg:w-1/2 lg:pr-8">
        <div className=" p-6 rounded-lg shadow">
          <div className="text-sm font-semibold text-orange-700">{year}</div>
          <h4 className="mt-2 font-bold">{title}</h4>
          <p className="text-sm text-gray-600 mt-2">{desc}</p>
        </div>
      </div>
      <div className="lg:w-1/2 flex items-center">
        <div className="w-10 h-10 rounded-full  shadow flex items-center justify-center border border-orange-200">
          <div className="w-3 h-3 rounded-full bg-orange-600" />
        </div>
      </div>
    </div>
  );
}

function PersonCard({ name, title, imgSrc }) {
  return (
    <div className=" rounded-2xl p-4 text-center shadow hover:shadow-lg transition">
      <div className="w-28 h-28 mx-auto rounded-lg overflow-hidden relative">
        <Image src={imgSrc} alt={name} fill className="object-cover" />
      </div>
      <div className="mt-4">
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  );
}
