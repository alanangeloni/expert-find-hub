import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Advisor } from "@/services/advisorsService";

interface AdvisorCardProps {
  advisor: Advisor;
}

const ACCENTS = [
  ["hsl(var(--aqua))", "hsl(var(--blue))"],
  ["hsl(var(--mint))", "hsl(var(--aqua))"],
  ["hsl(var(--blue-3))", "hsl(var(--blue))"],
  ["hsl(var(--mint-2))", "hsl(var(--blue))"],
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

const formatMin = (m?: string) => {
  if (!m) return null;
  if (m === "0" || m.toLowerCase() === "no minimum") return "No minimum";
  return m.includes("min") ? m : `${m} min`;
};

export const AdvisorCard = ({ advisor }: AdvisorCardProps) => {
  const accentIdx = (advisor.id?.charCodeAt(0) ?? 0) % ACCENTS.length;
  const [a1, a2] = ACCENTS[accentIdx];

  const services = (advisor.advisor_services ?? []).filter(Boolean).slice(0, 3);
  const designations = (advisor.professional_designations ?? []).filter(Boolean).slice(0, 3);

  return (
    <Link to={`/advisors/${advisor.slug}`} className="block h-full group">
      <article className="h-full bg-card border border-line rounded-[22px] p-6 flex flex-col transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-md)] hover:border-aqua">
        {/* Top: avatar + identity */}
        <div className="flex gap-3.5 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${a1}, ${a2})` }}
          >
            {advisor.headshot_url ? (
              <img src={advisor.headshot_url} alt={advisor.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(advisor.name)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-[18px] text-blue flex items-center gap-1.5 mb-1 leading-tight">
              <span className="truncate">{advisor.name}</span>
              {advisor.fiduciary && (
                <span className="text-aqua flex-shrink-0" title="Verified fiduciary">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              )}
            </h3>
            {advisor.position && (
              <div className="text-[13.5px] text-ink-2 font-medium truncate">{advisor.position}</div>
            )}
            <div className="text-[12.5px] text-muted-foreground truncate">
              {advisor.firm_name || "Independent Advisor"}
              {advisor.city && advisor.state_hq && ` · ${advisor.city}, ${advisor.state_hq}`}
            </div>
          </div>
        </div>

        {/* Credentials */}
        {(designations.length > 0 || advisor.years_of_experience) && (
          <div className="flex gap-1.5 flex-wrap mb-4">
            {designations.map((c) => (
              <span
                key={c}
                className="text-[11px] font-semibold px-2 py-0.5 bg-aqua-soft text-blue rounded-md tracking-wide"
              >
                {c}
              </span>
            ))}
            {advisor.years_of_experience && (
              <span className="text-[11px] font-semibold px-2 py-0.5 border border-line text-muted-foreground rounded-md">
                {advisor.years_of_experience} yrs
              </span>
            )}
          </div>
        )}

        {/* Services tagline */}
        {services.length > 0 && (
          <p className="font-display italic text-[15px] text-ink-2 leading-relaxed mb-5 flex-1">
            "{services.join(" · ")}"
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 p-3.5 bg-sand-2 rounded-xl mb-4">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-semibold">
              Minimum
            </span>
            <strong className="text-[13px] text-blue font-semibold truncate">
              {formatMin(advisor.minimum) ?? "—"}
            </strong>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-semibold">
              Fiduciary
            </span>
            <strong className="text-[13px] text-blue font-semibold truncate">
              {advisor.fiduciary ? "Yes" : "—"}
            </strong>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-semibold">
              States
            </span>
            <strong className="text-[13px] text-blue font-semibold truncate">
              {advisor.states_registered_in?.length ?? 0}
            </strong>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-line mt-auto">
          <span className="text-[13px] text-ink-3">
            {advisor.verified ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-mint" /> Verified profile
              </span>
            ) : (
              "Profile"
            )}
          </span>
          <span className="inline-flex items-center gap-1.5 border border-blue text-blue px-3.5 py-2 rounded-full text-[13px] font-medium group-hover:bg-blue group-hover:text-white transition-colors">
            View profile
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </Link>
  );
};
