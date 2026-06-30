import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  { title: "Multi-Agent AI", desc: "A team of agents plans, schedules, de-risks and coaches." },
  { title: "Smart Scheduling", desc: "Time blocks that respect your calendar and capacity." },
  { title: "Deadline Prediction", desc: "Success probability and risk for every deadline." },
  { title: "Google Calendar", desc: "Reads events and books focus sessions for you." },
  { title: "Daily Planning", desc: "A focused plan every day, not an endless list." },
  { title: "Weekly Reviews", desc: "Honest, data-driven reflections each week." },
  { title: "Productivity Analytics", desc: "Trends, accuracy and your weekly score." },
  { title: "Explainable AI", desc: "Every action comes with a clear reason." }
];

const steps = [
  "User Goal",
  "Planning Agent",
  "Scheduling Agent",
  "Risk Analysis Agent",
  "Productivity Coach",
  "Personalized Action Plan"
];

const googleTech = [
  "Gemini API",
  "Google AI Studio",
  "Google Cloud Run",
  "Google OAuth",
  "Google Calendar API"
];

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-6 py-20 ${className}`}>
      {children}
    </section>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const primaryTo = user ? "/app" : "/register";

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold text-brand-600">Momentum AI</span>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#features" className="hidden text-slate-600 hover:text-slate-900 sm:inline">Features</a>
            <a href="#how" className="hidden text-slate-600 hover:text-slate-900 sm:inline">How it works</a>
            {user ? (
              <Link to="/app" className="rounded-xl bg-brand-600 px-4 py-2 font-medium text-white">Open app</Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900">Sign in</Link>
                <Link to="/register" className="rounded-xl bg-brand-600 px-4 py-2 font-medium text-white">Get started</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <Section className="text-center">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          Proactive multi-agent productivity
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
          Stay Ahead of Every Deadline.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
          Momentum AI plans, schedules and de-risks your work automatically, like an
          executive assistant that never sleeps.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to={primaryTo} className="rounded-xl bg-brand-600 px-6 py-3 font-medium text-white transition hover:bg-brand-700">
            {user ? "Open dashboard" : "Start free"}
          </Link>
          <a href="#how" className="rounded-xl bg-slate-100 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-200">
            See how it works
          </a>
        </div>
      </Section>

      {/* Problem + Solution */}
      <Section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-8">
          <h2 className="text-xl font-bold">The problem</h2>
          <p className="mt-3 text-slate-500">
            Reminder apps are passive. They list tasks and wait. You still have to
            plan, prioritize, estimate and react, often too late to save a deadline.
          </p>
        </div>
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8">
          <h2 className="text-xl font-bold text-brand-700">The solution</h2>
          <p className="mt-3 text-brand-700">
            Momentum AI runs a team of agents that proactively decompose goals,
            schedule around your calendar, predict risk and coach you, with a clear
            explanation behind every decision.
          </p>
        </div>
      </Section>

      {/* Features */}
      <Section id="features">
        <h2 className="text-center text-3xl font-bold">Everything you need to ship on time</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 p-6 transition hover:shadow-md">
              <h3 className="font-semibold text-brand-700">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section id="how" className="rounded-3xl bg-slate-50">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-10 flex flex-col items-center gap-3">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center">
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium shadow-sm">
                {s}
              </div>
              {i < steps.length - 1 && <span className="my-1 text-brand-400">&#8595;</span>}
            </div>
          ))}
        </div>
      </Section>

      {/* Google technologies */}
      <Section className="text-center">
        <h2 className="text-3xl font-bold">Built on Google technology</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {googleTech.map((t) => (
            <span key={t} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700">
              {t}
            </span>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="text-center">
        <div className="rounded-3xl bg-brand-600 px-8 py-14 text-white">
          <h2 className="text-3xl font-bold">Ready to build momentum?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-50">
            Describe what you're working on in one sentence. Your AI assistant does the rest.
          </p>
          <Link to={primaryTo} className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-medium text-brand-700">
            {user ? "Open dashboard" : "Get started free"}
          </Link>
        </div>
      </Section>

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-slate-400 sm:flex-row">
          <span className="font-semibold text-brand-600">Momentum AI</span>
          <span>Stay Ahead of Every Deadline.</span>
        </div>
      </footer>
    </div>
  );
}