import React from 'react';
import { useState } from "react";
import { Link } from 'react-router-dom';
import {
  Mail as EnvelopeIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaGooglePay } from "react-icons/fa";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcStripe, FaCcApplePay } from "react-icons/fa6";


const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Subscribed email:", email);

    setEmail("");
  };
  const currentYear = new Date().getFullYear();

  const footerSections = {
    shop: {
      title: 'Shop',
      links: [
        { name: 'All Products', href: '/products' },
        { name: 'New Arrivals', href: '/products?new=true' },
        { name: 'Best Sellers', href: '/products?bestsellers=true' },
        { name: 'Sale', href: '/products?sale=true' },
        { name: 'Gift Cards', href: '/gift-cards' },
      ],
    },
    categories: {
      title: 'Categories',
      links: [
        { name: 'Clothing', href: '/products?category=clothing' },
        { name: 'Gadgets', href: '/products?category=gadgets' },
        { name: 'Engineering Tools', href: '/products?category=civil-engineering-tools' },
        { name: 'Accessories', href: '/products?category=accessories' },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns & Exchanges', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'FAQs', href: '/faq' },
      ],
    },
    company: {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Sustainability', href: '/sustainability' },
      ],
    },
  };

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/vincyshop',
      icon: (props) => (
        <FaFacebook {...props} />
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/vincyshop',
      icon: (props) => (
        <FaInstagram {...props} />
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/vincyshop',
      icon: (props) => (
        <FaTwitter {...props} />
      ),
    },
    {
      name: 'Linkedin',
      href: 'https://linkedin.com',
      icon: (props) => (
        <FaLinkedin {...props} />
      ),
    },
  ];

  const paymentMethods = [
    {
      name: 'Visa',
      icon: <FaCcVisa className="h-8 w-10 text-[#1A1F71]" />,
    },
    {
      name: 'Mastercard',
      icon: <FaCcMastercard className="h-7 w-10 text-[#1A1F71]" />,
    },
    {
      name: 'PayPal',
      icon: <FaCcPaypal className="h-7 w-10 text-[#1A1F71]" />,
    },
    {
      name: 'Apple Pay',
      icon: <FaCcApplePay className="h-7 w-10 text-[#1A1F71]" />,
    },
    {
      name: 'Google Pay',
      icon: <FaGooglePay className="h-7 w-10 text-[#1A1F71]" />,
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
          <div className="space-y-8">
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-base font-bold">
                  VS
                </div>
                <div>
                  <span className="block text-xl font-bold">VincyShop</span>
                  <span className="text-sm text-gray-400">Ecommerce Store</span>
                </div>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-6 text-gray-300 sm:text-base">
                Your one-stop destination for quality clothing, cutting-edge gadgets,
                and professional engineering tools with fast shipping and reliable support.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-200">
                  Secure Shopping
                </h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    256-bit SSL Secure
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    PCI Compliant
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-200">
                  We Accept
                </h3>
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.name}
                      className="flex h-10 w-14 items-center justify-center rounded-md bg-white px-2"
                      title={method.name}
                    >
                      {method.icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                Follow Us
              </h3>
              <div className="mt-3 flex flex-wrap gap-4">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-300 transition-colors duration-200 hover:text-white sm:text-base"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 border-t border-gray-800 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <EnvelopeIcon className="mr-3 h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-300 sm:text-base">support@vincyshop.com</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="mr-3 h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-300 sm:text-base">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="mr-3 mt-0.5 h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-300 sm:text-base">
                  123 Commerce Street<br />
                  Suite 100<br />
                  San Francisco, CA 94105
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              Subscribe to our newsletter
            </h3>
            <p className="mt-2 text-sm text-gray-300 sm:text-base">
              Get the latest updates on new products and upcoming sales.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-1 rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-sm text-gray-400">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-300">
              &copy; {currentYear} VincyShop. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300">
              <Link to="/privacy" className="transition-colors duration-200 hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/terms" className="transition-colors duration-200 hover:text-white">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="transition-colors duration-200 hover:text-white">
                Sitemap
              </Link>
              <Link to="/accessibility" className="transition-colors duration-200 hover:text-white">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
