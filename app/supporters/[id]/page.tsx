"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button, Card, FormInput, FormSelect, Modal } from "@/components/ui"
import { AppLayout } from "@/components/layout"
import Link from "next/link"

export default function Page({ params }: { params: { id: string } }) {
  // Supabase
  const { getSupabaseClient } = require("@/lib/supabase")
  const supabase = getSupabaseClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    gender: "Male",
    phone: "",
    occupation: "",
    ward_id: "",
    llg_id: "",
    support_level: "Strong",
    notes: "",
  })

  // Fetch supporter data from Supabase
  useEffect(() => {
    const fetchSupporter = async () => {
      const { data } = await supabase
        .from("supporters")
        .select("*")
        .eq("id", params.id)
        .single()
      if (data) setFormData(data)
    }
    fetchSupporter()
    // eslint-disable-next-line
  }, [params.id])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("supporters")
        .update(formData)
        .eq("id", params.id)
      if (error) throw error
      router.push("/supporters")
    } catch (error) {
      console.error("Error updating supporter:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("supporters")
        .delete()
        .eq("id", params.id)
      if (error) throw error
      router.push("/supporters")
    } catch (error) {
      console.error("Error deleting supporter:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout title="Supporter Details">
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
                  options={[
                    { value: "llg-1", label: "LLG 1" },
                    { value: "llg-2", label: "LLG 2" },
                    { value: "llg-3", label: "LLG 3" },
                  ]}
                />

                <FormSelect
                  label="Ward *"
                  name="ward_id"
                  value={formData.ward_id}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  options={[
                    { value: "ward-1", label: "Ward 1" },
                    { value: "ward-2", label: "Ward 2" },
                    { value: "ward-3", label: "Ward 3" },
                  ]}
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
                {isLoading ? "Saving..." : "Update Supporter"}
              </Button>
              <Button
                type="button"
                variant="danger"
                size="lg"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isLoading}
              >
                Delete
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Supporter"
        actions={
          <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        }
      >
        <p>
          Are you sure you want to delete this supporter record? This action
          cannot be undone.
        </p>
      </Modal>
    </AppLayout>
  )
}
