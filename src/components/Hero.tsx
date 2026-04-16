/**
 * Hero: above-the-fold video + headline block.
 * `playbackRate` is nudged after mount so the hero clip feels snappier (browser autoplay rules still apply: muted + playsInline).
 */
import { useEffect, useRef } from "react";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleImgRef = useRef<HTMLImageElement>(null);
  const videoShellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const buyRef = useRef<HTMLButtonElement>(null);
  const priceRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 2;
  }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    const section = sectionRef.current;
    const videoShell = videoShellRef.current;
    const h1 = headingRef.current;
    const titleImg = titleImgRef.current;
    const vid = videoRef.current;
    const buy = buyRef.current;
    const price = priceRef.current;
    if (!section || !videoShell || !h1 || !titleImg || !vid || !buy || !price) {
      root?.setAttribute("data-hero-cta-ready", "");
      return;
    }
    videoShell.classList.add("hero-video-reveal");
    section.classList.add("hero-stagger");
    const syncSectionInView = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const isInView = rect.top < viewportHeight * 0.9 && rect.bottom > 0;
      section.classList.toggle("is-inview", isInView);
    };
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-inview");
        } else {
          section.classList.remove("is-inview");
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoShell.classList.add("is-inview");
          vid.currentTime = 0;
          void vid.play();
        } else {
          videoShell.classList.remove("is-inview");
          vid.pause();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );
    sectionObserver.observe(section);
    videoObserver.observe(videoShell);
    syncSectionInView();
    const ctaUnmaskId = window.requestAnimationFrame(() => {
      root?.setAttribute("data-hero-cta-ready", "");
    });
    return () => {
      window.cancelAnimationFrame(ctaUnmaskId);
      sectionObserver.disconnect();
      videoObserver.disconnect();
      section.classList.remove("hero-stagger", "is-inview");
      videoShell.classList.remove("hero-video-reveal", "is-inview");
    };
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="hero-stagger">
      <div className="hero-copy">
        <h1 ref={headingRef} className="hero-reveal-item [--hero-delay:0ms]">
          MacBook Pro
        </h1>
        <img
          className="hero-reveal-item [--hero-delay:180ms]"
          ref={titleImgRef}
          src="/title.png"
          alt="MacBook Title"
          loading="eager"
          decoding="sync"
        />
      </div>

      <div ref={videoShellRef} className="hero-video-shell">
        <video
          ref={videoRef}
          src="/videos/hero.mp4"
          autoPlay
          muted
          playsInline
          width="100%"
          height="100%"
        />
      </div>

      <button ref={buyRef} className="hero-reveal-item [--hero-delay:360ms]">
        Buy Now
      </button>

      <p ref={priceRef} className="hero-reveal-item [--hero-delay:540ms]">
        From $1599 or $133/mo for 12 months
      </p>
    </section>
  );
};

export default Hero;
