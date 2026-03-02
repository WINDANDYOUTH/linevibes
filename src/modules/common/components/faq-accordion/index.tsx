"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown } from "@medusajs/icons"

interface Question {
  question: string
  answer: string
}

interface FAQAccordionProps {
  questions: Question[]
}

export default function FAQAccordion({ questions }: FAQAccordionProps) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-4">
      {questions.map((item, index) => (
        <Accordion.Item
          key={index}
          value={`item-${index}`}
          className="bg-stone-50 rounded-xl overflow-hidden"
        >
          <Accordion.Header>
            <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-4 text-left group">
              <span className="text-stone-900 font-medium pr-4">{item.question}</span>
              <ChevronDown className="w-5 h-5 text-stone-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="px-6 pb-4 text-stone-600">
              {item.answer}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
