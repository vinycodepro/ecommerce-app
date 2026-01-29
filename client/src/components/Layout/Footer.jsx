// client/src/components/Layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
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
      href: 'https://facebook.com',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.7-3.062-1.745-.614-1.045-.614-2.341 0-3.386.614-1.045 1.765-1.745 3.062-1.745s2.448.7 3.062 1.745c.614 1.045.614 2.341 0 3.386-.614 1.045-1.765 1.745-3.062 1.745zm7.548 0c-1.297 0-2.448-.7-3.062-1.745-.614-1.045-.614-2.341 0-3.386.614-1.045 1.765-1.745 3.062-1.745s2.448.7 3.062 1.745c.614 1.045.614 2.341 0 3.386-.614 1.045-1.765 1.745-3.062 1.745z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  const paymentMethods = [
    {
      name: 'Visa',
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="#1A1F71">
          <path d="M9.6 15.6h1.8l1.1-6.8H9.6l1.1 6.8zm4.5 0h1.8l1.2-6.8h-1.8l-1.2 6.8zm4.5 0h1.8l1.5-6.8h-1.8l-1.5 6.8zm-12.6 0h2.1l.9-6.8H6.9l-.9 6.8z"/>
        </svg>
      ),
    },
    {
      name: 'Mastercard',
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24">
          <path d="M15.3 8.3c-1.2 0-2.3.5-3.1 1.3.8.8 1.3 1.9 1.3 3.1s-.5 2.3-1.3 3.1c.8.8 1.9 1.3 3.1 1.3s2.3-.5 3.1-1.3c-.8-.8-1.3-1.9-1.3-3.1s.5-2.3 1.3-3.1c-.8-.8-1.9-1.3-3.1-1.3z" fill="#EB001B"/>
          <path d="M12 12c0-1.2.5-2.3 1.3-3.1-1.6-1.6-4.1-1.6-5.7 0-.8.8-1.3 1.9-1.3 3.1s.5 2.3 1.3 3.1c1.6 1.6 4.1 1.6 5.7 0-.8-.8-1.3-1.9-1.3-3.1z" fill="#F79E1B"/>
        </svg>
      ),
    },
    {
      name: 'PayPal',
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="#003087">
          <path d="M7.5 14.25c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm15-5.25c0 5-4 9-9 9H8.4l-2.9 2.9c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l2.9-2.9H13.5c5 0 9-4 9-9s-4-9-9-9-9 4-9 9c0 1.3.3 2.6.8 3.8.1.3.1.6.1.9 0 .8-.3 1.6-.9 2.2-.6.6-1.4.9-2.2.9-.3 0-.6 0-.9-.1-1.2-.5-2.5-.8-3.8-.8-1.3 0-2.6.3-3.8.8-.3.1-.6.1-.9.1-.8 0-1.6-.3-2.2-.9-.6-.6-.9-1.4-.9-2.2 0-.3 0-.6.1-.9C.3 6.6 0 5.3 0 4c0-5 4-9 9-9s9 4 9 9z"/>
        </svg>
      ),
    },
    {
      name: 'Apple Pay',
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="black">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
    },
    {
      name: 'Google Pay',
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="#5F6368">
          <path d="M5.22 11.22h1.47v1.47H5.22zM6.69 9.75h1.47v1.47H6.69zM8.16 11.22h1.47v1.47H8.16zM9.63 9.75h1.47v1.47H9.63zM6.69 12.69h1.47v1.47H6.69zM8.16 14.16h1.47v1.47H8.16zM9.63 12.69h1.47v1.47H9.63zM11.1 11.22h1.47v1.47H11.1z"/>
          <path d="M15.47 10.47a3.38 3.38 0 0 1 2.45 1.03 3.44 3.44 0 0 1 1.02 2.47v5.03h-1.47v-5.03c0-.53-.2-1-.6-1.4a1.92 1.92 0 0 0-1.4-.6 1.92 1.92 0 0 0-1.4.6 1.92 1.92 0 0 0-.6 1.4v5.03h-1.47v-5.03a3.44 3.44 0 0 1 1.02-2.47 3.38 3.38 0 0 1 2.45-1.03z"/>
          <path d="M4.5 14.16a3.38 3.38 0 0 1 2.45-1.03 3.38 3.38 0 0 1 2.45 1.03 3.44 3.44 0 0 1 1.02 2.47v5.03H8.95v-5.03c0-.53-.2-1-.6-1.4a1.92 1.92 0 0 0-1.4-.6 1.92 1.92 0 0 0-1.4.6 1.92 1.92 0 0 0-.6 1.4v5.03H3.48v-5.03a3.44 3.44 0 0 1 1.02-2.47z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold mr-5 text-lg">Vincyweb</span>
              </div>
              <span className="ml-5 text-xl font-bold">Ecommerce Store</span>
            </Link>
            <p className="mt-4 text-gray-300 max-w-md">
              Your one-stop destination for quality clothing, cutting-edge gadgets, 
              and professional engineering tools. We're committed to providing the 
              best shopping experience with fast shipping and excellent customer service.
            </p>
            
        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Security Badges */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
                Secure Shopping
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-300">
                  <svg className="h-6 w-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  256-bit SSL Secure
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <svg className="h-6 w-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  PCI Compliant
                </div>
              </div>
            </div>

      {/* Payment Methods */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
                We Accept
              </h3>
              <div className="flex items-center space-x-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex items-center justify-center w-10 h-6 bg-white rounded-sm"
                    title={method.name}
                  >
                    {method.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-base text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-300">support@ecommerce.com</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <span className="text-gray-300">
                  123 Commerce Street<br />
                  Suite 100<br />
                  San Francisco, CA 94105
                </span>
              </div>
            </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Subscribe to our newsletter
              </h3>
              <p className="mt-2 text-gray-300">
                Get the latest updates on new products and upcoming sales
              </p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-1 bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 bg-blue-600 py-2 px-6 rounded-md text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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

      {/* Bottom Bar */}
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-300">
              © {currentYear} Ecommerce Store. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <Link to="/privacy" className="hover:text-white mr-3 transition-colors duration-200">
                Privacy Policy.
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="hover:text-white transition-colors duration-200">
                Sitemap
              </Link>
              <Link to="/accessibility" className="hover:text-white transition-colors duration-200">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
         <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                Follow Us
              </h3>
              <div className="flex space-x-4 mt-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          

    </footer>
  );
};

export default Footer;