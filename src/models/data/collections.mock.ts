import { CollectionMeta } from "../types/collection";

export const mockCollections: Record<string, CollectionMeta> = {
  tactix: {
    id: "tactix",
    name: "APEX TACTIX",
    tagline: "READY BY DESIGN.",
    focus: "Readiness & Modern Utility",
    description:
      "Utility clothing in a concrete passage. Built for daily, training, and operational contexts with functional modularity.",
    accentColor: "#777d63",
    heroImage: "/images/apex/campaign-tactix-0.jpeg",
    keywords: ["Daily Utility", "Range", "Deploy", "Readiness"],
  },
  apextive: {
    id: "apextive",
    name: "APEXTIVE",
    tagline: "BUILT TO KEEP MOVING.",
    focus: "Movement & Physical Progress",
    description:
      "A runner accelerating at dawn. Active lifestyle and athletic performance engineered to support physical progress without restriction.",
    accentColor: "#b8d943",
    heroImage: "/images/apex/campaign-apextive-0.jpeg",
    keywords: ["All Day", "Performance", "Motion", "Endurance"],
  },
  outdoor: {
    id: "outdoor",
    name: "APEX OUTDOOR",
    tagline: "MEET THE ELEMENTS.",
    focus: "Environment & Exploration",
    description:
      "Layered mountain valleys beneath low clouds. Exploration and protection engineered for rapidly changing alpine environments.",
    accentColor: "#8ca4b0",
    heroImage: "/images/apex/campaign-outdoor-0.jpeg",
    keywords: ["Weather", "Discover", "Expedition", "Alpine"],
  },
};
