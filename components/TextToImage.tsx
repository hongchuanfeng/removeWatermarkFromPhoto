'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useRef } from 'react'

const FONT_SIZES = [16, 24, 32, 48, 64, 72, 96, 128]
const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#000080',
  '#FFC0CB', '#A52A2A', '#808080', '#FFD700'
]

const BACKGROUNDS = [
  'transparent',
  '#FFFFFF',
  '#000000',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FFC0CB',
]

export default function TextToImage() {
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const [fontSize, setFontSize] = useState(48)
  const [textColor, setTextColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('transparent')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateImage = () => {
    if (!text) return
    setIsGenerating(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.font = `bold ${fontSize}px "Microsoft YaHei", "SimHei", sans-serif`
    
    const lines = text.split('\n')
    const lineHeight = fontSize * 1.4
    const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width))
    
    const padding = fontSize
    const canvasWidth = Math.ceil(maxWidth + padding * 2)
    const canvasHeight = Math.ceil(lines.length * lineHeight + padding * 2)
    
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    if (backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    }

    ctx.font = `bold ${fontSize}px "Microsoft YaHei", "SimHei", sans-serif`
    ctx.fillStyle = textColor
    ctx.textBaseline = 'top'
    
    lines.forEach((line, index) => {
      const x = padding
      const y = padding + index * lineHeight
      ctx.fillText(line, x, y)
    })

    const dataUrl = canvas.toDataURL('image/png')
    setGeneratedImage(dataUrl)
    setIsGenerating(false)
  }

  const handleDownload = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.download = 'text-to-image.png'
    link.href = generatedImage
    link.click()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('nav.text_to_image')}</h1>
        <p className="text-lg text-gray-600">{t('text_to_image.description')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">{t('text_to_image.enter_text')}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('text_to_image.placeholder')}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-900"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">{t('text_to_image.font_size') || '字体大小'}</label>
          <div className="flex flex-wrap gap-2">
            {FONT_SIZES.map(size => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-4 py-2 rounded-lg border transition ${
                  fontSize === size
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-gray-300 text-gray-700 hover:border-primary-500'
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">{t('text_to_image.text_color') || '文字颜色'}</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setTextColor(color)}
                className={`w-8 h-8 rounded-lg border-2 transition ${
                  textColor === color ? 'border-primary-600 ring-2 ring-primary-200' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">{t('text_to_image.background') || '背景颜色'}</label>
          <div className="flex flex-wrap gap-2">
            {BACKGROUNDS.map(bg => (
              <button
                key={bg}
                onClick={() => setBackgroundColor(bg)}
                className={`w-8 h-8 rounded-lg border-2 transition ${
                  backgroundColor === bg ? 'border-primary-600 ring-2 ring-primary-200' : 'border-gray-300'
                }`}
                style={{ backgroundColor: bg === 'transparent' ? '#fff' : bg, backgroundImage: bg === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none', backgroundSize: bg === 'transparent' ? '8px 8px' : 'auto', backgroundPosition: bg === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto' }}
                title={bg === 'transparent' ? '透明' : bg}
              />
            ))}
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <label className="block text-gray-700 mb-2">{t('text_to_image.preview') || '预览'}</label>
          <div 
            className="min-h-[60px] flex items-center justify-center p-4 rounded"
            style={{ 
              fontSize: `${fontSize}px`, 
              color: textColor,
              backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
              fontFamily: '"Microsoft YaHei", "SimHei", sans-serif',
              fontWeight: 'bold'
            }}
          >
            {text || t('text_to_image.placeholder')}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={generateImage}
            disabled={isGenerating || !text}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {isGenerating ? t('text_to_image.generating') : t('text_to_image.generate')}
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {generatedImage && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{t('text_to_image.result')}</h3>
            <div className="flex justify-center mb-6">
              <img src={generatedImage} alt="Generated" className="max-w-full rounded-lg border border-gray-200" />
            </div>
            <div className="flex justify-center">
              <button onClick={handleDownload} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                {t('text_to_image.download')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
