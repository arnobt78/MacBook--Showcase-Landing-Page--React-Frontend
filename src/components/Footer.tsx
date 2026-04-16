/**
 * Footer: static legal/support copy + mapped footer links from `constants`.
 * Year is computed at render time so the copyright line stays current.
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { footerLinks } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const targets = [".info", "hr", ".links"];
      gsap.set(targets, { autoAlpha: 0, y: 24, scale: 0.985 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 0.72, ease: "power2.inOut" },
      });
      tl.to(targets, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        stagger: 0.16,
      });

      const trigger = ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 92%",
        end: "bottom top",
        animation: tl,
        toggleActions: "play none play reverse",
      });

      return () => {
        trigger?.kill();
        tl.kill();
      };
    },
    { scope: footerRef },
  );

  return (
    <footer ref={footerRef}>
      <div className="info">
        <p>
          More ways to shop: Find an Apple Store or other retailer near you. Or
          call 000800 040 1966.
        </p>
        <img src="/logo.svg" alt="Apple logo" />
      </div>

      <hr />

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
    </footer>
  );
};

export default Footer;
