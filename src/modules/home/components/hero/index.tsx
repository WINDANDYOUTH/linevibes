import { ArrowRight } from "@medusajs/icons"
import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <>
      {/* Main Hero Section */}
      <section className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        {/* Background Pattern - Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
            backgroundSize: `60px 60px`
        }}></div>

        {/* Animated Line Art Background Element */}
        <div className="absolute top-20 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <path 
              d="M50,200 Q100,50 200,100 T350,150 Q300,250 200,300 T50,200" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="text-indigo-600"
            />
            <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" className="text-indigo-400"/>
            <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" className="text-indigo-300"/>
          </svg>
        </div>

        <div className="content-container relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-[90vh] py-16 lg:py-24 gap-12">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-6 border border-indigo-200">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              Custom Line Art
            </div>

            {/* Main Heading - Emotional Hook */}
            <Heading
              level="h1"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-tight mb-6"
            >
              Turn Memories into{" "}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Timeless Art
              </span>
            </Heading>

            {/* Subtitle - Value Proposition */}
            <Text className="text-lg md:text-xl text-stone-600 mb-8 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Upload your photos and we&apos;ll transform them into stunning line art. 
              From classic cars to family portraits — each piece is plotted with precision using real archival ink.
            </Text>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <LocalizedClientLink href="/custom">
                <Button 
                  variant="primary" 
                  className="w-full sm:w-auto px-8 py-4 text-base bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  ✨ Create Custom Art
                  <ArrowRight className="ml-2" />
                </Button>
              </LocalizedClientLink>
              <LocalizedClientLink href="/store">
                <Button 
                  variant="secondary" 
                  className="w-full sm:w-auto px-8 py-4 text-base border-2 border-stone-200 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300"
                >
                  Browse Gallery
                </Button>
              </LocalizedClientLink>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 pt-8 border-t border-stone-200">
              <div className="flex items-center gap-2 text-stone-600">
                <span className="text-lg">🖋️</span>
                <span className="text-sm font-medium">Real Archival Ink</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <span className="text-lg">📜</span>
                <span className="text-sm font-medium">Museum Paper</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <span className="text-lg">🌍</span>
                <span className="text-sm font-medium">Worldwide Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image Grid */}
          <div className="flex-1 relative w-full max-w-xl">
            <div className="grid grid-cols-2 gap-4">
              {/* Main Feature Image */}
              <div className="col-span-2 relative aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900"></div>
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-all duration-700" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549488497-2357754f9810?w=800&auto=format&fit=crop')` }}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white/80 text-xs mb-1">FEATURED</p>
                  <h3 className="text-xl font-semibold text-white">Custom Portraits</h3>
                </div>
              </div>

              {/* Category Cards */}
              <LocalizedClientLink href="/categories/automotive" className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-orange-900"></div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500" 
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614162692292-7ac56d7f367e?w=400')` }}
                  ></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-3xl mb-2">🚗</span>
                    <span className="font-semibold text-sm">Automotive</span>
                  </div>
                </div>
              </LocalizedClientLink>

              <LocalizedClientLink href="/categories/aviation" className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-900 to-blue-900"></div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500" 
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400')` }}
                  ></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-3xl mb-2">✈️</span>
                    <span className="font-semibold text-sm">Aviation</span>
                  </div>
                </div>
              </LocalizedClientLink>

              <LocalizedClientLink href="/categories/ocean-nature" className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-cyan-900"></div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500" 
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400')` }}
                  ></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-3xl mb-2">🌊</span>
                    <span className="font-semibold text-sm">Ocean & Nature</span>
                  </div>
                </div>
              </LocalizedClientLink>

              <LocalizedClientLink href="/categories/family-love" className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-900 to-pink-900"></div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500" 
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400')` }}
                  ></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-3xl mb-2">❤️</span>
                    <span className="font-semibold text-sm">Family & Love</span>
                  </div>
                </div>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-t border-stone-100">
        <div className="content-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              From photo to art in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                📤
              </div>
              <div className="text-sm text-indigo-600 font-semibold mb-2">Step 1</div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Upload Your Photo</h3>
              <p className="text-stone-600">
                Share your favorite memory — a car, a pet, a couple, or any cherished moment.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                🎨
              </div>
              <div className="text-sm text-indigo-600 font-semibold mb-2">Step 2</div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">We Transform It</h3>
              <p className="text-stone-600">
                Our artists convert your photo into a stunning line art design, then our robots plot it with real ink.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                🎁
              </div>
              <div className="text-sm text-indigo-600 font-semibold mb-2">Step 3</div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Receive Your Art</h3>
              <p className="text-stone-600">
                Your unique artwork arrives beautifully packaged and ready to display or gift.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <LocalizedClientLink href="/custom">
              <Button 
                variant="primary" 
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl"
              >
                Start Your Custom Order
                <ArrowRight className="ml-2" />
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </section>

      {/* Theme Categories Section */}
      <section className="py-20 bg-stone-50">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Shop by Theme
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Find the perfect art for every passion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Automotive */}
            <LocalizedClientLink href="/categories/automotive" className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-orange-800"></div>
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614162692292-7ac56d7f367e?w=600')` }}
                ></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <span className="text-4xl mb-2">🚗</span>
                  <h3 className="text-2xl font-bold mb-1">Automotive</h3>
                  <p className="text-white/80 text-sm">Classic cars, motorcycles & racing</p>
                </div>
              </div>
            </LocalizedClientLink>

            {/* Aviation */}
            <LocalizedClientLink href="/categories/aviation" className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-900 to-blue-800"></div>
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600')` }}
                ></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <span className="text-4xl mb-2">✈️</span>
                  <h3 className="text-2xl font-bold mb-1">Aviation</h3>
                  <p className="text-white/80 text-sm">Aircraft & aerospace blueprints</p>
                </div>
              </div>
            </LocalizedClientLink>

            {/* Ocean & Nature */}
            <LocalizedClientLink href="/categories/ocean-nature" className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-emerald-800"></div>
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600')` }}
                ></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <span className="text-4xl mb-2">🌊</span>
                  <h3 className="text-2xl font-bold mb-1">Ocean & Nature</h3>
                  <p className="text-white/80 text-sm">Waves, marine life & landscapes</p>
                </div>
              </div>
            </LocalizedClientLink>

            {/* Family & Love */}
            <LocalizedClientLink href="/categories/family-love" className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-900 to-pink-800"></div>
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600')` }}
                ></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <span className="text-4xl mb-2">❤️</span>
                  <h3 className="text-2xl font-bold mb-1">Family & Love</h3>
                  <p className="text-white/80 text-sm">Portraits, pets & memories</p>
                </div>
              </div>
            </LocalizedClientLink>
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-20 bg-white">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Perfect for Every Occasion
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Meaningful gifts that last forever
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Anniversary", icon: "💕", href: "/collections/anniversary" },
              { name: "Memorial", icon: "🕊️", href: "/collections/memorial" },
              { name: "Wedding", icon: "💒", href: "/collections/wedding" },
              { name: "Birthday", icon: "🎂", href: "/collections/birthday" },
              { name: "Father's Day", icon: "👔", href: "/collections/fathers-day" },
              { name: "Mother's Day", icon: "💐", href: "/collections/mothers-day" },
            ].map((occasion) => (
              <LocalizedClientLink 
                key={occasion.name} 
                href={occasion.href}
                className="group text-center p-6 rounded-xl bg-stone-50 hover:bg-indigo-50 border border-stone-100 hover:border-indigo-200 transition-all duration-300"
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{occasion.icon}</div>
                <h3 className="font-medium text-stone-900 group-hover:text-indigo-700">{occasion.name}</h3>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="content-container">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-4xl mb-4 block">✉️</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the LineVibes Community
            </h2>
            <p className="text-indigo-200 mb-8 text-lg">
              Be the first to know about new designs, limited editions, and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 w-full max-w-md transition-all duration-300"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-100 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero

