"use client"

import { useState } from "react"
import { Button } from "@medusajs/ui"

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // TODO: Implement actual form submission (e.g., to an API endpoint or email service)
    console.log("Form submitted:", formState)

    setIsSubmitting(false)
    setSubmitted(true)
    setFormState({ name: "", email: "", subject: "", message: "" })
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-stone-900 mb-2">Thank You!</h3>
        <p className="text-stone-600 mb-6">
          We&apos;ve received your message and will get back to you within 24-48 hours.
        </p>
        <Button
          variant="secondary"
          onClick={() => setSubmitted(false)}
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-2">
          Subject *
        </label>
        <select
          id="subject"
          required
          value={formState.subject}
          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
        >
          <option value="">Select a subject</option>
          <option value="order">Order Inquiry</option>
          <option value="product">Product Question</option>
          <option value="return">Returns & Exchanges</option>
          <option value="shipping">Shipping Information</option>
          <option value="wholesale">Wholesale Inquiry</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
          Your Message *
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formState.message}
          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
          placeholder="How can we help you?"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
        <p className="text-sm text-stone-500">
          We typically respond within 24-48 hours.
        </p>
      </div>
    </form>
  )
}
