"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { getPhases, profiles, taskIndex, type Impact, type Profile, type Task } from "./setup-data";
import SectionVideo from "./SectionVideo";

type Filter = Impact | "All";
type SyncState = "loading" | "saving" | "saved" | "error";
type LocalState = { visitorId?: string; profile?: unknown; completed?: unknown; dirty?: boolean };

const VISITOR_KEY = "optiset-visitor";
const STATE_KEY = "optiset-state-v2";
const filters: Filter[] = ["All", "Essential", "Recommended", "Optional"];

// Static hosts (GitHub Pages) have no /api backend; once a request fails we
// stop calling it and rely on localStorage only.
let apiOffline = false;

const stepKey = (taskId: string, index: number) => `${taskId}:${index}`;
const keysOf = (task: Task) => task.steps.map((_, index) => stepKey(task.id, index));
const minutesOf = (task: Task) => Number.parseInt(task.time, 10) || 0;
const pad = (value: number) => String(value).padStart(2, "0");
const formatTime = (total: number) => (total >= 60 ? `${Math.floor(total / 60)}h ${pad(total % 60)}m` : `${total} min`);
const snapshotOf = (profile: Profile, completed: string[]) => JSON.stringify({ profile, completed: [...completed].sort() });
const isProfile = (value: unknown): value is Profile => profiles.some((item) => item.name === value);

function normalizeCompleted(entries: unknown): string[] {
  if (!Array.isArray(entries)) return [];
  const result = new Set<string>();
  for (const entry of entries) {
    if (typeof entry !== "string") continue;
    const [taskId, rawIndex] = entry.split(":");
    const task = taskIndex.get(taskId);
    if (!task) continue;
    if (rawIndex === undefined) {
      keysOf(task).forEach((key) => result.add(key));
    } else {
      const index = Number(rawIndex);
      if (Number.isInteger(index) && index >= 0 && index < task.steps.length) result.add(stepKey(task.id, index));
    }
  }
  return [...result];
}

function firstOpenTask(profile: Profile, completed: string[]): string[] {
  const done = new Set(completed);
  const next = getPhases(profile)
    .flatMap((phase) => phase.tasks)
    .find((task) => keysOf(task).some((key) => !done.has(key)));
  return next ? [next.id] : [];
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h11M10.5 4.5 16 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CheckIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="m4.2 10.2 3.6 3.6 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ChevronIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CodeChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!navigator.clipboard) return;
    void navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      })
      .catch(() => undefined);
  };
  return <button type="button" className={`code ${copied ? "copied" : ""}`} onClick={copy} title="Click to copy">{value}</button>;
}

function Rich({ text }: { text: string }) {
  return <>{text.split("`").map((part, index) => (index % 2 === 1 ? <CodeChip key={index} value={part} /> : <span key={index}>{part}</span>))}</>;
}

export default function OptimizerClient() {
  const [profile, setProfile] = useState<Profile>("Everyday");
  const [completed, setCompleted] = useState<string[]>([]);
  const [openTasks, setOpenTasks] = useState<string[]>(() => firstOpenTask("Everyday", []));
  const [filter, setFilter] = useState<Filter>("All");
  const [visitorId, setVisitorId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [sync, setSync] = useState<SyncState>("loading");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const lastSaved = useRef("");
  const latest = useRef("");

  const phases = useMemo(() => getPhases(profile), [profile]);
  const allTasks = useMemo(() => phases.flatMap((phase) => phase.tasks), [phases]);
  const done = useMemo(() => new Set(completed), [completed]);
  const visiblePhases = useMemo(
    () =>
      phases
        .map((phase) => ({ ...phase, tasks: filter === "All" ? phase.tasks : phase.tasks.filter((task) => task.impact === filter) }))
        .filter((phase) => phase.tasks.length > 0),
    [phases, filter],
  );
  const visibleTasks = useMemo(() => visiblePhases.flatMap((phase) => phase.tasks), [visiblePhases]);

  const stepsDone = (task: Task) => keysOf(task).filter((key) => done.has(key)).length;
  const isDone = (task: Task) => stepsDone(task) === task.steps.length;

  const totalSteps = allTasks.reduce((sum, task) => sum + task.steps.length, 0);
  const finishedSteps = allTasks.reduce((sum, task) => sum + stepsDone(task), 0);
  const finishedTasks = allTasks.filter(isDone).length;
  const remainingMinutes = allTasks.filter((task) => !isDone(task)).reduce((sum, task) => sum + minutesOf(task), 0);
  const percent = totalSteps ? Math.round((finishedSteps / totalSteps) * 100) : 0;
  const allOpen = visibleTasks.length > 0 && visibleTasks.every((task) => openTasks.includes(task.id));

  const laneStats = useMemo(() => {
    const stats = {} as Record<Profile, { finished: number; total: number }>;
    for (const item of profiles) {
      const tasks = getPhases(item.name).flatMap((phase) => phase.tasks);
      stats[item.name] = { finished: tasks.filter((task) => keysOf(task).every((key) => done.has(key))).length, total: tasks.length };
    }
    return stats;
  }, [done]);

  // Load: resume link → saved device state → server plan.
  useEffect(() => {
    let cancelled = false;
    const url = new URL(window.location.href);
    const linked = url.searchParams.get("plan");
    const linkedId = linked && /^[A-Za-z0-9-]{8,120}$/.test(linked) ? linked : null;
    if (linked !== null) {
      url.searchParams.delete("plan");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
    const id = linkedId ?? window.localStorage.getItem(VISITOR_KEY) ?? createId();
    window.localStorage.setItem(VISITOR_KEY, id);

    let local: LocalState | null = null;
    try {
      local = JSON.parse(window.localStorage.getItem(STATE_KEY) ?? "null") as LocalState | null;
    } catch {
      local = null;
    }
    if (local?.visitorId !== id) local = null;

    const apply = (rawProfile: unknown, rawCompleted: unknown) => {
      const nextProfile = isProfile(rawProfile) ? rawProfile : "Everyday";
      const nextCompleted = normalizeCompleted(rawCompleted);
      setProfile(nextProfile);
      setCompleted(nextCompleted);
      setOpenTasks(firstOpenTask(nextProfile, nextCompleted));
      return snapshotOf(nextProfile, nextCompleted);
    };
    const finish = (saved: string) => {
      lastSaved.current = saved;
      setVisitorId(id);
      setHydrated(true);
    };

    if (local?.dirty) {
      apply(local.profile, local.completed);
      finish("");
      return () => {
        cancelled = true;
      };
    }

    if (apiOffline) {
      if (local) apply(local.profile, local.completed);
      finish("");
      return () => {
        cancelled = true;
      };
    }

    fetch(`/api/plans?visitorId=${encodeURIComponent(id)}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("load failed"))))
      .then((data: { plan?: { profile?: unknown; completedSteps?: unknown } | null }) => {
        if (cancelled) return;
        if (data.plan) {
          finish(apply(data.plan.profile, data.plan.completedSteps));
        } else if (local) {
          apply(local.profile, local.completed);
          finish("");
        } else {
          finish(snapshotOf("Everyday", []));
        }
      })
      .catch(() => {
        if (cancelled) return;
        apiOffline = true;
        if (local) apply(local.profile, local.completed);
        finish("");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-save to this device immediately and to the database after a short pause.
  useEffect(() => {
    if (!hydrated || !visitorId) return;
    const snapshot = snapshotOf(profile, completed);
    latest.current = snapshot;
    const persistLocal = (dirty: boolean) =>
      window.localStorage.setItem(STATE_KEY, JSON.stringify({ visitorId, profile, completed, dirty }));

    if (snapshot === lastSaved.current) {
      persistLocal(false);
      setSync("saved");
      return;
    }

    if (apiOffline) {
      // No backend (static host): local save already done, nothing to sync.
      setSync("saved");
      return;
    }

    persistLocal(true);
    setSync("saving");
    const timer = window.setTimeout(() => {
      fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, profile, completedSteps: completed }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("save failed");
          lastSaved.current = snapshot;
          if (latest.current === snapshot) {
            persistLocal(false);
            setSync("saved");
          }
        })
        .catch(() => {
          apiOffline = true;
          if (latest.current === snapshot) setSync("saved");
        });
    }, 650);
    return () => window.clearTimeout(timer);
  }, [profile, completed, hydrated, visitorId]);

  // Highlight the task currently in view in the sidebar.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const elements = visibleTasks
      .map((task) => document.getElementById(`task-${task.id}`))
      .filter((element): element is HTMLElement => element !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActiveId(hit.target.id.slice(5));
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [visibleTasks]);

  const scrollToTask = (id: string) => {
    window.setTimeout(() => document.getElementById(`task-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const toggleOpen = (id: string) =>
    setOpenTasks((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const toggleStep = (key: string) =>
    setCompleted((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));

  const toggleTask = (task: Task) => {
    const keys = keysOf(task);
    setCompleted((current) =>
      keys.every((key) => current.includes(key)) ? current.filter((key) => !keys.includes(key)) : [...new Set([...current, ...keys])],
    );
  };

  const jumpTo = (id: string) => {
    setOpenTasks((current) => (current.includes(id) ? current : [...current, id]));
    setTocOpen(false);
    scrollToTask(id);
  };

  const finishAndNext = (task: Task) => {
    const nextDone = new Set([...completed, ...keysOf(task)]);
    setCompleted([...nextDone]);
    const index = visibleTasks.findIndex((item) => item.id === task.id);
    const rest = visibleTasks.slice(index + 1);
    const next = rest.find((item) => keysOf(item).some((key) => !nextDone.has(key))) ?? rest[0];
    setOpenTasks((current) => {
      const remaining = current.filter((item) => item !== task.id);
      return next && !remaining.includes(next.id) ? [...remaining, next.id] : remaining;
    });
    scrollToTask(next ? next.id : task.id);
  };

  const switchProfile = (next: Profile) => {
    if (next === profile) return;
    setProfile(next);
    setFilter("All");
    setTocOpen(false);
    setOpenTasks(firstOpenTask(next, completed));
  };

  const syncLabel = { loading: "Loading progress…", saving: "Saving…", saved: "Progress saved", error: "Saved on this device" }[sync];

  return (
    <div className="app" id="top">
      <header className="topbar">
        <div className="shell topbar-inner">
          <div className="topbar-left">
            <a className="brand" href="#top" aria-label="OptiSet, back to top"><span className="brand-mark"><i /><i /><i /></span>optiset</a>
            <span className="crumb">Laptop setup guide</span>
          </div>
          <div className="top-actions">
            <span className={`sync sync-${sync}`} aria-live="polite"><span className="sync-text">{syncLabel}</span></span>
          </div>
        </div>
      </header>

      <main className="shell">
        <section className="page-head">
          <p className="kicker">Windows 11 · macOS notes included</p>
          <h1>Laptop setup, <em>step by step.</em></h1>
          <p className="lede">Pick how you use your laptop, then work top to bottom. Check off steps as you go. Progress saves automatically.</p>
        </section>

        <div className="lanes" role="tablist" aria-label="Choose your setup lane">
          {profiles.map((item) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={profile === item.name}
              className={`lane ${profile === item.name ? "active" : ""}`}
              onClick={() => switchProfile(item.name)}
            >
              <span className="lane-icon" aria-hidden="true">{item.icon}</span>
              <span className="lane-text"><strong>{item.name}</strong><small>{item.caption}</small></span>
              <span className="lane-progress">{laneStats[item.name].finished}/{laneStats[item.name].total}</span>
            </button>
          ))}
        </div>

        <div className="workspace">
          <aside className="sidebar">
            <div className="progress-card">
              <div className="progress-top"><span>{profile.toUpperCase()} SETUP</span><span>{percent}%</span></div>
              <div className="progress-big">{finishedTasks}<em> / {allTasks.length} tasks done</em></div>
              <div className="bar"><span style={{ width: `${percent}%` }} /></div>
              <div className="progress-meta">
                <span>{finishedSteps}/{totalSteps} steps</span>
                <span>{remainingMinutes ? `~${formatTime(remainingMinutes)} left` : "All done"}</span>
              </div>
            </div>

            <button type="button" className="toc-toggle" onClick={() => setTocOpen((value) => !value)} aria-expanded={tocOpen}>
              <span>{tocOpen ? "Hide task list" : "Jump to a task"}</span><ChevronIcon />
            </button>

            <nav className={`toc ${tocOpen ? "open" : ""}`} aria-label="Tasks">
              {visiblePhases.map((phase) => (
                <div key={phase.key} className="toc-group">
                  <div className="toc-phase">
                    <span>{phase.label} · {phase.title}</span>
                    <span>{phase.tasks.filter(isDone).length}/{phase.tasks.length}</span>
                  </div>
                  {phase.tasks.map((task) => {
                    const count = stepsDone(task);
                    const complete = count === task.steps.length;
                    return (
                      <button
                        key={task.id}
                        type="button"
                        className={`toc-item ${activeId === task.id ? "active" : ""} ${complete ? "done" : ""}`}
                        onClick={() => jumpTo(task.id)}
                      >
                        <span className={`toc-dot ${complete ? "done" : count > 0 ? "partial" : ""}`}>{complete && <CheckIcon />}</span>
                        <span className="toc-title">{task.title}</span>
                        <span className="toc-time">{minutesOf(task)}m</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>

          <section className="content" aria-label={`${profile} setup checklist`}>
            <div className="toolbar">
              <div className="filter-row" role="group" aria-label="Filter by priority">
                {filters.map((item) => (
                  <button key={item} type="button" className={`filter-chip ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)} aria-pressed={filter === item}>
                    {item}
                    <b>{item === "All" ? allTasks.length : allTasks.filter((task) => task.impact === item).length}</b>
                  </button>
                ))}
              </div>
              <button type="button" className="text-btn" onClick={() => setOpenTasks(allOpen ? [] : visibleTasks.map((task) => task.id))}>
                {allOpen ? "Collapse all" : "Expand all"}
              </button>
            </div>

            {finishedTasks === allTasks.length && (
              <div className="done-banner"><span className="done-icon"><CheckIcon /></span>Every task in the {profile} setup is done. Come back to Phase 3 once a month.</div>
            )}

            {visiblePhases.map((phase) => (
              <section key={phase.key} className="phase">
                <header className="phase-head">
                  <div>
                    <span className="phase-tag">{phase.label}</span>
                    <h2>{phase.title}</h2>
                    <p>{phase.description}</p>
                  </div>
                  <span className="phase-count">
                    {phase.tasks.filter(isDone).length}/{phase.tasks.length} done · {formatTime(phase.tasks.reduce((sum, task) => sum + minutesOf(task), 0))}
                  </span>
                </header>

                {phase.tasks.map((task) => {
                  const count = stepsDone(task);
                  const complete = count === task.steps.length;
                  const isOpen = openTasks.includes(task.id);
                  const hasNext = visibleTasks.indexOf(task) < visibleTasks.length - 1;
                  return (
                    <article key={task.id} id={`task-${task.id}`} className={`task-card ${isOpen ? "open" : ""} ${complete ? "done" : ""}`}>
                      <div className="task-head">
                        <button
                          type="button"
                          className={`check-btn ${complete ? "done" : ""}`}
                          onClick={() => toggleTask(task)}
                          aria-pressed={complete}
                          aria-label={complete ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
                        >
                          <CheckIcon />
                        </button>
                        <button type="button" className="task-toggle" onClick={() => toggleOpen(task.id)} aria-expanded={isOpen} aria-controls={`body-${task.id}`}>
                          <span className="task-text">
                            <span className="task-title-row">
                              <span className="task-num">{pad(allTasks.indexOf(task) + 1)}</span>
                              <span className="task-title">{task.title}</span>
                            </span>
                            <span className="task-desc">{task.description}</span>
                            <span className="task-meta">
                              <i className={`impact impact-${task.impact.toLowerCase()}`}>{task.impact}</i>
                              <span>{task.time}</span>
                              <span className={count > 0 ? "meta-progress" : ""}>{count}/{task.steps.length} steps</span>
                              {task.macos && <span className="meta-mac">macOS notes</span>}
                            </span>
                          </span>
                          <span className="chev"><ChevronIcon /></span>
                        </button>
                      </div>

                      {isOpen && (
                        <div className="task-body" id={`body-${task.id}`}>
                          <div className="task-why"><b>Why it matters</b><p>{task.why}</p></div>
                          <ol className="step-list">
                            {task.steps.map((step, index) => {
                              const key = stepKey(task.id, index);
                              const checked = done.has(key);
                              return (
                                <li key={key} className={`step ${checked ? "checked" : ""}`}>
                                  <input type="checkbox" id={`step-${key}`} checked={checked} onChange={() => toggleStep(key)} />
                                  <div className="step-text">
                                    <label htmlFor={`step-${key}`}><span className="step-index">{index + 1}.</span>{step.label}</label>
                                    <p><Rich text={step.detail} /></p>
                                  </div>
                                </li>
                              );
                            })}
                          </ol>
                          <SectionVideo taskId={task.id} />
                          {task.macos && <div className="task-note mac"><b>On macOS</b><p><Rich text={task.macos} /></p></div>}
                          {task.caution && <div className="task-note caution"><b>Heads up</b><p><Rich text={task.caution} /></p></div>}
                          {task.tools && (
                            <div className="task-tools"><b>Tools</b>{task.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
                          )}
                          <div className="task-foot">
                            <span className="foot-hint">
                              {complete ? "All steps checked." : `${task.steps.length - count} step${task.steps.length - count === 1 ? "" : "s"} left · commands copy on click`}
                            </span>
                            <button type="button" className="primary-btn" onClick={() => finishAndNext(task)}>
                              {complete ? (hasNext ? "Next task" : "Close") : hasNext ? "Mark done & next" : "Mark done"}
                              <ArrowIcon />
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </section>
            ))}

            {visiblePhases.length === 0 && <p className="empty-filter">No {filter.toLowerCase()} tasks in this lane.</p>}

            <p className="page-note">Menu names follow Windows 11 24H2 and recent macOS. Laptop makers rename some settings, so look for the closest match.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
