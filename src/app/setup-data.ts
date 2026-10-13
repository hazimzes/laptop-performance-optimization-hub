export type Profile = "Everyday" | "Gaming" | "Creator" | "AI / Dev";
export type Impact = "Essential" | "Recommended" | "Optional";

export type Step = { label: string; detail: string };

export type Task = {
  id: string;
  title: string;
  description: string;
  time: string;
  impact: Impact;
  why: string;
  steps: Step[];
  macos?: string;
  tools?: string[];
  caution?: string;
};

export type Phase = {
  key: string;
  label: string;
  title: string;
  description: string;
  tasks: Task[];
};

export const profiles: { name: Profile; caption: string; icon: string }[] = [
  { name: "Everyday", caption: "School, office, browsing", icon: "◎" },
  { name: "Gaming", caption: "Frames, thermals, input", icon: "◈" },
  { name: "Creator", caption: "Photo, video, design", icon: "◒" },
  { name: "AI / Dev", caption: "Code, containers, local AI", icon: "⌘" },
];

const foundation: Task[] = [
  {
    id: "f-firstboot",
    title: "First boot: get through Windows setup cleanly",
    description: "The setup screens are full of upsells and data-sharing defaults. Choose deliberately so there is less to undo later.",
    time: "15 min",
    impact: "Essential",
    why: "Choices made during first setup (privacy toggles, OneDrive folder backup, trials) are tedious to reverse later. Ten careful minutes here saves a cleanup session.",
    steps: [
      { label: "Plug in the charger and connect to Wi-Fi", detail: "Setup downloads updates while it runs, and some laptops apply firmware on first boot only when on AC power." },
      { label: "Sign in with your Microsoft account", detail: "Most Windows 11 editions require one during setup. It backs up your device-encryption recovery key and enables Find My Device." },
      { label: "Switch off optional privacy toggles", detail: "On 'Choose privacy settings': keep Find my device on; turn off optional diagnostic data, inking & typing, tailored experiences and advertising ID. Location is up to you." },
      { label: "Decline the upsells you don't want", detail: "Skip the Microsoft 365 trial, PC Game Pass and 'Customize your experience' screens. On 'Back up your files with OneDrive', pick 'Only save files to this PC' unless you want automatic folder backup." },
      { label: "Confirm the specs match your order", detail: "Settings → System → About: check CPU, installed RAM and Windows edition. Settings → System → Storage → Advanced storage settings → Disks & volumes shows SSD size." },
      { label: "Give the PC a clear name", detail: "Settings → System → About → Rename this PC (e.g. alex-zenbook). It makes Bluetooth, network and backup lists readable." },
    ],
    macos: "In Setup Assistant, decline 'Share Mac Analytics', set up Touch ID, and turn on FileVault when asked. Check Apple menu → About This Mac for chip, memory and storage.",
  },
  {
    id: "f-debloat",
    title: "Remove pre-installed bloat",
    description: "New laptops ship with trials, promo apps and duplicate utilities that run in the background from day one.",
    time: "10 min",
    impact: "Essential",
    why: "Vendor trialware (antivirus trials, 'PC optimizer' tools, bundled games) uses RAM, adds startup entries and nags with pop-ups. Removing it is the biggest first-day cleanup.",
    steps: [
      { label: "Open Settings → Apps → Installed apps", detail: "Sort by date installed. Everything dated the same day as the factory image is a candidate to review." },
      { label: "Uninstall antivirus trials", detail: "McAfee or Norton trials duplicate Windows Security and nag constantly. If remnants remain after uninstalling, use the vendor removal tool (McAfee MCPR, Norton Remove and Reinstall)." },
      { label: "Remove promos, games and 'optimizer' utilities", detail: "Keep the OEM support app (Lenovo Vantage, MyASUS, Dell SupportAssist, HP Support Assistant) because it delivers BIOS updates. Remove booking, shopping, VPN promos and casual games." },
      { label: "Clean the Start menu", detail: "Right-click pinned promo icons in Start → Uninstall. Many are install stubs that download the app the first time you click them." },
      { label: "Restart and recheck", detail: "After a restart, Task Manager → Processes should list noticeably fewer background apps." },
    ],
    macos: "Macs ship without OEM bloat. Check System Settings → General → Login Items & Extensions for agents added by trial apps you installed.",
    tools: ["Win11Debloat (open-source)", "Revo Uninstaller", "Vendor removal tools"],
    caution: "Don't remove Realtek audio, Intel/AMD/NVIDIA graphics control panels, or the OEM firmware updater. They are drivers, not bloat.",
  },
  {
    id: "f-updates",
    title: "Update firmware, drivers and Windows, in that order",
    description: "Factory images are usually months old. Do BIOS and firmware first, then drivers, then Windows Update.",
    time: "25 min",
    impact: "Essential",
    why: "Early BIOS versions often have fan-curve, battery and sleep bugs. GPU drivers from the chip vendor are usually newer and faster than the copy in the factory image.",
    steps: [
      { label: "Stay plugged in for the whole task", detail: "Firmware updaters refuse to run on battery, and a power loss mid-flash can brick the board." },
      { label: "Apply BIOS and firmware updates via the OEM app", detail: "Lenovo Vantage, MyASUS, Dell SupportAssist or HP Support Assistant. Install BIOS, embedded controller, Thunderbolt and SSD firmware updates, then reboot." },
      { label: "Install chipset and GPU drivers from the source", detail: "Intel: Driver & Support Assistant. AMD: Adrenalin (auto-detect). NVIDIA: the NVIDIA app. Choose 'clean install' where offered." },
      { label: "Run Windows Update until it is empty", detail: "Settings → Windows Update → Check for updates. Under Advanced options, turn on 'Receive updates for other Microsoft products'. Reboot and repeat until nothing is left." },
      { label: "Review optional driver updates", detail: "Windows Update → Advanced options → Optional updates. Install Wi-Fi, Bluetooth and audio drivers listed there, but skip anything older than what you already have." },
    ],
    macos: "System Settings → General → Software Update. Turn on automatic updates and security responses; Mac firmware ships inside macOS updates.",
    tools: ["OEM support app", "Intel DSA", "AMD Adrenalin", "NVIDIA app"],
  },
  {
    id: "f-startup",
    title: "Cut startup and background apps",
    description: "Decide what runs at sign-in, and stop apps from waking up in the background.",
    time: "8 min",
    impact: "Essential",
    why: "Each startup entry adds boot time and holds RAM for the whole session. Background permissions let closed apps keep polling and syncing.",
    steps: [
      { label: "Task Manager → Startup apps", detail: "Press Ctrl+Shift+Esc and sort by 'Startup impact'. Disable launchers (Steam, Epic, Discord, Spotify, Teams) and updaters (Adobe, Java)." },
      { label: "Keep the essentials enabled", detail: "Windows Security, touchpad and audio utilities, your password manager and the OEM power manager should stay on." },
      { label: "Limit background activity for Store apps", detail: "Settings → Apps → Installed apps → ⋯ → Advanced options → 'Let this app run in background' → Never, for apps you only open occasionally." },
      { label: "Stop browser and chat auto-launch", detail: "Turn off 'Startup boost' in Edge (Settings → System and performance) if you use another browser, and disable 'Open at login' inside Teams, Slack or Discord." },
    ],
    macos: "System Settings → General → Login Items & Extensions. Remove entries under 'Open at Login' and review 'Allow in the Background'.",
    tools: ["Task Manager", "Autoruns (Sysinternals, advanced)"],
  },
  {
    id: "f-privacy",
    title: "Turn off telemetry, ads and suggestions",
    description: "Windows enables an advertising ID, suggested content and optional diagnostics by default.",
    time: "7 min",
    impact: "Recommended",
    why: "Fewer background services, a cleaner Start menu and lock screen, and less data leaving your machine.",
    steps: [
      { label: "Privacy & security → General", detail: "Switch off all four toggles: advertising ID, website language access, app launch tracking, and suggested content in Settings." },
      { label: "Privacy & security → Diagnostics & feedback", detail: "Turn off 'Send optional diagnostic data' and 'Tailored experiences', and set Feedback frequency to Never." },
      { label: "Personalization → Start and Lock screen", detail: "Disable 'Show recommendations for tips, shortcuts, new apps'. On Lock screen, untick 'Get fun facts, tips, tricks, and more'." },
      { label: "System → Notifications → Additional settings", detail: "Untick 'Show the Windows welcome experience', 'Suggest ways to get the most out of Windows' and 'Get tips and suggestions'." },
      { label: "Privacy & security → Search permissions", detail: "Turn off 'Show search highlights', and cloud content search if you don't need it." },
    ],
    macos: "System Settings → Privacy & Security → Analytics & Improvements: turn sharing off. Apple Advertising: turn off Personalized Ads.",
    tools: ["O&O ShutUp10++ (reversible, one place for all toggles)"],
  },
  {
    id: "f-power",
    title: "Set power modes and a battery charge limit",
    description: "Use different modes on battery and when plugged in, and protect long-term battery health.",
    time: "6 min",
    impact: "Essential",
    why: "'Best performance' on battery drains it with little visible gain, while 'Balanced' when plugged in leaves CPU boost unused. A charge limit slows battery wear dramatically if you're usually at a desk.",
    steps: [
      { label: "Settings → System → Power & battery", detail: "Power mode: Balanced on battery, Best performance when plugged in. Screen off after 5 min on battery and 15 min plugged in." },
      { label: "Enable a charge limit if you mostly work plugged in", detail: "Lenovo Vantage: Conservation mode. MyASUS: Battery Health Charging. Dell: Primarily AC use. HP: Battery Health Manager. Samsung: Battery protection. Caps charge around 80%." },
      { label: "Learn the OEM performance profile", detail: "OEM apps offer Quiet / Balanced / Performance fan-and-power modes, often Fn+Q on Lenovo and Fn+F5 on ASUS ROG/TUF. Use Balanced day-to-day." },
      { label: "Set the Energy Saver threshold", detail: "Power & battery → Energy saver: turn on automatically at 20–30% so brightness and background work ramp down." },
    ],
    macos: "System Settings → Battery: turn on Optimized Battery Charging and set Low Power Mode to 'Only on Battery'.",
    caution: "Skip the 'Ultimate Performance' power plan on laptops. It blocks CPU idle states and raises heat and fan noise for negligible gain.",
  },
  {
    id: "f-storage",
    title: "Set up storage hygiene",
    description: "Keep the SSD under ~80% full and let Windows clean up automatically.",
    time: "5 min",
    impact: "Recommended",
    why: "SSD write speed drops when the drive is nearly full. Old update files and previous Windows installs can silently take 20+ GB.",
    steps: [
      { label: "Turn on Storage Sense", detail: "Settings → System → Storage → Storage Sense: run during low free disk space and empty the Recycle Bin after 30 days. Only auto-clean Downloads if you're comfortable with it." },
      { label: "Run cleanup recommendations", detail: "Storage → Cleanup recommendations: remove temporary files and the previous Windows installation once updates are stable." },
      { label: "Confirm TRIM is enabled", detail: "In an admin Terminal run `fsutil behavior query DisableDeleteNotify`. A result of 0 means TRIM is on. 'Defragment and Optimize Drives' should show 'Solid state drive' on a weekly schedule." },
      { label: "Move bulky folders if you have a second drive", detail: "Right-click Videos or Downloads → Properties → Location → Move to put them on the larger drive." },
    ],
    macos: "System Settings → General → Storage: enable 'Empty Trash Automatically' and review the largest categories.",
    tools: ["Storage Sense", "WizTree (visual disk usage)"],
  },
  {
    id: "f-security",
    title: "Security baseline: encryption, backups, 2FA",
    description: "Ten minutes now covers the two disasters that actually happen: theft and drive failure.",
    time: "10 min",
    impact: "Essential",
    why: "Encryption turns a stolen laptop into a brick instead of a data leak. A tested backup is the only real protection against ransomware or a dead SSD.",
    steps: [
      { label: "Turn on device encryption", detail: "Settings → Privacy & security → Device encryption (BitLocker on Pro). Confirm the recovery key appears at account.microsoft.com/devices/recoverykey and keep an offline copy." },
      { label: "Check Windows Security", detail: "All tiles should be green. Turn on Device security → Core isolation → Memory integrity, and consider Ransomware protection → Controlled folder access." },
      { label: "Set up a password manager and 2FA", detail: "Bitwarden or 1Password. Enable two-factor authentication on your Microsoft, Google, Apple and email accounts first." },
      { label: "Set up backup", detail: "Use the Windows Backup app (OneDrive folders) or File History (Control Panel) to an external drive. Back up Desktop, Documents and Pictures at minimum." },
      { label: "Create a restore point", detail: "Search 'Create a restore point' → Configure → turn on protection for C: → Create. Do this before driver experiments." },
    ],
    macos: "Turn on FileVault and the Firewall (Privacy & Security / Network), and set up Time Machine to an external drive.",
    caution: "Memory integrity can block old unsigned drivers, and Controlled folder access can stop apps from saving to Documents. Both show a list of what they blocked so you can allow it.",
  },
];

const everyday: Task[] = [
  {
    id: "e-browser",
    title: "Set up a fast browser with sane defaults",
    description: "The browser is where most laptops spend their time, RAM and battery.",
    time: "8 min",
    impact: "Essential",
    why: "Tab sleeping, a content blocker and hardware acceleration cut CPU use and battery drain more than any system tweak.",
    steps: [
      { label: "Pick one browser and make it the default", detail: "Settings → Apps → Default apps → choose the browser → Set default. Edge is efficient on Windows; Chrome, Firefox and Brave are fine too." },
      { label: "Turn on tab sleeping", detail: "Edge: Settings → System and performance → sleeping tabs after 5 min. Chrome: Settings → Performance → Memory Saver. Firefox unloads tabs automatically under memory pressure." },
      { label: "Install a content blocker", detail: "uBlock Origin on Firefox, or uBlock Origin Lite on Chrome/Edge. Blocking ads and trackers noticeably reduces page CPU work on ad-heavy sites." },
      { label: "Confirm hardware acceleration and efficiency mode", detail: "Settings → System → 'Use graphics acceleration when available' on. In Edge, enable Efficiency mode for battery." },
      { label: "Keep extensions to a minimum", detail: "Aim for 3–5. Every extension can inject scripts into every page you open." },
    ],
    tools: ["uBlock Origin / Lite", "Bitwarden extension"],
  },
  {
    id: "e-input",
    title: "Set up gestures, Snap layouts and sign-in",
    description: "The small daily-use settings that make a laptop feel fast to use, not just fast to benchmark.",
    time: "5 min",
    impact: "Recommended",
    why: "Gestures, window snapping and clipboard history save hundreds of small actions a day. Windows Hello makes unlocking instant.",
    steps: [
      { label: "Touchpad settings", detail: "Settings → Bluetooth & devices → Touchpad: tap to click, scroll direction, and three-finger swipes for switching apps and desktops." },
      { label: "Clipboard history", detail: "Press Win+V and turn it on. It keeps the last 25 copied items and can pin frequently used text." },
      { label: "Snap layouts", detail: "Settings → System → Multitasking → Snap windows on. Hover the maximize button or press Win+Z to pick a layout." },
      { label: "Windows Hello", detail: "Settings → Accounts → Sign-in options: set up fingerprint or face recognition if your laptop has the hardware." },
      { label: "Do Not Disturb schedule", detail: "System → Notifications → Turn on do not disturb automatically, e.g. during set hours or when duplicating your display for presentations." },
    ],
    macos: "System Settings → Trackpad (tap to click, gestures), Desktop & Dock (window tiling), Touch ID & Password, and Focus.",
  },
  {
    id: "e-visual",
    title: "Trim visual effects and taskbar clutter",
    description: "Snappier windows on lower-end or integrated-graphics machines.",
    time: "4 min",
    impact: "Recommended",
    why: "Transparency and animations cost GPU time and can make the UI feel laggy on budget hardware. Widgets runs a background web process.",
    steps: [
      { label: "Accessibility → Visual effects", detail: "Turn off Transparency effects. Optionally turn off Animation effects for an instant-feeling UI." },
      { label: "Adjust performance options", detail: "Search 'Adjust the appearance and performance of Windows'. Choose Custom and keep only 'Smooth edges of screen fonts' and 'Show thumbnails instead of icons'." },
      { label: "Taskbar cleanup", detail: "Personalization → Taskbar: turn off Widgets and Task view, and set Search to icon only. Press the Windows key to search." },
    ],
    macos: "Accessibility → Display: turn on 'Reduce motion' and 'Reduce transparency'.",
  },
  {
    id: "e-display",
    title: "Set display scaling, refresh rate and night light",
    description: "Comfortable text, plus a refresh rate that matches the panel you paid for.",
    time: "4 min",
    impact: "Recommended",
    why: "Many laptops ship at a scale that's too large and at 60 Hz even on 90/120 Hz panels.",
    steps: [
      { label: "Set the scale", detail: "Settings → System → Display → Scale. Around 125% on 14\" 1080p and 150% on 13–14\" 1440p+ is typical. Sign out after changing it." },
      { label: "Choose the refresh rate", detail: "Display → Advanced display → Choose a refresh rate. Pick the highest, or 'Dynamic' if offered, which saves battery when content is static." },
      { label: "Schedule Night light", detail: "Display → Night light: sunset to sunrise at 40–50% strength." },
      { label: "Fix blurry apps", detail: "Display → Scale → turn on 'Let Windows try to fix apps so they're not blurry'." },
    ],
  },
  {
    id: "e-apps",
    title: "Install your essentials in one go with winget",
    description: "One command installs everything from official sources, with no bundled offers.",
    time: "10 min",
    impact: "Recommended",
    why: "winget pulls official installers, avoids adware-laden download sites, and updates everything with a single command.",
    steps: [
      { label: "Open Terminal as admin", detail: "Right-click Start → Terminal (Admin). winget is built into Windows 11." },
      { label: "Install a bundle", detail: "Adjust to taste: `winget install 7zip.7zip VideoLAN.VLC Bitwarden.Bitwarden Microsoft.PowerToys Notepad++.Notepad++`" },
      { label: "Update everything later", detail: "`winget upgrade --all` updates every app winget knows about." },
      { label: "Turn on the useful PowerToys", detail: "FancyZones (window layouts), PowerToys Run (Alt+Space launcher), Awake (keep-awake toggle) and Text Extractor (copy text from any image)." },
    ],
    macos: "Install Homebrew, then `brew install --cask` for apps. `brew upgrade` updates them all.",
    tools: ["winget", "PowerToys", "7-Zip", "VLC"],
  },
  {
    id: "e-cloud",
    title: "Decide what OneDrive syncs",
    description: "Choose which folders live in the cloud instead of letting OneDrive take over Desktop and Documents.",
    time: "5 min",
    impact: "Optional",
    why: "Automatic folder backup surprises people with constant uploads and 'file in use' errors, but selective sync is a great free backup.",
    steps: [
      { label: "OneDrive icon → Settings → Sync and backup", detail: "Manage backup: pick only the folders you want backed up. Turn off screenshot saving to OneDrive if you don't need it." },
      { label: "Turn on Files On-Demand", detail: "Sync and backup → Advanced settings. Cloud files stay as placeholders until opened, saving SSD space." },
      { label: "Limit bandwidth on slow connections", detail: "Sync and backup → Advanced settings → limit upload and download rates." },
    ],
    macos: "System Settings → Apple Account → iCloud → Drive: enable 'Desktop & Documents Folders' only if you want it, and turn on 'Optimize Mac Storage'.",
  },
];

const gaming: Task[] = [
  {
    id: "g-gpu",
    title: "Route games to the dedicated GPU",
    description: "Hybrid laptops sometimes run games on the integrated GPU. Force the right one.",
    time: "8 min",
    impact: "Essential",
    why: "A game silently running on integrated graphics can lose most of its frame rate. The fix is a per-app setting or a MUX switch.",
    steps: [
      { label: "Per-app GPU preference", detail: "Settings → System → Display → Graphics: add each game's .exe → Options → High performance." },
      { label: "Use the MUX switch if your laptop has one", detail: "Armoury Crate: GPU mode 'Ultimate'. Lenovo Vantage / Legion Space: turn Hybrid mode off. Alienware Command Center and others have similar toggles. Requires a reboot; switch back to Hybrid for battery life." },
      { label: "Install the gaming driver branch", detail: "NVIDIA Game Ready (not Studio) via the NVIDIA app, or AMD Adrenalin Recommended. Do a clean install." },
      { label: "Turn on GPU scheduling and windowed optimizations", detail: "Display → Graphics → Advanced graphics settings: Hardware-accelerated GPU scheduling on, Optimizations for windowed games on. Reboot." },
    ],
    tools: ["NVIDIA app", "AMD Adrenalin", "OEM control center"],
  },
  {
    id: "g-thermal",
    title: "Tune thermals and power for steady frames",
    description: "Every laptop throttles eventually. Aim for consistent clocks, not a 10-second peak.",
    time: "10 min",
    impact: "Essential",
    why: "A thin laptop at 95 °C drops clocks and frame pacing turns stuttery. A frame cap or mild undervolt often plays smoother than maxed settings.",
    steps: [
      { label: "Game plugged in, on the original charger", detail: "Most laptops cut GPU power heavily on battery. Under-rated USB-C chargers also cause throttling." },
      { label: "Switch the OEM mode to Performance or Turbo", detail: "Raises CPU/GPU power limits and the fan curve. Switch back to Balanced afterwards." },
      { label: "Cap your frame rate", detail: "NVIDIA app → Graphics → Max Frame Rate, or AMD Radeon Chill. Capping a few fps below refresh (e.g. 141 on 144 Hz) gives smoother, cooler play." },
      { label: "Watch temperatures", detail: "HWiNFO64 in sensors-only mode. A CPU sitting above ~95 °C or GPU above ~87 °C means thermal throttling. Raise the rear of the laptop or use a cooling pad." },
      { label: "Optional: undervolt", detail: "Use the OEM app, ThrottleStop (Intel, if the BIOS allows) or Curve Optimizer (AMD). Start small (−25 to −50 mV) and stress test." },
    ],
    tools: ["HWiNFO64", "MSI Afterburner + RTSS", "ThrottleStop"],
    caution: "Undervolting is reversible, but pushing too far causes crashes. Many recent BIOSes lock it, so don't fight the lock.",
  },
  {
    id: "g-windows",
    title: "Set Windows gaming options",
    description: "Game Mode, overlays, and the notifications that interrupt at the worst moment.",
    time: "6 min",
    impact: "Recommended",
    why: "Game Mode prioritizes the game and holds back Windows Update installs. Every overlay and background recorder costs a little GPU time.",
    steps: [
      { label: "Settings → Gaming → Game Mode on", detail: "Under Gaming → Captures, turn off background recording ('Record what happened') unless you clip often." },
      { label: "Keep a single overlay", detail: "Choose one of NVIDIA/AMD, Steam or Discord and disable the rest. Turn off Xbox Game Bar if you don't use it." },
      { label: "Silence notifications while playing", detail: "System → Notifications → turn on do not disturb automatically 'When playing a game'." },
      { label: "Set Windows Update active hours", detail: "Windows Update → Advanced options → Active hours covering your usual play time." },
      { label: "Leave the page file system-managed", detail: "Disabling it causes crashes in games that allocate aggressively, especially on 16 GB RAM or less." },
    ],
  },
  {
    id: "g-display",
    title: "Set refresh rate, VRR and HDR",
    description: "Make sure the panel actually runs at its advertised speed.",
    time: "4 min",
    impact: "Essential",
    why: "A 144/165 Hz panel left at 60 Hz is the most common missed setting on gaming laptops.",
    steps: [
      { label: "Set the maximum refresh rate", detail: "Display → Advanced display → Choose a refresh rate. In Hybrid mode the panel may be wired to the iGPU, and VRR can require Ultimate/discrete mode." },
      { label: "Enable G-SYNC or FreeSync", detail: "NVIDIA Control Panel → Set up G-SYNC → enable for full screen and windowed. AMD: Adrenalin → Gaming → Display → FreeSync on." },
      { label: "Use VRR with a frame cap", detail: "With VRR on, cap fps just under refresh and turn in-game V-Sync off for the smoothest low-latency result." },
      { label: "HDR, if the panel supports it", detail: "Display → Use HDR, then calibrate with the Windows HDR Calibration app from the Microsoft Store. Auto HDR upgrades many SDR games." },
    ],
  },
  {
    id: "g-launchers",
    title: "Tame launchers, shader caches and game storage",
    description: "Keep launchers out of startup and give shader caches enough room.",
    time: "6 min",
    impact: "Recommended",
    why: "Launchers updating at boot slow everything down. A small shader cache means recompiling shaders every session, which causes stutter.",
    steps: [
      { label: "Disable launcher autostart", detail: "Steam → Settings → Interface → untick 'Run Steam when my computer starts'. Do the same in Epic, EA app, Ubisoft Connect and Battle.net." },
      { label: "Raise the NVIDIA shader cache", detail: "NVIDIA Control Panel → Manage 3D settings → Shader Cache Size → 10 GB or more." },
      { label: "Steam download settings", detail: "Settings → Downloads: untick 'Allow downloads during gameplay' and keep Shader Pre-Caching enabled." },
      { label: "Install games on your fastest SSD", detail: "Keep 15%+ free on the game drive. Avoid external hard drives for open-world games." },
    ],
  },
  {
    id: "g-peripherals",
    title: "Set up mouse, keyboard and audio",
    description: "Remove input smoothing and audio processing you didn't ask for.",
    time: "4 min",
    impact: "Optional",
    why: "Pointer acceleration breaks aiming muscle memory. Audio 'enhancements' can add latency and distort positional sound.",
    steps: [
      { label: "Disable pointer acceleration", detail: "Settings → Bluetooth & devices → Mouse → Additional mouse settings → Pointer Options: untick 'Enhance pointer precision'." },
      { label: "Set a sensible polling rate", detail: "1000 Hz in your mouse software. Higher rates add CPU load for little benefit on laptops." },
      { label: "Turn off audio enhancements", detail: "System → Sound → your output device: Audio enhancements off, format 24-bit 48000 Hz." },
      { label: "Speed up key repeat", detail: "Control Panel → Keyboard: shortest repeat delay, fastest repeat rate." },
    ],
  },
];

const creator: Task[] = [
  {
    id: "c-color",
    title: "Make the display color-trustworthy",
    description: "Trust what you see before you edit it.",
    time: "10 min",
    impact: "Essential",
    why: "'Vivid' presets oversaturate, and adaptive brightness and contrast shift tones while you work. A proper color mode and fixed brightness are the baseline.",
    steps: [
      { label: "Disable adaptive brightness and contrast", detail: "System → Display → Brightness: turn off automatic brightness and 'change brightness based on content'." },
      { label: "Pick a color mode in the OEM app", detail: "sRGB for web and photo, Display P3 / DCI-P3 for video. Avoid 'Vivid' and 'Game' modes." },
      { label: "Load the right color profile", detail: "Settings → System → Display → Color profile. Use the maker's profile if listed, or calibrate with a colorimeter." },
      { label: "Keep Night light off while editing", detail: "Toggle it from Quick Settings when color matters, or remove the schedule." },
      { label: "Fix brightness for print work", detail: "Around 120 nits (roughly 40–60% on most panels), and keep it consistent between sessions." },
    ],
    macos: "System Settings → Displays → Preset: 'Photography (P3-D65)' or 'Internet & Web (sRGB)'. Turn off True Tone and auto-brightness while editing.",
    tools: ["Calibrite / Datacolor colorimeter", "DisplayCAL"],
  },
  {
    id: "c-gpu",
    title: "Set up the Studio driver and GPU acceleration",
    description: "Creative apps have their own driver branch and need GPU acceleration switched on.",
    time: "8 min",
    impact: "Essential",
    why: "NVIDIA Studio drivers are validated against Premiere, Resolve, Blender and Photoshop. Apps also need to use the dedicated GPU for effects and exports.",
    steps: [
      { label: "Install the Studio driver", detail: "NVIDIA app → Drivers → switch to Studio, clean install. AMD users: the current Adrenalin release." },
      { label: "Assign apps to the high-performance GPU", detail: "Display → Graphics: add Premiere, Resolve, Photoshop, Lightroom and Blender → High performance." },
      { label: "Enable acceleration inside each app", detail: "Premiere: Project Settings → Renderer → Mercury Playback Engine GPU (CUDA). Resolve: Preferences → Memory and GPU. Photoshop: Preferences → Performance → Use Graphics Processor." },
      { label: "Use hardware encoding for exports", detail: "Choose NVENC, AMD VCN or Intel Quick Sync for H.264/HEVC. Typically several times faster than CPU-only encoding." },
    ],
  },
  {
    id: "c-scratch",
    title: "Set scratch disks, caches and project storage",
    description: "Where caches live decides whether timelines play smoothly.",
    time: "8 min",
    impact: "Essential",
    why: "A media cache on a nearly-full system drive is a top cause of sluggish timelines and crashes.",
    steps: [
      { label: "Keep 20%+ of the SSD free", detail: "Creative caches grow by tens of gigabytes." },
      { label: "Point caches to your fastest roomy drive", detail: "Premiere: Preferences → Media Cache. Resolve: Project Settings → Master Settings → Working Folders. Photoshop: Preferences → Scratch Disks. Lightroom Classic: Preferences → Performance → Camera Raw Cache." },
      { label: "Set memory limits", detail: "Photoshop: Preferences → Performance → 70–75% RAM. After Effects: Memory & Performance → reserve 4–6 GB for other apps." },
      { label: "Use a project folder template", detail: "Project/01_Footage, 02_Audio, 03_Graphics, 04_Project, 05_Exports. A consistent structure makes relinking and backup trivial." },
      { label: "Use NVMe for external project drives", detail: "USB-C / Thunderbolt NVMe drives, not spinning disks, for active projects. Use exFAT only when sharing between Mac and Windows." },
    ],
  },
  {
    id: "c-power",
    title: "Performance mode for renders, quiet mode for editing",
    description: "Switch profiles on purpose instead of running the fans all day.",
    time: "4 min",
    impact: "Recommended",
    why: "Exports and renders benefit from the highest power profile; editing doesn't, and the fan noise is distracting.",
    steps: [
      { label: "Learn the OEM mode shortcut", detail: "Often Fn+Q on Lenovo or Fn+F5 on ASUS, or use the OEM app. Performance before an export, Balanced after." },
      { label: "Plugged-in power mode", detail: "System → Power & battery → Plugged in: Best performance." },
      { label: "Prevent sleep during long renders", detail: "PowerToys Awake, or temporarily set sleep when plugged in to Never." },
      { label: "Improve airflow", detail: "Raising the rear 2–3 cm on a stand lowers temperatures noticeably during sustained renders." },
    ],
  },
  {
    id: "c-backup",
    title: "Set up 3-2-1 backup for project work",
    description: "Three copies, on two kinds of storage, with one off-site.",
    time: "12 min",
    impact: "Essential",
    why: "Project files are irreplaceable. Cloud sync alone is not backup: a deleted or corrupted file syncs everywhere.",
    steps: [
      { label: "Copy 1: working files on the local SSD", detail: "Active projects live on your fastest drive." },
      { label: "Copy 2: external drive with versions", detail: "File History, or a nightly FreeFileSync job to an external drive. Keep 30+ days of versions." },
      { label: "Copy 3: off-site or cloud", detail: "Backblaze or a cloud drive for project files only. Exclude caches and renders." },
      { label: "Test a restore", detail: "Restore one project folder to a new location and open it. An untested backup is only a hope." },
    ],
    macos: "Time Machine to an external SSD plus Backblaze is the standard pairing.",
    tools: ["FreeFileSync", "Backblaze", "File History / Time Machine"],
  },
  {
    id: "c-fonts",
    title: "Tidy fonts, plugins and input devices",
    description: "Small things that cause slow app launches and laggy brushes.",
    time: "6 min",
    impact: "Optional",
    why: "Thousands of active fonts slow Adobe app launches. Tablets and audio interfaces need the right drivers for low latency.",
    steps: [
      { label: "Use a font manager", detail: "Activate font families per project (FontBase is free) and keep system-wide fonts lean." },
      { label: "Install the tablet driver from the vendor", detail: "Wacom, Huion or XP-Pen. If brushes lag, toggle Windows Ink in the driver and turn off press-and-hold right-click." },
      { label: "Use ASIO for audio work", detail: "Install the audio interface's ASIO driver and use a 128–256 sample buffer." },
      { label: "Remove old app versions and plugins", detail: "Creative Cloud → Apps → uninstall older versions, and delete plugins you no longer use." },
    ],
    tools: ["FontBase", "Wacom Center", "ASIO4ALL (if no native ASIO driver)"],
  },
];

const aidev: Task[] = [
  {
    id: "a-terminal",
    title: "Set up the terminal, package manager and shell",
    description: "A fast, scriptable command line is the base everything else installs through.",
    time: "15 min",
    impact: "Essential",
    why: "Installing tools via winget or Homebrew keeps them updatable and reproducible. A configured shell with a Git-aware prompt saves hours over a year.",
    steps: [
      { label: "Install PowerShell 7 and set it as default", detail: "`winget install Microsoft.PowerShell`, then Windows Terminal → Settings → Startup → Default profile: PowerShell." },
      { label: "Install core tools", detail: "`winget install Git.Git Microsoft.VisualStudioCode OpenJS.NodeJS.LTS Python.Python.3.12 GitHub.cli`" },
      { label: "Improve the shell", detail: "`winget install JanDeDobbeleer.OhMyPosh`, then `oh-my-posh font install` for a Nerd Font, and set that font in Terminal." },
      { label: "Enable Developer Mode and sudo", detail: "Settings → System → For developers (called Advanced on newer builds): Developer Mode on, and Enable sudo on Windows 11 24H2+." },
      { label: "Show file extensions and hidden files", detail: "File Explorer → View → Show → File name extensions and Hidden items. Avoids .env.txt surprises." },
    ],
    macos: "Run `xcode-select --install`, install Homebrew, then `brew install git node python gh`. Use iTerm2 or Ghostty with zsh and Starship.",
    tools: ["Windows Terminal", "winget", "Oh My Posh / Starship"],
  },
  {
    id: "a-wsl",
    title: "Set up WSL2 for a native Linux workflow",
    description: "Most ML and web tooling targets Linux. WSL2 gives you that at near-native speed.",
    time: "15 min",
    impact: "Essential",
    why: "Python wheels, CUDA toolkits, Docker and build scripts behave far more predictably under Ubuntu in WSL2 than natively on Windows.",
    steps: [
      { label: "Install WSL2 with Ubuntu", detail: "In an admin terminal: `wsl --install -d Ubuntu-24.04`. Reboot and create your Linux user." },
      { label: "Keep projects inside the Linux filesystem", detail: "Clone into `~/code`, not /mnt/c. Cross-filesystem access is several times slower. Open a project with `code .` from Ubuntu." },
      { label: "Tune memory in .wslconfig", detail: "Create `C:\\Users\\<you>\\.wslconfig` with a [wsl2] section: memory at about 60–75% of RAM (e.g. `memory=12GB`), `processors=8`, `swap=8GB`. Add `autoMemoryReclaim=gradual` under [experimental]. Run `wsl --shutdown` to apply." },
      { label: "Verify GPU passthrough", detail: "Run `nvidia-smi` inside Ubuntu. The Windows NVIDIA driver already covers WSL, so never install a Linux display driver inside WSL." },
      { label: "Share Git credentials with Windows", detail: "`git config --global credential.helper \"/mnt/c/Program\\ Files/Git/mingw64/bin/git-credential-manager.exe\"`" },
    ],
    macos: "Not needed: macOS is already Unix. Use OrbStack or Colima for lighter containers.",
    tools: ["WSL2", "Ubuntu 24.04", "VS Code WSL extension"],
    caution: "Virtualization features can cost a few percent in some games, and a handful of anti-cheat systems dislike them. If a game misbehaves, check that game's support page before disabling anything.",
  },
  {
    id: "a-gpu",
    title: "Set up the CUDA / ROCm stack for local AI",
    description: "Get PyTorch talking to your GPU without days of driver archaeology.",
    time: "20 min",
    impact: "Essential",
    why: "The most common failure is mismatched driver, CUDA and PyTorch versions. Installing PyTorch's bundled CUDA runtime through pip avoids most of it.",
    steps: [
      { label: "Install the latest NVIDIA driver on Windows", detail: "Run `nvidia-smi` and note the CUDA version shown. It must be at least the version your PyTorch build targets." },
      { label: "Create a per-project environment with uv", detail: "Install with `winget install astral-sh.uv` (or `curl -LsSf https://astral.sh/uv/install.sh | sh` in WSL), then `uv venv`." },
      { label: "Install PyTorch with CUDA", detail: "Copy the exact command from pytorch.org/get-started, for example `uv pip install torch --index-url https://download.pytorch.org/whl/cu128`." },
      { label: "Verify the GPU is visible", detail: "`python -c \"import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))\"` should print True and your GPU name." },
      { label: "Run local LLMs the easy way", detail: "Ollama (`winget install Ollama.Ollama`) or LM Studio handle quantization and GPU offload. Roughly 8 GB VRAM fits 7–8B models at 4-bit; 16 GB fits ~14B." },
      { label: "AMD or Intel GPU?", detail: "AMD: ROCm on Linux/WSL for supported cards, otherwise DirectML. Intel Arc: OpenVINO or IPEX. Expect fewer libraries to work out of the box." },
    ],
    macos: "Apple Silicon uses Metal through PyTorch MPS (`torch.backends.mps.is_available()`). Ollama and MLX run local models fast thanks to unified memory.",
    tools: ["uv", "Ollama", "LM Studio", "nvidia-smi"],
    caution: "Models and datasets are huge. Set `HF_HOME` and `OLLAMA_MODELS` to a roomy drive before downloading 40 GB into your user folder.",
  },
  {
    id: "a-docker",
    title: "Set up Docker with sane resource limits",
    description: "Containers are great until they quietly eat 20 GB of RAM and disk.",
    time: "8 min",
    impact: "Recommended",
    why: "Docker Desktop on WSL2 inherits the .wslconfig memory limits, and old image layers pile up for months unless pruned.",
    steps: [
      { label: "Install and connect to WSL", detail: "`winget install Docker.DockerDesktop`, then Settings → Resources → WSL integration → enable your Ubuntu distro." },
      { label: "Don't start Docker at login", detail: "Settings → General → untick 'Start Docker Desktop when you sign in'. Launch it when you need it." },
      { label: "Prune regularly", detail: "`docker system prune -a` monthly. Add `--volumes` only when you're sure no important data lives in volumes." },
      { label: "Test GPU access in containers", detail: "`docker run --rm -it --gpus=all nvcr.io/nvidia/k8s/cuda-sample:nbody nbody -gpu -benchmark`" },
    ],
    macos: "OrbStack is lighter than Docker Desktop, with faster file sharing and auto-pause when idle.",
  },
  {
    id: "a-editor",
    title: "Set up the editor, Git identity, SSH and a Dev Drive",
    description: "Set your identity once, authenticate once, and keep builds fast.",
    time: "12 min",
    impact: "Essential",
    why: "A configured Git identity and SSH keys remove daily friction. Antivirus scanning of repos is a hidden build-time tax that Dev Drive removes.",
    steps: [
      { label: "Git identity and defaults", detail: "`git config --global user.name \"Your Name\"`, `git config --global user.email you@example.com`, `git config --global init.defaultBranch main`" },
      { label: "Create an SSH key", detail: "`ssh-keygen -t ed25519 -C \"you@example.com\"`, then `gh auth login` (or paste the .pub key into GitHub/GitLab)." },
      { label: "VS Code essentials", detail: "Turn on Settings Sync. Extensions: WSL, Dev Containers, GitLens, Python, ESLint, Prettier, Error Lens." },
      { label: "Put native-Windows repos on a Dev Drive", detail: "Settings → System → Storage → Advanced storage settings → Disks & volumes → Create Dev Drive. Defender scans it in performance mode, which speeds up builds and package installs." },
      { label: "Keep repos out of synced folders", detail: "Never keep repos inside OneDrive. Exclude your code folder from Windows Search indexing too." },
    ],
    tools: ["VS Code", "GitHub CLI", "Dev Drive"],
    caution: "If you add Defender exclusions instead of a Dev Drive, only exclude folders you control. Never exclude Downloads.",
  },
  {
    id: "a-memory",
    title: "Plan for memory, swap and sustained performance",
    description: "Training runs and big builds need headroom and steady clocks.",
    time: "6 min",
    impact: "Recommended",
    why: "Running out of RAM kills long jobs, and power throttling on battery can silently halve build speed.",
    steps: [
      { label: "Leave the page file system-managed", detail: "Advanced system settings → Performance → Advanced → Virtual memory: automatic, on the fastest SSD." },
      { label: "Run long jobs plugged in", detail: "Use the OEM Performance mode and PowerToys Awake to stop sleep mid-run." },
      { label: "Close memory-heavy apps during big jobs", detail: "A browser with 40 tabs can hold 6–8 GB. Check Task Manager → Memory before starting." },
      { label: "Check if RAM can be upgraded", detail: "If your laptop has SODIMM slots, 32–64 GB is the best upgrade for AI/dev work. LPDDR memory is soldered and can't be upgraded." },
      { label: "Use fast external storage for datasets", detail: "Thunderbolt / USB4 NVMe enclosures reach 2–3 GB/s and mount into WSL under /mnt/d." },
    ],
  },
  {
    id: "a-security",
    title: "Lock down secrets and API keys",
    description: "Leaked AI service keys get expensive fast.",
    time: "6 min",
    impact: "Essential",
    why: "Keys pushed to a public repo are scraped and abused within minutes. Keep them out of repos and shell history.",
    steps: [
      { label: "Use a global gitignore", detail: "`git config --global core.excludesfile ~/.gitignore_global`, then add .env, .env.* and *.pem to that file." },
      { label: "Scan for secrets before commits", detail: "Add the gitleaks hook with pre-commit, and enable push protection on GitHub." },
      { label: "Store keys in a password manager", detail: "Use the 1Password or Bitwarden CLI to load keys per session instead of hard-coding them in shell profiles." },
      { label: "Set spending caps", detail: "Set monthly usage limits on every AI provider dashboard." },
    ],
    tools: ["gitleaks", "pre-commit", "1Password / Bitwarden CLI"],
  },
];

const verify: Task[] = [
  {
    id: "v-health",
    title: "Check drivers, RAM, battery and SSD health",
    description: "Quick checks that catch defects and missing drivers while you can still return the laptop.",
    time: "10 min",
    impact: "Essential",
    why: "Return windows are short. A worn battery, a failing SSD or RAM running in single-channel mode are far easier to fix in the first couple of weeks.",
    steps: [
      { label: "Device Manager shows no warnings", detail: "Right-click Start → Device Manager. A yellow triangle means a missing driver: get it from the OEM support page for your exact model." },
      { label: "RAM speed and channels", detail: "Task Manager → Performance → Memory: Speed should match the spec sheet. Slots used '2 of 2' means dual-channel. Single-channel RAM can cut integrated-GPU performance substantially." },
      { label: "Battery report", detail: "Run `powercfg /batteryreport` and open the battery-report.html it creates. Full charge capacity should be close to design capacity on a new laptop." },
      { label: "SSD health", detail: "`winget install CrystalDewWorld.CrystalDiskInfo`. Health should read Good with no media errors." },
      { label: "Screen and keyboard check", detail: "Open full-screen black and white images to spot dead pixels or heavy backlight bleed. Test every key on a keyboard tester page." },
    ],
    macos: "Hold Option and choose Apple menu → System Information → Power for cycle count and condition. For Apple Diagnostics, hold the power button at startup, then press Cmd+D.",
    tools: ["Device Manager", "CrystalDiskInfo", "powercfg"],
  },
  {
    id: "v-benchmark",
    title: "Record a performance baseline",
    description: "Run one CPU and one GPU test now so you can tell later if something has slowed down.",
    time: "15 min",
    impact: "Recommended",
    why: "Without a baseline, 'it feels slower' is impossible to diagnose. A sustained test also reveals thermal throttling early.",
    steps: [
      { label: "Prepare the laptop", detail: "Plug in, choose the performance mode you normally use, close other apps and let it idle for two minutes." },
      { label: "CPU: Cinebench 2024 multi-core", detail: "Run it with the 10-minute minimum duration and watch HWiNFO64 for clocks dropping sharply after the first minute." },
      { label: "GPU: 3DMark Time Spy", detail: "Free on Steam. Compare against other results for the same GPU; within roughly 10% is normal for laptops." },
      { label: "Storage: CrystalDiskMark", detail: "Sequential read should be near the SSD's rated speed (about 3,000–7,000 MB/s for NVMe Gen3/Gen4)." },
      { label: "Write the numbers down", detail: "Save the scores, peak temperatures and the date. Re-run after big updates or whenever things feel off." },
    ],
    macos: "Cinebench 2024 and Geekbench 6 (CPU + Metal). Activity Monitor's memory pressure graph should stay green.",
    tools: ["Cinebench 2024", "3DMark", "CrystalDiskMark", "HWiNFO64"],
  },
  {
    id: "v-routine",
    title: "Set a monthly maintenance routine",
    description: "A ten-minute monthly habit keeps a laptop feeling new for years.",
    time: "5 min",
    impact: "Recommended",
    why: "Performance decays slowly: apps re-add themselves to startup, drivers age, and dust builds up in the fans.",
    steps: [
      { label: "Monthly: update everything", detail: "`winget upgrade --all`, then Windows Update and the GPU driver app. Restart afterwards instead of only sleeping for weeks." },
      { label: "Monthly: recheck startup apps", detail: "Task Manager → Startup apps. App updates often quietly re-enable launchers." },
      { label: "Quarterly: clean the vents", detail: "With the laptop off, use short bursts of compressed air through the vents, holding the fan still so it doesn't overspin." },
      { label: "Quarterly: battery and storage check", detail: "Regenerate the battery report and make sure the SSD still has 20%+ free." },
      { label: "Add a calendar reminder", detail: "A recurring monthly 'Laptop tune-up' event with a link back to this checklist." },
    ],
    macos: "Monthly: Software Update and `brew upgrade`, and review Login Items. Restart at least once a week.",
  },
];

const lanes: Record<Profile, { title: string; description: string; tasks: Task[] }> = {
  Everyday: { title: "Everyday tuning", description: "Browser, input, display and apps for a fast, quiet daily driver.", tasks: everyday },
  Gaming: { title: "Gaming tuning", description: "GPU routing, thermals, display and input for steady frame rates.", tasks: gaming },
  Creator: { title: "Creator tuning", description: "Color, GPU acceleration, caches and backups for creative apps.", tasks: creator },
  "AI / Dev": { title: "AI & dev tuning", description: "Toolchain, WSL2, GPU compute and containers for builds and local models.", tasks: aidev },
};

export function getPhases(profile: Profile): Phase[] {
  const lane = lanes[profile];
  return [
    { key: "foundation", label: "Phase 1", title: "Foundation", description: "Do these first on any new or freshly reset laptop, in this order.", tasks: foundation },
    { key: "lane", label: "Phase 2", title: lane.title, description: lane.description, tasks: lane.tasks },
    { key: "verify", label: "Phase 3", title: "Verify & maintain", description: "Confirm everything worked, then keep it that way.", tasks: verify },
  ];
}

export const taskIndex = new Map<string, Task>(
  [...foundation, ...everyday, ...gaming, ...creator, ...aidev, ...verify].map((task) => [task.id, task]),
);
