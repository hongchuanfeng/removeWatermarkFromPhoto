'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useRef } from 'react'

type RemoveMode = 'auto' | 'color'

export default function RemoveBackground() {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [removeMode, setRemoveMode] = useState<RemoveMode>('auto')
  const [tolerance, setTolerance] = useState(30)
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getEdgeColor = (imageData: ImageData): { r: number; g: number; b: number } => {
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height
    
    // 采样四个角落的颜色
    const corners = [
      { x: 0, y: 0 },
      { x: width - 1, y: 0 },
      { x: 0, y: height - 1 },
      { x: width - 1, y: height - 1 }
    ]
    
    let totalR = 0, totalG = 0, totalB = 0
    
    corners.forEach(corner => {
      const idx = (corner.y * width + corner.x) * 4
      totalR += data[idx]
      totalG += data[idx + 1]
      totalB += data[idx + 2]
    })
    
    return {
      r: Math.round(totalR / 4),
      g: Math.round(totalG / 4),
      b: Math.round(totalB / 4)
    }
  }

  const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number => {
    return Math.sqrt(
      Math.pow(r1 - r2, 2) +
      Math.pow(g1 - g2, 2) +
      Math.pow(b1 - b2, 2)
    )
  }

  const removeBackground = (imageSrc: string, mode: RemoveMode, tol: number, color: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }
        
        ctx.drawImage(img, 0, 0)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // 确定要移除的目标颜色
        let targetR: number, targetG: number, targetB: number
        
        if (mode === 'color') {
          // 使用用户选择的颜色
          const hex = color.replace('#', '')
          targetR = parseInt(hex.substring(0, 2), 16)
          targetG = parseInt(hex.substring(2, 4), 16)
          targetB = parseInt(hex.substring(4, 6), 16)
        } else {
          // 自动检测边缘颜色
          const edgeColor = getEdgeColor(imageData)
          targetR = edgeColor.r
          targetG = edgeColor.g
          targetB = edgeColor.b
        }
        
        // 使用 flood fill 算法的简化版本 - 从边缘开始填充
        const visited = new Set<string>()
        const width = canvas.width
        const height = canvas.height
        
        // 从四个边缘开始 BFS 搜索背景区域
        const queue: { x: number; y: number }[] = []
        
        // 添加所有边缘点到队列
        for (let x = 0; x < width; x++) {
          queue.push({ x, y: 0 })
          queue.push({ x, y: height - 1 })
        }
        for (let y = 0; y < height; y++) {
          queue.push({ x: 0, y })
          queue.push({ x: width - 1, y })
        }
        
        const maxDistance = tol * 3 // 将容差转换为颜色距离
        
        // BFS 标记背景像素
        while (queue.length > 0) {
          const { x, y } = queue.shift()!
          const key = `${x},${y}`
          
          if (visited.has(key)) continue
          if (x < 0 || x >= width || y < 0 || y >= height) continue
          
          const idx = (y * width + x) * 4
          const r = data[idx]
          const g = data[idx + 1]
          const b = data[idx + 2]
          
          const dist = colorDistance(r, g, b, targetR, targetG, targetB)
          
          if (dist <= maxDistance) {
            visited.add(key)
            
            // 将相邻点加入队列
            queue.push({ x: x + 1, y })
            queue.push({ x: x - 1, y })
            queue.push({ x, y: y + 1 })
            queue.push({ x, y: y - 1 })
          }
        }
        
        // 将所有背景像素设为透明
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const key = `${x},${y}`
            if (visited.has(key)) {
              const idx = (y * width + x) * 4
              data[idx + 3] = 0 // 设为透明
            }
          }
        }
        
        ctx.putImageData(imageData, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = imageSrc
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        setProcessedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProcess = async () => {
    if (!selectedImage) return
    
    setIsProcessing(true)
    
    try {
      const result = await removeBackground(selectedImage, removeMode, tolerance, selectedColor)
      setProcessedImage(result)
    } catch (error) {
      console.error('Background removal failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImage) return
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
    const link = document.createElement('a')
    link.download = `${nameWithoutExt}_no_bg.png`
    link.href = processedImage
    link.click()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('nav.remove_background')}</h1>
        <p className="text-lg text-gray-600">{t('remove_background.description')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {!selectedImage ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary-500 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-lg text-gray-600">{t('remove_background.upload')}</p>
            <p className="mt-2 text-sm text-gray-500">{t('remove_background.supported')}</p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <img src={selectedImage} alt="Selected" className="max-w-full max-h-96 rounded-lg" />
            </div>

            {/* 选项 */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <label className="text-gray-700">{t('remove_background.mode') || '模式'}:</label>
                <select 
                  value={removeMode}
                  onChange={(e) => { setRemoveMode(e.target.value as RemoveMode); setProcessedImage(null); }}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="auto">{t('remove_background.auto') || '自动检测'}</option>
                  <option value="color">{t('remove_background.color') || '选择颜色'}</option>
                </select>
              </div>
              
              {removeMode === 'color' && (
                <div className="flex items-center justify-center gap-4">
                  <label className="text-gray-700">{t('remove_background.select_color') || '选择颜色'}:</label>
                  <input 
                    type="color"
                    value={selectedColor}
                    onChange={(e) => { setSelectedColor(e.target.value); setProcessedImage(null); }}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-center gap-4">
                <label className="text-gray-700">{t('remove_background.tolerance') || '容差'}:</label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={tolerance}
                  onChange={(e) => { setTolerance(Number(e.target.value)); setProcessedImage(null); }}
                  className="w-48"
                />
                <span className="text-gray-600">{tolerance}</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => { setSelectedImage(null); setProcessedImage(null); }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                {t('common.clear')}
              </button>
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {isProcessing ? t('remove_background.processing') : t('remove_background.remove')}
              </button>
            </div>
          </div>
        )}

        {processedImage && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{t('remove_background.result')}</h3>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img src={processedImage} alt="Processed" className="max-w-full max-h-96 rounded-lg" />
                <div className="absolute inset-0 bg-gray-200 -z-10 rounded-lg" />
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                {t('remove_background.download')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

