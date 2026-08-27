import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { US_STATES } from "@/constants/states";
import { ACCOUNTANT_SERVICES, ACCOUNTANT_SPECIALTIES, ACCOUNTANT_CREDENTIALS } from "@/constants/accountants";
import { Tables } from "@/integrations/supabase/types";

type AccountantRow = Tables<"accountants">;

interface AccountantFormProps {
  formData: Partial<AccountantRow>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<AccountantRow>>>;
}

export const AccountantForm = ({ formData, setFormData }: AccountantFormProps) => {
  const updateField = (field: keyof AccountantRow, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: keyof AccountantRow, value: string) => {
    setFormData((prev) => {
      const current = ((prev[field] as string[]) || []) as string[];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const isChecked = (field: keyof AccountantRow, value: string) =>
    (((formData[field] as string[]) || []) as string[]).includes(value);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug || ""}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="auto-generated if blank"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position || ""}
            onChange={(e) => updateField("position", e.target.value)}
            placeholder="e.g. Founder & CPA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="years_of_experience">Years of Experience</Label>
          <Input
            id="years_of_experience"
            type="number"
            value={formData.years_of_experience ?? ""}
            onChange={(e) => updateField("years_of_experience", e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={formData.bio || ""} onChange={(e) => updateField("bio", e.target.value)} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firm_name">Firm Name</Label>
          <Input id="firm_name" value={formData.firm_name || ""} onChange={(e) => updateField("firm_name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firm_address">Firm Address</Label>
          <Input
            id="firm_address"
            value={formData.firm_address || ""}
            onChange={(e) => updateField("firm_address", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city || ""} onChange={(e) => updateField("city", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>HQ State</Label>
          <Select value={formData.state_hq || ""} onValueChange={(v) => updateField("state_hq", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>States Served</Label>
        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto rounded-md border p-3">
          {US_STATES.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isChecked("states_served", s)} onChange={() => toggleArrayValue("states_served", s)} />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email || ""} onChange={(e) => updateField("email", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            value={formData.phone_number || ""}
            onChange={(e) => updateField("phone_number", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            value={formData.website_url || ""}
            onChange={(e) => updateField("website_url", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headshot_url">Headshot URL</Label>
          <Input
            id="headshot_url"
            value={formData.headshot_url || ""}
            onChange={(e) => updateField("headshot_url", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minimum_fee">Minimum Fee</Label>
          <Input
            id="minimum_fee"
            value={formData.minimum_fee || ""}
            onChange={(e) => updateField("minimum_fee", e.target.value)}
            placeholder="e.g. $500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pricing_note">Pricing Note</Label>
          <Input
            id="pricing_note"
            value={formData.pricing_note || ""}
            onChange={(e) => updateField("pricing_note", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Credentials</Label>
        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto rounded-md border p-3">
          {ACCOUNTANT_CREDENTIALS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isChecked("credentials", c)} onChange={() => toggleArrayValue("credentials", c)} />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Services</Label>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto rounded-md border p-3">
          {ACCOUNTANT_SERVICES.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isChecked("services", s)} onChange={() => toggleArrayValue("services", s)} />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Client Specialties</Label>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto rounded-md border p-3">
          {ACCOUNTANT_SPECIALTIES.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isChecked("client_specialties", s)}
                onChange={() => toggleArrayValue("client_specialties", s)}
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="disclaimer">Disclaimer</Label>
        <Textarea
          id="disclaimer"
          value={formData.disclaimer || ""}
          onChange={(e) => updateField("disclaimer", e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={!!formData.verified}
            onChange={(e) => updateField("verified", e.target.checked)}
          />
          Verified
        </label>
      </div>
    </div>
  );
};
