import { Metadata } from "next"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "About Us | LineVibes",
  description:
    "Learn how LineVibes combines design, durability, and manufacturing excellence in Dongguan, China.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-white py-20 border-b border-stone-200">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-600 text-sm uppercase tracking-wider mb-4 font-mono">Our Story</p>
            <Heading level="h1" className="text-4xl md:text-5xl font-bold text-stone-900 mb-6 font-mono">
              Built for Lasting Visual Impact
            </Heading>
            <Text className="text-lg text-stone-600">
              LineVibes creates design-led products that balance clean aesthetics, dependable build
              quality, and modern production precision. Our focus is simple: make visually striking
              pieces that feel deliberate, durable, and worth keeping.
            </Text>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="content-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-600 text-sm uppercase tracking-wider mb-4 font-mono">Our Mission</p>
              <Heading level="h2" className="text-3xl font-bold text-stone-900 mb-6 font-mono">
                Design, Reliability, and Precision
              </Heading>
              <Text className="text-stone-600 mb-4">
                LineVibes exists to turn strong concepts into refined finished products. We care about
                proportion, material quality, and consistency because those details shape how a product
                is experienced over time.
              </Text>
              <Text className="text-stone-600 mb-4">
                Operating from Dongguan City, Guangdong Province, China places us at the center of a
                mature manufacturing ecosystem. That gives us direct access to production expertise,
                supply-chain agility, and quality control that supports fast iteration and dependable output.
              </Text>
              <Text className="text-stone-600">
                Our mission is to keep pushing for products that look sharper, last longer, and
                communicate a confident visual identity from first impression to long-term use.
              </Text>
            </div>
            <div className="bg-white border-2 border-stone-900 rounded-none aspect-square flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]"></div>
              <div className="text-center p-8 relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" />
                  </svg>
                </div>
                <p className="text-stone-900 font-mono font-bold">Engineered in Dongguan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="content-container">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-sm uppercase tracking-wider mb-4 font-mono">Our Values</p>
            <Heading level="h2" className="text-3xl font-bold text-stone-900 font-mono">
              Built Around Product Confidence
            </Heading>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-stone-50 p-8 border border-stone-200 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-stone-900 mb-3 font-mono">Intentional Quality</h3>
              <Text className="text-stone-600">
                We build processes around repeatability, finish quality, and product integrity.
              </Text>
            </div>

            <div className="bg-stone-50 p-8 border border-stone-200 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-stone-900 mb-3 font-mono">Forward-Looking Design</h3>
              <Text className="text-stone-600">
                We favor modern forms, clear visual systems, and product decisions that stay relevant.
              </Text>
            </div>

            <div className="bg-stone-50 p-8 border border-stone-200 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-stone-900 mb-3 font-mono">Operational Agility</h3>
              <Text className="text-stone-600">
                Our location and workflow let us move quickly without losing control of the details.
              </Text>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-900 text-white">
        <div className="content-container text-center">
          <Heading level="h2" className="text-3xl font-bold mb-6 font-mono">
            Explore LineVibes
          </Heading>
          <Text className="text-stone-400 mb-8 max-w-xl mx-auto font-mono">
            Browse products shaped by precise execution, strong visual language, and reliable fulfillment.
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
