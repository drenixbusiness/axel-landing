"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { services } from "@/lib/services";
import { Icon } from "./Icon";

const BUDGETS = ["Under $1,000", "$1,000 – $5,000", "$5,000 – $15,000", "$15,000+", "Not sure yet"];

type Key = "name" | "email" | "services" | "message";
type Errors = Partial<Record<Key, string>>;

export function ContactForm() {
  const params = useSearchParams();
  const preset = params.get("service");
  const brandParam = params.get("brand")?.slice(0, 80) ?? undefined;
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      company: String(fd.get("company") || "").trim(),
      services: fd.getAll("services").map(String),
      budget: String(fd.get("budget") || ""),
      message: String(fd.get("message") || "").trim(),
    };
    const next: Errors = {};
    if (data.name.length < 2) next.name = "Enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "Enter a valid email, e.g. name@company.com.";
    if (data.services.length === 0) next.services = "Choose at least one service you're interested in.";
    if (data.message.length < 10) next.message = "Describe your project in at least 10 characters.";
    setErrors(next);
    const first = (Object.keys(next) as Key[])[0];
    if (first) {
      const el = form.querySelector<HTMLElement>(first === "services" ? 'input[name="services"]' : `#${first}`);
      el?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const err = (k: Key) =>
    errors[k] ? (
      <span className="field__err" id={`${k}-err`}>
        {errors[k]}
      </span>
    ) : null;
  const a11y = (k: Key) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Name <span>*</span></label>
        <input id="name" name="name" autoComplete="name" required {...a11y("name")} />
        {err("name")}
      </div>
      <div className="field">
        <label htmlFor="email">Email <span>*</span></label>
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required {...a11y("email")} />
        {err("email")}
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
      </div>
      <div className="field">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" autoComplete="organization" defaultValue={brandParam} />
      </div>

      <fieldset className="field field--full" aria-describedby={errors.services ? "services-err" : undefined}>
        <legend>What do you need? <span>*</span></legend>
        <div className="chips">
          {services.map((s) => (
            <label className="chip" key={s.slug}>
              <input type="checkbox" name="services" value={s.title} defaultChecked={preset === s.slug} />
              <span>{s.title}</span>
            </label>
          ))}
        </div>
        {err("services")}
      </fieldset>

      <fieldset className="field field--full">
        <legend>Budget</legend>
        <div className="chips">
          {BUDGETS.map((b) => (
            <label className="chip" key={b}>
              <input type="radio" name="budget" value={b} />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field field--full">
        <label htmlFor="message">About the project <span>*</span></label>
        <textarea id="message" name="message" required {...a11y("message")} />
        <span className="field__hint">Goals, deadlines, links to sites or apps you like.</span>
        {err("message")}
      </div>

      {status === "ok" ? (
        <p className="form__status form__status--ok" role="status">
          <Icon name="check" />
          Thank you! Your request has been sent. We&apos;ll reply within one business day.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="form__status form__status--err" role="alert">
          Something went wrong while sending. Please try again, or email us directly.
        </p>
      ) : null}

      <div className="field--full">
        <button className="btn" type="submit" disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send request"} <Icon name="arrow" />
        </button>
      </div>
    </form>
  );
}
