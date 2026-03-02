
"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button, Input, Container, Heading, Text } from "@medusajs/ui"
import { Plus, Trash2, RefreshCw, Layers, Type, List } from "lucide-react"

interface LegendItem {
  id: string
  label: string
  value: string
}

interface CustomPreviewProps {
  product: any
  region: any
}

const CustomPreview: React.FC<CustomPreviewProps> = ({ product, region }) => {
  const [title, setTitle] = useState(product?.title || "PORSCHE 718 SPYDER")
  const [subtitle, setSubtitle] = useState("2019 - 2023 PERFORMANCE ROADSTER")
  const [legendItems, setLegendItems] = useState<LegendItem[]>([
    { id: "1", label: "Engine", value: "4.0L Flat-6" },
    { id: "2", label: "Power", value: "414 hp" },
    { id: "3", label: "Top Speed", value: "188 mph" },
  ])
  
  // 优先使用 thumbnail，如果为空则使用第一张图片
  const baseImageUrl = product?.thumbnail || product?.images?.[0]?.url || ""
  const [previewUrl, setPreviewUrl] = useState<string>(baseImageUrl)
  const [isRendering, setIsRendering] = useState(false)
  const [activeTab, setActiveTab] = useState<"text" | "legend" | "options">("text")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Real Canvas Rendering Logic
  const handleUpdateRendering = async () => {
    setIsRendering(true)
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const baseImg = new window.Image()
    baseImg.crossOrigin = "anonymous"
    baseImg.src = baseImageUrl 
    
    baseImg.onload = () => {
      canvas.width = 1200
      canvas.height = 1600
      
      // Draw Blueprint Background
      ctx.fillStyle = "#0B1120" // linevibes-dark
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw Car Image (Centered)
      const scale = Math.min(canvas.width / baseImg.width, canvas.height / baseImg.height) * 0.8
      const x = (canvas.width - baseImg.width * scale) / 2
      const y = (canvas.height - baseImg.height * scale) / 2
      ctx.drawImage(baseImg, x, y, baseImg.width * scale, baseImg.height * scale)

      // Styling for text
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.textAlign = "right"
      
      // Draw Title
      ctx.font = "bold 60px 'Inter', sans-serif"
      ctx.fillText(title.toUpperCase(), canvas.width - 80, 120)

      // Draw Subtitle
      ctx.font = "30px 'Inter', sans-serif"
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      ctx.fillText(subtitle.toUpperCase(), canvas.width - 80, 170)

      // Draw Legend
      ctx.textAlign = "left"
      legendItems.forEach((item, index) => {
        const posY = 120 + (index * 80)
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
        ctx.font = "14px 'Inter', sans-serif"
        ctx.fillText(item.label.toUpperCase(), 80, posY)
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.font = "bold 24px 'Inter', sans-serif"
        ctx.fillText(item.value.toUpperCase(), 80, posY + 35)
      })

      setPreviewUrl(canvas.toDataURL("image/png"))
      setIsRendering(false)
    }
  }

  const addLegendItem = () => {
    setLegendItems([...legendItems, { id: Date.now().toString(), label: "New Spec", value: "Value" }])
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#020617] text-white w-full">
      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Left: Interactive Preview */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 border-r border-white/5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0f172a] to-[#020617]">
        <div className="relative w-full max-w-[800px] aspect-[3/4] group transition-all duration-500 hover:scale-[1.01]">
          <div className="absolute -inset-4 bg-linevibes-blue/10 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <Container className="relative h-full w-full bg-[#0B1120] border-white/10 overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Live Preview" 
                className={`w-full h-full object-contain p-8 transition-all duration-700 ${isRendering ? 'blur-sm scale-95 opacity-50' : 'blur-0 scale-100 opacity-100'}`}
              />
            ) : (
              <div className="text-ui-fg-muted animate-pulse">Loading Artwork Base...</div>
            )}
            {isRendering && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
                <RefreshCw className="animate-spin h-10 w-10 text-linevibes-blue mb-4" />
                <Text className="text-white font-medium tracking-widest animate-pulse">RENDERING BLUEPRINT</Text>
              </div>
            )}
          </Container>
        </div>
      </div>

      {/* Right: Customization Controls */}
      <div className="w-full lg:w-[480px] h-screen overflow-y-auto bg-black/40 backdrop-blur-3xl border-l border-white/10 p-8 flex flex-col gap-y-8">
        <div className="pt-8">
          <Heading level="h1" className="text-3xl font-bold tracking-tighter text-white mb-2 uppercase">
            Customize Artwork
          </Heading>
          <Text className="text-ui-fg-muted italic">Configure your unique line art blueprint.</Text>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl gap-x-1">
          {[
            { id: "text", icon: Type, label: "Typography" },
            { id: "legend", icon: List, label: "Legend" },
            { id: "options", icon: Layers, label: "Style" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-x-2 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-linevibes-blue text-white shadow-lg shadow-linevibes-blue/20" : "text-ui-fg-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === "text" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-linevibes-blue ml-1">Artwork Title</label>
                <Input 
                  className="bg-white/5 border-white/10 text-white h-12 focus:border-linevibes-blue/50 transition-all font-medium"
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-linevibes-blue ml-1">Subtitle / Description</label>
                <Input 
                  className="bg-white/5 border-white/10 text-white h-12 focus:border-linevibes-blue/50 transition-all"
                  value={subtitle} 
                  onChange={(e) => setSubtitle(e.target.value)} 
                />
              </div>
            </div>
          )}

          {activeTab === "legend" && (
            <div className="space-y-4 animate-in fade-in duration-500">
               {legendItems.map((item, index) => (
                 <div key={item.id} className="group bg-white/5 p-4 rounded-xl border border-white/5 hover:border-linevibes-blue/30 transition-all relative">
                    <div className="flex gap-x-2 mb-2">
                      <Input 
                        className="bg-white/5 border-white/10 text-[10px] h-8 font-bold uppercase tracking-tighter"
                        value={item.label} 
                        onChange={(e) => {
                          const newItems = [...legendItems]; newItems[index].label = e.target.value; setLegendItems(newItems)
                        }}
                      />
                      <button 
                        onClick={() => setLegendItems(items => items.filter(i => i.id !== item.id))}
                        className="p-1 text-ui-fg-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <Input 
                      className="bg-white/5 border-white/10 text-sm h-10"
                      value={item.value} 
                      onChange={(e) => {
                        const newItems = [...legendItems]; newItems[index].value = e.target.value; setLegendItems(newItems)
                      }}
                    />
                 </div>
               ))}
               <button 
                onClick={addLegendItem}
                className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-ui-fg-muted hover:border-linevibes-blue/50 hover:text-linevibes-blue transition-all flex items-center justify-center gap-x-2"
               >
                 <Plus size={18} />
                 Add Specification
               </button>
            </div>
          )}

          {activeTab === "options" && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-linevibes-blue ml-1">Color Theme</label>
                   <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#0B1120] border-2 border-linevibes-blue cursor-pointer shadow-lg shadow-linevibes-blue/20"></div>
                      <div className="w-8 h-8 rounded-full bg-black border border-white/10 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-white border border-white/10 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-red-900 border border-white/10 cursor-pointer"></div>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Global Action */}
        <div className="mt-6 flex flex-col gap-y-4 pb-12">
          <Button 
            onClick={handleUpdateRendering}
            variant="secondary"
            className="w-full h-14 bg-white/5 hover:bg-white/10 border-white/10 text-white font-bold tracking-widest"
          >
            UPDATE RENDERING
          </Button>
          
          <div className="h-px bg-white/10 w-full my-2"></div>

          <div className="flex justify-between items-end mb-2">
            <div className="space-y-1">
              <Text className="text-ui-fg-muted text-xs uppercase tracking-widest font-bold">Base Price</Text>
              <Text className="text-2xl font-bold tracking-tighter text-white">
                {product?.variants?.[0]?.calculated_price?.calculated_amount 
                  ? `${product.variants[0].calculated_price.currency_code.toUpperCase()} ${product.variants[0].calculated_price.calculated_amount}`
                  : "$149.00 USD"}
              </Text>
            </div>
            <div className="text-right">
              <Text className="text-linevibes-blue text-[10px] font-bold uppercase">Artist Quality Guarantee</Text>
            </div>
          </div>

          <Button 
            size="large" 
            className="w-full h-16 bg-linevibes-blue hover:bg-blue-500 text-lg font-bold shadow-[0_0_30px_rgba(0,87,217,0.3)] transition-all"
          >
            ADD TO COLLECTION
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CustomPreview
