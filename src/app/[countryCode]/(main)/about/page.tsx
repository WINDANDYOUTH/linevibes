import { Metadata } from "next"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "About Us | LineVibes",
  description:
    "Learn about LineVibes' story, our commitment to robotic precision, and our passion for creating generative pen art.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20 border-b border-stone-200">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-600 text-sm uppercase tracking-wider mb-4 font-mono">Our Story</p>
            <Heading level="h1" className="text-4xl md:text-5xl font-bold text-stone-900 mb-6 font-mono">
              Where Code Meets Ink
            </Heading>
            <Text className="text-lg text-stone-600">
              We believe that the warmth of analog art and the precision of digital code belong together. 
              LineVibes was born from a desire to take digital blueprints and turn them into tangible, ink-drawn masterpieces.
            </Text>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-stone-50">
        <div className="content-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-600 text-sm uppercase tracking-wider mb-4 font-mono">Our Mission</p>
              <Heading level="h2" className="text-3xl font-bold text-stone-900 mb-6 font-mono">
                Precision Art for the Modern Age
              </Heading>
              <Text className="text-stone-600 mb-4">
                At LineVibes, we obsess over every line. We use high-precision XY pen plotters—robots that hold real pens—to draw detailed schematics, maps, and geometric art.
              </Text>
              <Text className="text-stone-600 mb-4">
                Unlike laser printers that spray dots, our machines physically draw on the paper, creating texture, depth, and a slight human imperfection that makes every piece unique.
              </Text>
              <Text className="text-stone-600">
                We use archival-grade inks and acid-free museum paper to ensure your artwork lasts a lifetime without fading.
              </Text>
            </div>
            <div className="bg-white border-2 border-stone-900 rounded-none aspect-square flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]"></div>
              <div className="text-center p-8 relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <p className="text-stone-900 font-mono font-bold">Drawn by Robots</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="content-container">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-sm uppercase tracking-wider mb-4 font-mono">Our Values</p>
            <Heading level="h2" className="text-3xl font-bold text-stone-900 font-mono">
              Engineered for Beauty
            </Heading>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-stone-50 p-8 border border-stone-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3 font-mono">0.01mm Precision</h3>
              <Text className="text-stone-600">
                We calibrate our machines daily. Every line is intentional, sharp, and perfectly placed.
              </Text>
            </div>

            <div className="bg-stone-50 p-8 border border-stone-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3 font-mono">Generative Art</h3>
              <Text className="text-stone-600">
                We use algorithms to generate unique patterns and designs that explore the intersection of math and aesthetics.
              </Text>
            </div>

            <div className="bg-stone-50 p-8 border border-stone-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.571-4.182m13.228 16.216H12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3 font-mono">Personalization</h3>
              <Text className="text-stone-600">
                Your memories, your maps, your machines. We customize every print to tell your specific story.
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="content-container text-center">
          <Heading level="h2" className="text-3xl font-bold mb-6 font-mono">
            Start Your Collection
          </Heading>
          <Text className="text-stone-400 mb-8 max-w-xl mx-auto font-mono">
            Browse our catalog of detailed schematics and generative art.
          </Text>
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors font-mono"
          >
            Go to Catalogue
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}
