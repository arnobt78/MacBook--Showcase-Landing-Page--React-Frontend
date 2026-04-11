/**
 * Top navigation shell: purely presentational (links do not route in this SPA).
 * Labels come from `constants` so you can swap copy in one place.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { navLinks } from "../constants";

const NavBar = () => {
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const nav = headerRef.current?.querySelector("nav");
      if (!nav) return;
      const targets = [
        nav.querySelector(".nav-bar-logo"),
        nav.querySelector(".nav-bar-links"),
        nav.querySelector(".nav-bar-actions"),
      ].filter((el): el is Element => el != null);
      if (!targets.length) return;
      gsap.from(targets, {
        autoAlpha: 0,
        y: 8,
        scale: 0.985,
        duration: 0.52,
        stagger: 0.07,
        ease: "power2.inOut",
        immediateRender: true,
      });
    },
    { scope: headerRef },
  );

  return (
    <header ref={headerRef}>
      <nav>
        <img
          className="nav-bar-logo"
          src="/logo.svg"
          alt="Apple logo"
          width={18}
          height={22}
          loading="eager"
          decoding="sync"
        />

        <ul className="nav-bar-links">
          {navLinks.map(({ label }) => (
            <li key={label}>
              <a href={label}>{label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-bar-actions flex-center gap-3">
          <button type="button" aria-label="Search">
            <img
              className="nav-bar-icon"
              src="/search.svg"
              alt=""
              width={22}
              height={22}
              loading="eager"
              decoding="sync"
            />
          </button>
          <button type="button" aria-label="Shopping bag">
            <img
              className="nav-bar-icon"
              src="/cart.svg"
              alt=""
              width={22}
              height={22}
              loading="eager"
              decoding="sync"
            />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
