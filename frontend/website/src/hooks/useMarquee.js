import { useEffect, useRef, useState, useCallback } from "react";

export const useMarquee = (speed = 80) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, ready: false });
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const currentPositionRef = useRef(0);
  const lastWidthRef = useRef(0);
  const resizeTimeoutRef = useRef(null);

  // Measure content width
  const measureContent = useCallback(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const images = scrollElement.querySelectorAll("img");
    const halfCount = images.length / 2;

    if (halfCount === 0) return;

    // Check if all images in first set are loaded
    const firstSetImages = Array.from(images).slice(0, halfCount);
    const allLoaded = firstSetImages.every(
      (img) => img.complete && img.naturalWidth > 0
    );

    if (allLoaded) {
      // Get all logo elements in the first set
      const firstSetElements = Array.from(scrollElement.children).slice(
        0,
        halfCount
      );
      if (firstSetElements.length > 0) {
        const firstRect = firstSetElements[0].getBoundingClientRect();
        const lastRect =
          firstSetElements[firstSetElements.length - 1].getBoundingClientRect();
        const totalWidth = lastRect.right - firstRect.left;

        setDimensions({ width: totalWidth, ready: true });
      }
    } else {
      requestAnimationFrame(() => measureContent());
    }
  }, []);

  // Initial measurement after images load
  useEffect(() => {
    const startMeasurement = () => {
      measureContent();
    };

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(startMeasurement, {
        timeout: 100, // Maximum wait of 100ms
      });
      return () => cancelIdleCallback(id);
    } else {
      const timeout = setTimeout(startMeasurement, 50);
      return () => clearTimeout(timeout);
    }
  }, [measureContent]);

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      // Only react to width changes
      const currentWidth = container.offsetWidth;
      if (currentWidth === lastWidthRef.current) return;

      lastWidthRef.current = currentWidth;

      // Store current visual position before remeasuring
      if (startTimeRef.current && dimensions.width > 0) {
        const elapsed = performance.now() - startTimeRef.current;
        const distance = (speed * elapsed) / 1000;
        currentPositionRef.current = distance % dimensions.width;
      }

      // Debounce the remeasurement
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        measureContent();
      }, 100);
    };

    // Add resize listener
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Also observe container size changes
    const container = containerRef.current;
    let resizeObserver = null;

    if (container && "ResizeObserver" in window) {
      lastWidthRef.current = container.offsetWidth;
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      clearTimeout(resizeTimeoutRef.current);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [measureContent, dimensions.width, speed]);

  const animate = useCallback(
    (timestamp) => {
      const scrollElement = scrollRef.current;
      if (!scrollElement || !dimensions.ready || dimensions.width === 0) return;

      if (!startTimeRef.current) {
        // Calculate start time to maintain current position
        startTimeRef.current =
          timestamp - (currentPositionRef.current * 1000) / speed;
      }

      const elapsed = timestamp - startTimeRef.current;
      const distance = (speed * elapsed) / 1000;

      // Calculate position using modulo for seamless looping
      const position = distance % dimensions.width;

      // Apply transform
      scrollElement.style.transform = `translate3d(${-position}px, 0, 0)`;

      animationRef.current = requestAnimationFrame(animate);
    },
    [dimensions, speed]
  );

  useEffect(() => {
    if (dimensions.ready && dimensions.width > 0) {
      // When dimensions change, adjust the start time to maintain position
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        startTimeRef.current = null;
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, animate]);

  return { containerRef, scrollRef };
};
