/**
 * Swaps between two GLTF groups (16" vs 14") based on Zustand `scale`.
 * `PresentationControls` adds orbit-style interaction; GSAP tweens opacity + X offset for a cross-fade slide.
 */
import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import gsap from "gsap";
import type { Group } from "three";
import { Mesh } from "three";

import MacbookModel16 from "../models/Macbook-16";
import MacbookModel14 from "../models/Macbook-14";
import { useGSAP } from "@gsap/react";

const ANIMATION_DURATION = 1;
const OFFSET_DISTANCE = 5;
const AUTO_Y_RAD_PER_SEC = 0.11;

const AutoSpinGroup = ({ children }: { children: ReactNode }) => {
  const spinRef = useRef<Group>(null);
  useFrame((_, delta) => {
    const g = spinRef.current;
    if (!g) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    g.rotation.y += delta * AUTO_Y_RAD_PER_SEC;
  });
  return <group ref={spinRef}>{children}</group>;
};

/** Sets every mesh material in a group to transparent, then fades opacity (handles multi-material meshes). */
const fadeMeshes = (group: Group | null, opacity: number) => {
  if (!group) return;

  group.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    const mats = Array.isArray(child.material)
      ? child.material
      : [child.material];
    mats.forEach((mat) => {
      mat.transparent = true;
      gsap.to(mat, { opacity, duration: ANIMATION_DURATION });
    });
  });
};

/** Slides a group's pivot along X (world units) to stage the inactive laptop off-screen. */
const moveGroup = (group: Group | null, x: number) => {
  if (!group) return;

  gsap.to(group.position, { x, duration: ANIMATION_DURATION });
};

interface ModelSwitcherProps {
  scale: number;
  isMobile: boolean;
}

const ModelSwitcher = ({ scale, isMobile }: ModelSwitcherProps) => {
  const SCALE_LARGE_DESKTOP = 0.08;
  const SCALE_LARGE_MOBILE = 0.05;

  const smallMacbookRef = useRef<Group>(null);
  const largeMacbookRef = useRef<Group>(null);

  const showLargeMacbook =
    scale === SCALE_LARGE_DESKTOP || scale === SCALE_LARGE_MOBILE;

  useGSAP(() => {
    if (showLargeMacbook) {
      moveGroup(smallMacbookRef.current, -OFFSET_DISTANCE);
      moveGroup(largeMacbookRef.current, 0);

      fadeMeshes(smallMacbookRef.current, 0);
      fadeMeshes(largeMacbookRef.current, 1);
    } else {
      moveGroup(smallMacbookRef.current, 0);
      moveGroup(largeMacbookRef.current, OFFSET_DISTANCE);

      fadeMeshes(smallMacbookRef.current, 1);
      fadeMeshes(largeMacbookRef.current, 0);
    }
  }, [scale]);

  const controlsConfig = {
    snap: true,
    speed: 1,
    zoom: 1,
    azimuth: [-Infinity, Infinity] as [number, number],
    config: { mass: 1, tension: 0, friction: 26 },
  };

  return (
    <>
      <PresentationControls {...controlsConfig}>
        <AutoSpinGroup>
          <group ref={largeMacbookRef}>
            <MacbookModel16 scale={isMobile ? 0.05 : 0.08} />
          </group>
        </AutoSpinGroup>
      </PresentationControls>

      <PresentationControls {...controlsConfig}>
        <AutoSpinGroup>
          <group ref={smallMacbookRef}>
            <MacbookModel14 scale={isMobile ? 0.03 : 0.06} />
          </group>
        </AutoSpinGroup>
      </PresentationControls>
    </>
  );
};

export default ModelSwitcher;
