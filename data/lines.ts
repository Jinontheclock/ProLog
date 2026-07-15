// The lines an apprentice sees in Level 1, following the SkilledTradesBC
// Electrician Common Core (Harmonized) Level 1 exam breakdown — the letters
// map to the program outline's General Areas of Competency, which is why
// they aren't contiguous (E, F, K… belong to other levels).

export const LINE_LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "G",
  "H",
  "I",
  "J",
  "L",
  "Q",
  "R",
  "V",
] as const;

export type LineLetter = (typeof LINE_LETTERS)[number];

export const LINE_INFO: Record<string, { title: string; blurb: string }> = {
  A: {
    title: "Apply Circuit Concepts",
    blurb:
      "Series, parallel and combination circuits, voltage dividers, bridge circuits and electromagnetism — the theory behind every installation.",
  },
  B: {
    title: "Perform Safety-Related Functions",
    blurb:
      "Safe work practices on and around electrical equipment: regulations, PPE, lock-out procedures and hazard control.",
  },
  C: {
    title: "Use Tools and Equipment",
    blurb:
      "Hand and power tools, test instruments and access equipment — selected, inspected and used the right way.",
  },
  D: {
    title: "Organize Work",
    blurb:
      "Drawings, specifications and documentation: planning tasks, materials and records that keep a job running smoothly.",
  },
  G: {
    title: "Use Communication and Mentoring Techniques",
    blurb:
      "Clear site communication and the mentoring skills that move trade knowledge from journeyperson to apprentice.",
  },
  H: {
    title: "Install and Maintain Consumer/Supply Services and Metering",
    blurb:
      "Single-phase services from the point of attachment to the service box, plus the metering equipment that bills them.",
  },
  I: {
    title: "Install and Maintain Protection Devices",
    blurb:
      "Breakers, fuses, GFCI and AFCI devices — the protection that keeps fault current from harming people and property.",
  },
  J: {
    title: "Install and Maintain Low Voltage Distribution Systems",
    blurb:
      "Panelboards, splitters and feeders that distribute power through a building at 750 V or less.",
  },
  L: {
    title: "Install and Maintain Bonding, Grounding and Ground Fault Detection",
    blurb:
      "Grounding electrodes, bonding conductors and detection systems that keep fault current on a safe, low-impedance path.",
  },
  Q: {
    title: "Install and Maintain Raceways, Cables and Enclosures",
    blurb:
      "Conduit bending, cable pulling, boxes and enclosures — the pathways that carry and protect conductors.",
  },
  R: {
    title: "Install and Maintain Branch Circuitry",
    blurb:
      "Receptacle, lighting and switching circuits — the wiring that brings power to the point of use.",
  },
  V: {
    title: "Install and Maintain Motor Starters and Controls",
    blurb:
      "Contactors, overload relays and control circuits that start, stop and protect motors.",
  },
};
