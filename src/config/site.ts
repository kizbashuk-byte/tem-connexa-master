import { SubscriptionPlan, NavItem } from "@/types";

export const siteConfig = {
  name: "Connexa",
  description: "The modern SaaS collaboration and integration platform for teams.",
  url: "https://connexa.com",
  ogImage: "https://connexa.com/og.jpg",
  links: {
    twitter: "https://twitter.com/connexa",
    github: "https://github.com/connexa",
  },
};

export const marketingConfig = {
  mainNav: [
    {
      title: "Features",
      href: "/#features",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Blog",
      href: "/blog",
    },
  ] as NavItem[],
};

export const dashboardConfig = {
  sidebarNav: [
    {
      title: "Overview",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: "projects",
    },
    {
      title: "Members",
      href: "/dashboard/members",
      icon: "users",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ] as NavItem[],
};

export const pricingPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "For individuals and side projects getting started.",
    stripePriceId: "",
    price: 0,
    features: [
      "Up to 3 projects",
      "Basic collaboration features",
      "Community support",
      "500MB storage limit",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing teams that need power and flexibility.",
    stripePriceId: "price_stripe_pro_id_placeholder",
    price: 19,
    features: [
      "Unlimited projects",
      "Advanced integrations & API access",
      "Priority email support",
      "10GB storage limit",
      "Custom domains",
      "Detailed analytics",
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom scale solutions for large organizations.",
    stripePriceId: "price_stripe_enterprise_id_placeholder",
    price: 99,
    features: [
      "Dedicated account manager",
      "SLA 99.9% uptime guarantee",
      "Custom SSO/SAML auth integrations",
      "Unlimited storage & team members",
      "Compliance audit logs",
    ],
  },
];
