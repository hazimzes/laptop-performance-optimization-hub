// Video guide per section: verified YouTube embed when a good tutorial exists,
// otherwise an animated settings click-path demo. Video IDs verified via
// YouTube oembed (HTTP 200 + playability OK) at curation time, 2026-10-13.

export type VideoEntry =
  | { videoId: string; title: string; channel: string }
  | { path: string[] };

const V = (videoId: string, title: string, channel: string): VideoEntry => ({ videoId, title, channel });

const videos: Record<string, VideoEntry> = {
  firstboot: V("MBCiMK4AmEI", "How to Setup Windows PROPERLY", "Linus Tech Tips"),
  debloat: V("_Wep0VVzBGU", "How I Make Windows 11 ACTUALLY Usable (Debloat + Remove AI)", "Salem Techsperts"),
  updates: V("pJFvqaIa-38", "New PC Setup: Windows Install, BIOS & Drivers", "ExplainingComputers"),
  startup: V("8zOuscQixeU", "How to Disable Startup Apps in Windows (and What to Disable?)", "Brett In Tech"),
  privacy: V("QpXLHgyelrg", "10 Things You Should Turn Off in Windows Right Now", "The Grumpy Sysadmin"),
  power: V("XnCkjQ9snww", "How To Improve Battery Life on Windows 11", "Aldo James"),
  storage: V("kg055pAz9xA", "5 WAYS to FREE UP STORAGE in Windows 10 & 11 (Upto 100+ GB)", "Jamie Ye Online"),
  security: V("qp5ithV4IIA", "Windows 11: Enable BitLocker drive encryption", "Pureinfotech"),
  browser: V("vSzY9wXOhkw", "12 Chrome Browser Settings You Should Change!", "Brett In Tech"),
  input: V("dTLzx4xDFqw", "Windows 11 Trackpad Gestures, Tips & Tricks", "Aldo James"),
  display: V("dJaD_yob9v0", "Display Settings - Windows 11 Tip of the Day", "Kaceli TechTraining"),
  winget: V("UASz0VPQEx4", "The Best Windows Feature You're Not Using", "Techquickie"),
  onedrive: V("njJr751_tP4", "How to Use Microsoft OneDrive: Complete Tutorial for Beginners", "Kevin Stratvert"),
  gpu: V("QoJPcZzSdE4", "How to FORCE Windows to use your Dedicated GPU", "Practical Tech Fixes"),
  gaming: V("3T_-Fskfk9o", "Windows Settings to Change for Gaming", "Techquickie"),
  hdr: V("g3e61LsoXAE", "How To Configure HDR In Windows 11", "PCWorld"),
  peripherals: V("J-svRK-ks_o", "Mouse & Keyboard Settings That Actually Make You Better Fast & EASY!", "Akryl1kz"),
  color: V("F3KV186yxIE", "How to Color Calibrate Your Display in Windows 11", "PrimeGuide"),
  terminal: V("VT2L1SXFq9U", "How to make the ultimate Terminal Prompt on Windows 11", "Scott Hanselman"),
  wsl: V("zZf4YH4WiZo", "How to install Linux on Windows 11 with WSL for Beginners", "Devtamin"),
  docker: V("2ezNqqaSjq8", "Docker Complete Setup on Windows (With WSL Ubuntu)", "The Codeholic"),
  memory: V("zt7sSPhN7UA", "How to install memory in a laptop PC", "Kingston Technology"),
  backup: V("yIe4r6mBxz8", "How to backup your computer the 3 2 1 way!", "Liron Segev"),
  maintenance: V("JL3wT4DoXU4", "Top 5 Ways to Make Your Gaming Laptop Last Longer!", "Jarrod'sTech"),
  benchmark: V("DiNX32KNYFM", "How To Run Benchmark Test On A Laptop", "Gizmo Rush"),
};

// Section id -> topic. Several sections share a topic video.
const sectionTopics: Record<string, string> = {
  "f-firstboot": "firstboot",
  "f-debloat": "debloat",
  "f-updates": "updates",
  "f-startup": "startup",
  "f-privacy": "privacy",
  "f-power": "power",
  "f-storage": "storage",
  "f-security": "security",
  "e-browser": "browser",
  "e-input": "input",
  "e-visual": "debloat",
  "e-display": "display",
  "e-apps": "winget",
  "e-cloud": "onedrive",
  "g-gpu": "gpu",
  "g-thermal": "power",
  "g-windows": "gaming",
  "g-display": "hdr",
  "g-launchers": "storage",
  "g-peripherals": "peripherals",
  "c-color": "color",
  "c-gpu": "gpu",
  "c-scratch": "storage",
  "c-power": "power",
  "c-backup": "backup",
  "a-terminal": "terminal",
  "a-wsl": "wsl",
  "a-gpu": "gpu",
  "a-docker": "docker",
  "a-editor": "terminal",
  "a-memory": "memory",
  "a-security": "security",
  "v-health": "maintenance",
  "v-benchmark": "benchmark",
  "v-routine": "maintenance",
};

// Sections with no matching topic get an animated click-path demo instead.
const demos: Record<string, VideoEntry> = {
  "c-fonts": {
    path: ["Settings", "Personalization", "Fonts", "Drag font file to install", "Related settings: Adjust ClearType text"],
  },
};

export const sectionVideo: Record<string, VideoEntry> = Object.fromEntries(
  Object.entries(sectionTopics).map(([section, topic]) => [section, videos[topic]]),
);

for (const [section, demo] of Object.entries(demos)) {
  sectionVideo[section] = demo;
}
