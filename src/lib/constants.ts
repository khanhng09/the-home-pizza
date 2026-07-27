/**
 * Global constants for The Home Pizza
 * Navigation, social links, business info, and static content
 */

export const SITE_NAME = "The Home Pizza";
export const SITE_DOMAIN = "thehomepizza.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;

// Business Information
export const businessInfo = {
  name: "The Home Pizza",
  tagline: "Handmade home-style pizza with slow-fermented dough, seasonal toppings, and warm table energy.",
  description:
    "Authentic handmade pizzas crafted with slow-fermented dough, fresh seasonal toppings, and a passion for great food. Join us for an unforgettable dining experience.",
  email: "hello@thehomepizza.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, Your City, State 12345",
  hours: {
    weekday: "5:00 PM - 11:00 PM",
    weekend: "12:00 PM - 11:00 PM",
    closed: "Mondays",
  },
};

// Navigation
export const navigation = {
  main: [
    { label: "Home", href: "/" },
    { label: "Menu", href: "#menu" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  footer: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Reservation", href: "/reservation" },
  ],
};

// Social Media
export const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/thehomepizza",
    icon: "IcFacebook",
    ariaLabel: "Follow us on Facebook",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/thehomepizza",
    icon: "IcInstagram",
    ariaLabel: "Follow us on Instagram",
  },
];

// Menu Categories (example structure)
export const menuCategories = [
  {
    id: "pizzas",
    name: "Pizzas",
    description: "Our signature handmade pizzas",
  },
  {
    id: "appetizers",
    name: "Appetizers",
    description: "Perfect starters",
  },
  {
    id: "salads",
    name: "Salads",
    description: "Fresh seasonal salads",
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet endings",
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Drinks and wine selection",
  },
];

// Featured Menu Items (example)
export const featuredMenuItems = [
  {
    id: 1,
    name: "Classic Margherita",
    description: "Fresh mozzarella, basil, tomato sauce, olive oil",
    price: 14.99,
    image: "/images/menu/margherita.jpg",
    category: "pizzas",
    vegetarian: true,
  },
  {
    id: 2,
    name: "Prosciutto & Fig",
    description: "Prosciutto, fig jam, ricotta, arugula",
    price: 16.99,
    image: "/images/menu/prosciutto-fig.jpg",
    category: "pizzas",
    vegetarian: false,
  },
];

// Testimonials (example)
export const testimonials = [
  {
    id: 1,
    author: "Sarah Johnson",
    text: "The best pizza in town! The dough is perfection and the atmosphere is so welcoming.",
    rating: 5,
  },
  {
    id: 2,
    author: "Michael Chen",
    text: "Every visit is special. The seasonal toppings keep us coming back.",
    rating: 5,
  },
  {
    id: 3,
    author: "Emma Davis",
    text: "Worth the wait. Authentic flavors and exceptional service.",
    rating: 5,
  },
];

// SEO & Open Graph
export const seoDefaults = {
  title: "The Home Pizza | Handmade Artisan Pizzas",
  description: businessInfo.description,
  keywords: [
    "pizza",
    "handmade pizza",
    "artisan pizza",
    "slow fermented dough",
    "authentic pizza",
    "restaurant",
  ],
  image: "/images/og-image.jpg",
  twitterHandle: "@thehomepizza",
};

// Animations
export const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  },
};

// Breakpoints
export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Feature flags (for future use)
export const features = {
  reservations: true,
  delivery: false,
  takeout: true,
  loyaltyProgram: false,
  newsSubscription: true,
};
