/**
 * Footer: static legal/support copy + mapped footer links from `constants`.
 * Year is computed at render time so the copyright line stays current.
 */
import { useEffect, useRef } from "react";
import { footerLinks } from "../constants";

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = revealRef.current;
    if (!shell) return;
    const rows = Array.from(
      shell.querySelectorAll<HTMLElement>(".performance-line"),
    );
    if (!rows.length) return;
    rows.forEach((row, index) => {
      row.style.setProperty("--row-delay", `${index * 70}ms`);
    });
    shell.classList.add("footer-reveal-ready");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          shell.classList.add("is-inview");
        } else {
          shell.classList.remove("is-inview");
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(shell);
    return () => {
      observer.disconnect();
      shell.classList.remove("footer-reveal-ready", "is-inview");
    };
  }, []);

  return (
    <footer ref={footerRef}>
      <div ref={revealRef} className="footer-reveal content performance-reveal">
        <div className="performance-line">
          <div className="info">
            <p>
              <span className="block">
                More ways to shop: Find an Apple Store or other retailer near
                you. Or call 000800 040 1966.
              </span>
            </p>
            <img src="/logo.svg" alt="Apple logo" />
          </div>
        </div>
        <hr className="performance-line" />

        <div className="performance-line">
          <div className="links">
            <p>&copy; {new Date().getFullYear()}. All rights reserved.</p>

            <ul>
              {footerLinks.map(({ label, link }) => (
                <li key={label}>
                  <a href={link}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
