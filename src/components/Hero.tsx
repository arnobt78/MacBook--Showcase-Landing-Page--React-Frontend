/**
 * Hero: above-the-fold video + headline block.
 * `playbackRate` is nudged after mount so the hero clip feels snappier (browser autoplay rules still apply: muted + playsInline).
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleImgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const buyRef = useRef<HTMLButtonElement>(null);
  const priceRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 2;
  }, []);

  useGSAP(
    () => {
      const root = document.getElementById("root");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root?.setAttribute("data-hero-cta-ready", "");
        return;
      }
      const h1 = headingRef.current;
      const titleImg = titleImgRef.current;
      const vid = videoRef.current;
      const buy = buyRef.current;
      const price = priceRef.current;
      if (!h1 || !titleImg || !vid || !buy || !price) {
        root?.setAttribute("data-hero-cta-ready", "");
        return;
      }
      gsap.set(buy, { autoAlpha: 0, y: 8, scale: 0.985 });
      root?.setAttribute("data-hero-cta-ready", "");
      const ease = "power2.inOut";
      const enter = {
        autoAlpha: 0,
        y: 8,
        scale: 0.985,
        duration: 0.52,
        ease,
        immediateRender: true,
      };
      const buyHidden = { autoAlpha: 0, y: 8, scale: 0.985 };
      const buyShown = {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.52,
        ease,
      };
      const targets = [h1, titleImg, vid, buy, price];
      const tl = gsap.timeline({
        defaults: { ease },
        onComplete: () => {
          gsap.set(targets, { clearProps: "opacity,visibility,transform" });
        },
      });
      tl.from(h1, enter)
        .from(titleImg, enter, ">0.07")
        .from(vid, enter, ">0.08")
        .fromTo(buy, buyHidden, buyShown, ">0.08")
        .from(price, enter, ">0.07");
    },
    { scope: sectionRef },
  );

  return (
    <section id="hero" ref={sectionRef}>
      <div className="hero-copy">
        <h1 ref={headingRef}>MacBook Pro</h1>
        <img
          ref={titleImgRef}
          src="/title.png"
          alt="MacBook Title"
          loading="eager"
          decoding="sync"
        />
      </div>

      <div className="hero-video-shell">
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

      <button ref={buyRef}>Buy Now</button>

      <p ref={priceRef}>From $1599 or $133/mo for 12 months</p>
    </section>
  );
};

export default Hero;
