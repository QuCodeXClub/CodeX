import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Route metadata registry mapping each page to its unique, descriptive, SEO-optimized title and description.
 */
const ROUTE_META_MAP = {
  "/": {
    title: "CodeX | Official Technical Club of Quantum University",
    description: "Official technical club of Quantum University empowering students to learn, build, and innovate through real-world software, hackathons, and bootcamps.",
  },
  "/about": {
    title: "About Us | CodeX - Quantum University Tech Club",
    description: "Discover CodeX's history, mission, student leadership, technical domains, and community vision at Quantum University.",
  },
  "/events": {
    title: "Events, Hackathons & Workshops | CodeX",
    description: "Explore upcoming and past hackathons, coding workshops, tech summits, and project exhibitions hosted by CodeX.",
  },
  "/team": {
    title: "Meet the Team & Mentors | CodeX",
    description: "Meet the passionate executive leads, technical heads, student coordinators, and faculty mentors powering CodeX.",
  },
  "/register": {
    title: "Join the Club & Event Registration | CodeX",
    description: "Register to join the CodeX club or enroll in upcoming technical competitions and bootcamps at Quantum University.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | CodeX",
    description: "Official privacy policy and data governance practices for CodeX members, registrants, and visitors.",
  },
  "/terms-conditions": {
    title: "Terms & Conditions | CodeX",
    description: "Terms and conditions of participation, registration, and platform usage for CodeX events and programs.",
  },
  "/community-guidelines": {
    title: "Community Guidelines | CodeX",
    description: "Our standards of conduct, collaboration, inclusivity, and technical integrity within the CodeX community.",
  },
  "/event-policy": {
    title: "Event Participation Policy | CodeX",
    description: "Rules, eligibility, attendance requirements, and guidelines for CodeX competitions and events.",
  },
  "/accessibility": {
    title: "Accessibility Statement | CodeX",
    description: "CodeX's commitment to web accessibility, assistive technologies, and inclusive technical education.",
  },
  "/payment-registration-guide": {
    title: "Registration & Payment Guide | CodeX",
    description: "Step-by-step instructions for completing student registration, payment verification, and pass confirmation.",
  },
  "/admin/login": {
    title: "Admin Portal Sign In | CodeX",
    description: "Secure multi-factor authentication portal for authorized CodeX system administrators.",
  },
  "/admin/dashboard": {
    title: "Admin Dashboard | CodeX Control Hub",
    description: "Centralized control panel for CodeX registrations, events, certificates, and system telemetry.",
  },
  "/admin/registrations": {
    title: "Student Registrations | CodeX Admin",
    description: "Manage, review, verify, and export participant registrations across CodeX initiatives.",
  },
  "/admin/events": {
    title: "Manage Events | CodeX Admin",
    description: "Create, schedule, edit, and publish technical workshops, competitions, and conferences.",
  },
  "/admin/certificates": {
    title: "Certificate Dispatch & Issuance | CodeX Admin",
    description: "Generate, verify, batch-process, and dispatch cryptographic certificates of completion.",
  },
  "/admin/boarding-passes": {
    title: "Boarding Passes & Entry Passes | CodeX Admin",
    description: "Issue digital event boarding passes, manage desk allocations, and monitor attendee check-in.",
  },
  "/admin/team": {
    title: "Team Roster Governance | CodeX Admin",
    description: "Manage club members, leads, mentors, designations, and social profiles.",
  },
  "/admin/qr-generator": {
    title: "QR Code Generator | CodeX Admin",
    description: "Generate branded SVG and PNG QR codes with embedded tracking and logos.",
  },
  "/admin/sessions": {
    title: "Active Security Sessions | CodeX Admin",
    description: "Inspect active administrator devices, IP addresses, locations, and revoke sessions.",
  },
  "/admin/messages": {
    title: "Contact Inquiries | CodeX Admin",
    description: "View and respond to inquiries received via the public contact forms.",
  },
  "/admin/tasks": {
    title: "Background Job Queue | CodeX Admin",
    description: "Monitor asynchronous BullMQ worker queues for certificate dispatch, email delivery, and rendering.",
  },
  "/admin/history": {
    title: "System Audit Trail | CodeX Admin",
    description: "Inspect administrative actions, state alterations, and security audit logs.",
  },
  "/admin/logs": {
    title: "System & Access Logs | CodeX Admin",
    description: "Inspect server telemetry, public access traffic, and critical exception logs.",
  },
  "/admin/profile": {
    title: "Admin Profile | CodeX Admin",
    description: "Manage personal admin credentials, profile photo, and password security.",
  },
  "/admin/settings": {
    title: "System Settings | CodeX Admin",
    description: "Configure registration status, maintenance mode, and view security rate limit policies.",
  },
  "/admin/announcements": {
    title: "Broadcast Announcements | CodeX Admin",
    description: "Send multi-channel email announcements to verified participants and team members.",
  },
  "/admin/admins": {
    title: "Admin Accounts Governance | CodeX Admin",
    description: "Super Admin root console for creating, updating, and revoking administrator credentials.",
  },
};

/**
 * Hook to automatically synchronize the document title, meta description,
 * OpenGraph, and Twitter tags with the active route.
 */
export function usePageMeta(customMeta) {
  const location = useLocation();

  useEffect(() => {
    // 1. Resolve matching meta
    let resolvedMeta = null;

    if (customMeta && customMeta.title) {
      resolvedMeta = customMeta;
    } else {
      const pathname = location.pathname.replace(/\/+$/, "") || "/";

      if (ROUTE_META_MAP[pathname]) {
        resolvedMeta = ROUTE_META_MAP[pathname];
      } else if (pathname.startsWith("/verify-certificate")) {
        resolvedMeta = {
          title: "Verify Certificate of Authenticity | CodeX Registry",
          description: "Verify the authenticity, recipient details, and cryptographic signature of official CodeX certificates.",
        };
      } else if (pathname.startsWith("/verify-boarding-pass")) {
        resolvedMeta = {
          title: "Verify Event Boarding Pass | CodeX Check-in",
          description: "Authenticate event entry credentials, desk numbers, and registration verification for CodeX summits.",
        };
      } else if (pathname.startsWith("/events/")) {
        resolvedMeta = {
          title: "Event Details | CodeX Events",
          description: "Explore complete schedule, rules, eligibility, venue, and registration instructions for this CodeX event.",
        };
      } else {
        // Fallback for sub-routes
        const segments = pathname.split("/").filter(Boolean);
        if (segments.length > 0) {
          const formatted = segments[segments.length - 1]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          resolvedMeta = {
            title: `${formatted} | CodeX`,
            description: "CodeX is the official technical club of Quantum University.",
          };
        } else {
          resolvedMeta = ROUTE_META_MAP["/"];
        }
      }
    }

    if (!resolvedMeta) return;

    // 2. Set document title
    document.title = resolvedMeta.title;

    // 3. Helper to set/create meta tag
    const updateMetaTag = (selector, attributeName, attributeValue, content) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attributeName, attributeValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    if (resolvedMeta.description) {
      updateMetaTag('meta[name="description"]', "name", "description", resolvedMeta.description);
      updateMetaTag('meta[name="title"]', "name", "title", resolvedMeta.title);
      updateMetaTag('meta[property="og:title"]', "property", "og:title", resolvedMeta.title);
      updateMetaTag('meta[property="og:description"]', "property", "og:description", resolvedMeta.description);
      updateMetaTag('meta[name="twitter:title"]', "name", "twitter:title", resolvedMeta.title);
      updateMetaTag('meta[name="twitter:description"]', "name", "twitter:description", resolvedMeta.description);
    }

    // 4. Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://qucodex.com${location.pathname}`);
  }, [location.pathname, customMeta]);
}

export default usePageMeta;
