import React from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin } from "lucide-react";
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
  if (!m) return "—";
  if (m === "0" || m.toLowerCase() === "no minimum") return "No minimum";
  return m;
};

const extractAcronym = (s: string) => {
  const paren = s.match(/\(([^)]+)\)/);
  if (paren) return paren[1].trim();
  const caps = s.match(/\b[A-Z]{2,}\b/g);
  if (caps && caps.length) return caps.join("");
  const words = s.trim().split(/\s+/);
  if (words.length > 1) return words.map((w) => w[0]?.toUpperCase()).join("");
  return s.toUpperCase();
};

export const AdvisorCard = ({ advisor }: AdvisorCardProps) => {
  const accentIdx = (advisor.id?.charCodeAt(0) ?? 0) % ACCENTS.length;
  const [a1, a2] = ACCENTS[accentIdx];

  const designations = (advisor.professional_designations ?? [])
    .filter(Boolean)
    .map(extractAcronym)
    .slice(0, 3);
  const services = (advisor.advisor_services ?? []).filter(Boolean).slice(0, 3);
  const isFeeOnly = (advisor.compensation ?? []).some((c) =>
    c?.toLowerCase().includes("fee-only") || c?.toLowerCase().includes("fee only")
  );

  return (
    <Link to={`/advisors/${advisor.slug}`} className="block h-full group">
      <article className="h-full bg-card border border-line rounded-[22px] p-6 flex flex-col transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-md)] hover:border-aqua">
        {/* Header: avatar + identity */}
        <div className="flex gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-xl flex-shrink-0 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${a1}, ${a2})` }}
          >
            {advisor.headshot_url ? (
              <img src={advisor.headshot_url} alt={advisor.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(advisor.name)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-[19px] text-blue leading-tight mb-1 truncate">
              {advisor.name}
            </h3>
            {advisor.position && (
              <div className="text-[13.5px] text-ink-2 truncate mb-1">{advisor.position}</div>
            )}
            {advisor.firm_name && (
              <div className="inline-flex items-center gap-1.5 text-[13px] text-blue font-medium truncate max-w-full">
                <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{advisor.firm_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        {(advisor.city || advisor.state_hq) && (
          <div className="flex items-center gap-1.5 text-[13.5px] text-ink-2 mb-3">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">
              {[advisor.city, advisor.state_hq].filter(Boolean).join(", ")}
            </span>
          </div>
        )}

        {/* Status pills */}
        {(designations.length > 0 || isFeeOnly) && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {designations.map((d) => (
              <span
                key={d}
                className="text-[11.5px] font-semibold px-2.5 py-1 bg-sand-2 text-blue rounded-full"
              >
                {d}
              </span>
            ))}
            {isFeeOnly && (
              <span className="text-[11.5px] font-semibold px-2.5 py-1 bg-mint-soft text-mint-ink rounded-full">
                Fee-Only
              </span>
            )}
          </div>
        )}

        {/* Service chips */}
        {services.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-5">
            {services.map((s) => (
              <span
                key={s}
                className="text-[12px] px-2.5 py-1 border border-line text-ink-2 rounded-md"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-line mt-auto pt-4 flex items-end justify-between gap-3">
          <div className="flex gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                Experience
              </span>
              <strong className="text-[14px] text-blue font-bold">
                {advisor.years_of_experience ? `${advisor.years_of_experience} yrs` : "—"}
              </strong>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-semibold">
                Min. Assets
              </span>
              <strong className="text-[14px] text-blue font-bold">
                {formatMin(advisor.minimum)}
              </strong>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};
