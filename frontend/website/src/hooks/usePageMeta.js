import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const usePageMeta = ({
  title,
  description,
  canonicalPath,
  structuredData = [],
}) => {
  const location = useLocation();
  const scriptRefs = useRef([]);
  const isNotFoundPage = canonicalPath === null;

  useEffect(() => {
    // Extract location properties at the start to ensure fresh values
    const { pathname, search, hash } = location;
    const baseUrl = import.meta.env.VITE_SITE_URL || "https://leetbuddy.app";

    // Update title
    if (title) {
      document.title = title;
    }

    // Update description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription && (description || description === "")) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    if (metaDescription) {
      metaDescription.content = description || "";
    }

    // Handle robots meta tag - always create if doesn't exist
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }
    // Set content based on page type
    robotsMeta.content = isNotFoundPage ? "noindex, follow" : "index, follow";

    // Handle canonical URL
    let canonicalLink = document.querySelector("link[rel='canonical']");

    if (isNotFoundPage) {
      // Remove canonical link for non-indexed pages
      if (canonicalLink) {
        canonicalLink.remove();
      }
    } else {
      // Add or update canonical link for indexed pages
      const canonicalUrl = `${baseUrl}${canonicalPath || pathname}`;

      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonicalUrl;
    }

    // Update OG URL - always use the current URL
    const currentUrl = `${baseUrl}${pathname}${search}${hash}`;

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = currentUrl;

    // Update OG title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle && (title || title === "")) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    if (ogTitle) {
      ogTitle.content = title || "";
    }

    // Update OG description
    let ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (!ogDescription && (description || description === "")) {
      ogDescription = document.createElement("meta");
      ogDescription.setAttribute("property", "og:description");
      document.head.appendChild(ogDescription);
    }
    if (ogDescription) {
      ogDescription.content = description || "";
    }

    // Update Twitter title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle && (title || title === "")) {
      twitterTitle = document.createElement("meta");
      twitterTitle.setAttribute("name", "twitter:title");
      document.head.appendChild(twitterTitle);
    }
    if (twitterTitle) {
      twitterTitle.content = title || "";
    }

    // Update Twitter description
    let twitterDescription = document.querySelector(
      'meta[name="twitter:description"]'
    );
    if (!twitterDescription && (description || description === "")) {
      twitterDescription = document.createElement("meta");
      twitterDescription.setAttribute("name", "twitter:description");
      document.head.appendChild(twitterDescription);
    }
    if (twitterDescription) {
      twitterDescription.content = description || "";
    }

    // Clean up any existing structured data scripts
    scriptRefs.current.forEach((script) => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    scriptRefs.current = [];

    // Add new structured data scripts
    structuredData.forEach((data, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = `structured-data-${index}`;
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
      scriptRefs.current.push(script);
    });

    // Cleanup function
    return () => {
      // Remove structured data scripts when component unmounts or page changes
      scriptRefs.current.forEach((script) => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      scriptRefs.current = [];
    };
  }, [title, description, canonicalPath, location.key, structuredData]);
};
