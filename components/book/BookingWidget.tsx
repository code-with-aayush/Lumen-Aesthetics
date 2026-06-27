/**
 * BookingWidget — demo placeholder for the /book page.
 *
 * The PRD originally points to a Cal.com embed. Per project context this is
 * a portfolio demo with no real Cal.com account, so the widget renders a
 * styled, on-brand placeholder that walks a visitor through a realistic
 * booking flow without any backend:
 *
 *   1. Pick a service (4 radio-style cards).
 *   2. Pick a time-of-day preference (Morning / Afternoon / Evening)
 *      + optional specific-date input.
 *   3. Click "Request Appointment" → inline confirmation panel replaces the
 *      form (no toast, no modal — per the spec).
 *
 * All animations respect the project's PRD §2.3 easing tuple
 * [0.16, 1, 0.3, 1] with durations ≥ 300ms.
 */

"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/shared/Button";

const EASE = [0.16, 1, 0.3, 1] as const;

type ServiceId = "injectables" | "laser" | "membership" | "skin-assessment";

type Service = {
  id: ServiceId;
  name: string;
  duration: string;
  price: string;
};

const SERVICES: readonly Service[] = [
  {
    id: "injectables",
    name: "Injectables Consultation",
    duration: "45 min",
    price: "Complimentary",
  },
  {
    id: "laser",
    name: "Laser Resurfacing Consultation",
    duration: "45 min",
    price: "Complimentary",
  },
  {
    id: "membership",
    name: "Membership Intro Call",
    duration: "20 min",
    price: "Complimentary",
  },
  {
    id: "skin-assessment",
    name: "General Skin Assessment",
    duration: "60 min",
    price: "$150",
  },
] as const;

type TimeOfDay = "morning" | "afternoon" | "evening";

const TIME_OPTIONS: readonly { id: TimeOfDay; label: string }[] = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
] as const;

type Props = {
  className?: string;
};

export function BookingWidget({ className }: Props): JSX.Element {
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeOfDay | null>(null);
  const [datePreference, setDatePreference] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = selectedService !== null && selectedTime !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-2xl border border-lumen-border bg-lumen-dark",
        className,
      )}
    >
      {submitted ? (
        <ConfirmationPanel />
      ) : (
        <FormPanel
          selectedService={selectedService}
          onSelectService={setSelectedService}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          datePreference={datePreference}
          onDatePreferenceChange={setDatePreference}
          canSubmit={canSubmit}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

type FormPanelProps = {
  selectedService: ServiceId | null;
  onSelectService: (id: ServiceId) => void;
  selectedTime: TimeOfDay | null;
  onSelectTime: (id: TimeOfDay) => void;
  datePreference: string;
  onDatePreferenceChange: (value: string) => void;
  canSubmit: boolean;
  onSubmit: () => void;
};

function FormPanel({
  selectedService,
  onSelectService,
  selectedTime,
  onSelectTime,
  datePreference,
  onDatePreferenceChange,
  canSubmit,
  onSubmit,
}: FormPanelProps): JSX.Element {
  return (
    <div className="p-8 md:p-12">
      {/* Header */}
      <p className="mb-8 text-center font-body text-xs uppercase tracking-wider text-lumen-muted">
        Select a Service
      </p>

      {/* Service list */}
      <ul className="flex flex-col gap-3" role="radiogroup" aria-label="Service">
        {SERVICES.map((service) => {
          const isSelected = selectedService === service.id;
          return (
            <li key={service.id}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectService(service.id)}
                className={cn(
                  // Base layout.
                  "group relative w-full min-h-[64px] px-5 py-4",
                  "flex items-center justify-between gap-4 text-left",
                  "border bg-transparent",
                  "transition-colors duration-500",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-lumen-gold/40",
                  // Selected: 1px gold border + 2px gold accent rail on the left.
                  isSelected
                    ? "border-lumen-gold"
                    : "border-lumen-border hover:border-lumen-gold/60",
                )}
              >
                {/* Tiny gold left-border rail when selected (spec). */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 w-[2px] bg-lumen-gold transition-opacity duration-500",
                    isSelected ? "opacity-100" : "opacity-0",
                  )}
                />

                <div className="flex flex-col gap-1">
                  <span className="font-display text-lg italic font-light text-lumen-offwhite md:text-xl">
                    {service.name}
                  </span>
                  <span className="font-body text-xs uppercase tracking-wider text-lumen-muted">
                    {service.duration}
                  </span>
                </div>

                <span className="font-body text-sm text-lumen-gold whitespace-nowrap">
                  {service.price}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Time-of-day picker — appears once a service is selected. */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={
          selectedService !== null
            ? { opacity: 1, y: 0 }
            : { opacity: 0.35, y: 0 }
        }
        transition={{ duration: 0.5, ease: EASE }}
        className={cn(
          "mt-10 border-t border-lumen-border pt-8",
          selectedService === null && "pointer-events-none",
        )}
        aria-disabled={selectedService === null}
      >
        <p className="mb-4 font-body text-xs uppercase tracking-wider text-lumen-muted">
          Preferred Time
        </p>

        <div className="flex flex-wrap gap-3">
          {TIME_OPTIONS.map((option) => {
            const isSelected = selectedTime === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectTime(option.id)}
                aria-pressed={isSelected}
                className={cn(
                  "min-w-[100px] px-5 py-3",
                  "font-body text-xs uppercase tracking-wider",
                  "border transition-all duration-500",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-lumen-gold/40",
                  isSelected
                    ? "border-lumen-gold bg-lumen-gold text-lumen-black"
                    : "border-lumen-border text-lumen-offwhite hover:border-lumen-gold/60",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Optional date preference */}
        <div className="mt-6">
          <label
            htmlFor="booking-date-preference"
            className="mb-2 block font-body text-xs uppercase tracking-wider text-lumen-muted"
          >
            Specific date preference (optional)
          </label>
          <input
            id="booking-date-preference"
            type="text"
            value={datePreference}
            onChange={(e) => onDatePreferenceChange(e.target.value)}
            placeholder="e.g. weekday mornings next week"
            className={cn(
              "w-full bg-transparent border border-lumen-border px-4 py-3",
              "font-body text-sm text-lumen-offwhite placeholder:text-lumen-muted/60",
              "transition-colors duration-500",
              "focus:outline-none focus:border-lumen-gold",
            )}
          />
        </div>
      </motion.div>

      {/* Footer CTA */}
      <div className="mt-10 flex justify-center pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={cn(
            // The shared Button base uses `px-6 py-3`; nudge it a touch so
            // the CTA feels like a hero of the form.
            "px-10 py-4",
            !canSubmit && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-lumen-gold",
          )}
        >
          Request Appointment
        </Button>
      </div>
    </div>
  );
}

function ConfirmationPanel(): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="px-8 py-16 text-center md:px-12 md:py-20"
      role="status"
      aria-live="polite"
    >
      <p className="mb-4 font-body text-xs uppercase tracking-widest text-lumen-gold">
        Request received
      </p>
      <h3 className="font-display text-2xl italic font-light text-lumen-offwhite md:text-3xl">
        Thank you.
      </h3>
      <div className="mx-auto my-8 h-px w-16 bg-lumen-gold/70" aria-hidden />
      <p className="mx-auto max-w-md font-body text-base font-light leading-relaxed text-lumen-muted">
        We&apos;ll be in touch within 24 hours to confirm your appointment.
      </p>
    </motion.div>
  );
}