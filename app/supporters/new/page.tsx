"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button, Card, FormInput, FormSelect } from "@/components/ui"
import { AppLayout } from "@/components/layout"
import Link from "next/link"
export default function NewSupporterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  type LLG = { id: string; name: string };
  type Ward = { id: string; name: string; llg_id: string };
  type Supporter = {
    registered_by: string;
    full_name: string;
    gender: string;
    phone: string;
    occupation: string;
    ward_id: string;
    llg_id: string;
    support_level: string;
    notes: string;
  };
  const [llgs, setLlgs] = useState<LLG[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [formData, setFormData] = useState<Omit<Supporter, 'registered_by'>>({
    full_name: "",
    gender: "",
    phone: "",
    occupation: "",
    ward_id: "",
    llg_id: "",
    support_level: "Undecided",
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data: llgData } = await supabase.from("llgs").select("id, name");
      setLlgs((llgData as any[]) || []);
      const { data: wardData } = await supabase.from("wards").select("id, name, llg_id");
      setWards((wardData as any[]) || []);
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      // TODO: Replace with real user id from auth/session
      const registered_by = "00000000-0000-0000-0000-000000000000";
      const supporter: Supporter = { ...formData, registered_by };
      const { error } = await (supabase.from("supporters") as any).insert([supporter]);
      if (error) throw error;
      router.push("/supporters");
    } catch (error) {
      console.error("Error creating supporter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Register New Supporter">
      <div className="max-w-2xl">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">
                Personal Information
              </h3>
              <div className="space-y-4">
                <FormInput
                  label="Full Name *"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormSelect
                    label="Gender *"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />

                  <FormInput
                    label="Phone Number *"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <FormInput
                  label="Occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">
                Location
              </h3>
              <div className="space-y-4">
                <FormSelect
                  label="LLG *"
                  name="llg_id"
                  value={formData.llg_id}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  options={llgs.map(llg => ({ value: llg.id, label: llg.name }))}
                />

                <FormSelect
                  label="Ward *"
                  name="ward_id"
                  value={formData.ward_id}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  options={wards
                    .filter(ward => !formData.llg_id || ward.llg_id === formData.llg_id)
                    .map(ward => ({ value: ward.id, label: ward.name }))}
                />
              </div>
            </div>

            {/* Support Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">
                Campaign Support
              </h3>
              <div className="space-y-4">
                <FormSelect
                  label="Support Level *"
                  name="support_level"
                  value={formData.support_level}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  options={[
                    { value: "Strong", label: "Strong Supporter" },
                    { value: "Leaning", label: "Leaning Supporter" },
                    { value: "Undecided", label: "Undecided" },
                    { value: "Opposition", label: "Opposition" },
                  ]}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border border-navy-500 bg-navy-600 px-4 py-2 text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-opacity-50"
                    placeholder="Additional notes about this supporter..."
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 border-t border-navy-600 pt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Register Supporter"}
              </Button>
              <Link href="/supporters">
                <Button type="button" variant="secondary" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}

