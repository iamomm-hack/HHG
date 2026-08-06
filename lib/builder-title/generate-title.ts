import type { BuilderDetails } from "@/types/builder";

const stackTitles: Record<string, string[]> = {
  soroban: ["Soroban Sage", "Contract Systems Builder", "Soroban Protocol Crafter"],
  stellar: ["Stellar Protocol Builder", "Open Network Navigator", "Stellar Systems Crafter"],
  rust: ["Rust Systems Alchemist", "Memory-Safe Maker", "Rust Runtime Builder"],
  react: ["Interface Architect", "React Product Crafter", "Frontend Systems Builder"],
  "next.js": ["Full-Stack Voyager", "Web Systems Builder", "Product Stack Architect"],
  typescript: ["Typed Systems Crafter", "Type-Safe Builder", "Developer Experience Crafter"],
  solidity: ["Smart Contract Architect", "EVM Protocol Builder", "Onchain Systems Crafter"],
  move: ["Move Protocol Builder", "Asset Systems Architect", "Chain Logic Crafter"],
  ai: ["AI Product Explorer", "Intelligence Systems Builder", "Applied AI Crafter"],
  backend: ["Backend Systems Builder", "Service Architecture Crafter", "Systems Navigator"],
  "full stack": ["Full-Stack Voyager", "Product Engineering Maverick", "End-to-End Builder"],
  mobile: ["Mobile Experience Crafter", "Pocket Product Builder", "Mobile Systems Explorer"],
  design: ["Interface Architect", "Product Experience Crafter", "Design Systems Builder"],
  devrel: ["Developer Experience Crafter", "Ecosystem Signal Builder", "Community Systems Guide"],
  "open source": ["Open-Source Hero", "Commons Code Builder", "Open Systems Contributor"],
  infrastructure: ["Infrastructure Navigator", "Platform Systems Builder", "Reliability Architect"],
};
const roleTitles: Record<string, string[]> = {
  designer: ["Interface Architect", "Product Experience Crafter", "Systems Designer"],
  founder: ["Venture Builder", "Zero-to-One Operator", "Product Pathfinder"],
  researcher: ["Frontier Researcher", "Systems Explorer", "Protocol Investigator"],
  student: ["Next-Gen Builder", "Curious Systems Maker", "Learning-by-Shipping"],
  "community builder": ["Ecosystem Catalyst", "Community Systems Builder", "Network Steward"],
  "protocol engineer": ["Protocol Architect", "Consensus Systems Builder", "Network Engineer"],
  "smart contract developer": ["Smart Contract Architect", "Onchain Logic Builder", "Protocol Crafter"],
};
const fallbacks = ["Product Systems Builder", "Shipping-First Maker", "Applied Technology Builder", "Independent Product Crafter", "Systems Explorer"];

export function stableHash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function generateTitle(details: BuilderDetails, reroll = 0) {
  const role = details.role.toLowerCase();
  const pools = details.stack.map((s) => stackTitles[s.toLowerCase()]).filter(Boolean);
  const combined = [...new Set([...(pools.flat()), ...(roleTitles[role] ?? []), ...fallbacks])];
  return combined[(stableHash(`${details.name}|${role}|${details.stack.join("|")}`) + reroll * 7) % combined.length];
}

export function builderNumber(name: string, seed: string) {
  return `#${String(stableHash(`${seed}:${name || "builder"}`) % 10000).padStart(4, "0")}`;
}
