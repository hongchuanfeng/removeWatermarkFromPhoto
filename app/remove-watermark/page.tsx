'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

interface WatermarkArea {
  x: number
  y: number
  width: number
  height: number
}

export default function RemoveWatermarkPage() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [watermarkAreas, setWatermarkAreas] = useState<WatermarkArea[]>([])
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)
  const [currentArea, setCurrentArea] = useState<WatermarkArea | null>(null)
  const [didDrag, setDidDrag] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)

      // Get user credits
      const { data: userData } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single()

      if (userData) {
        setUserCredits(userData.credits)
      } else {
        // Create user with 5 free credits
        const { error } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            credits: 5,
          })
        if (!error) {
          setUserCredits(5)
        }
      }
      setCheckingAuth(false)
    }
    checkAuth()
  }, [supabase, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setWatermarkAreas([])
      setResult(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        // Get image dimensions
        const img = new window.Image()
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height })
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(selectedFile)
      setError(null)
    }
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!preview || !imageSize || isSelecting) return
    if (didDrag) {
      // Click following a drag selection should not add another box
      setDidDrag(false)
      return
    }
    
    const img = e.currentTarget.querySelector('img')
    if (!img) return
    
    const imgRect = img.getBoundingClientRect()
    const x = e.clientX - imgRect.left
    const y = e.clientY - imgRect.top
    
    // Calculate relative position (0-1) based on actual image size
    const relX = x / imgRect.width
    const relY = y / imgRect.height
    
    // Convert to image coordinates
    const imgX = Math.round(relX * imageSize.width)
    const imgY = Math.round(relY * imageSize.height)
    
    // Add a small area around the click point (e.g., 50x50 pixels)
    const areaSize = 50
    const area: WatermarkArea = {
      x: Math.max(0, imgX - areaSize / 2),
      y: Math.max(0, imgY - areaSize / 2),
      width: areaSize,
      height: areaSize,
    }
    
    setWatermarkAreas([...watermarkAreas, area])
  }

  const handleImageMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!preview || !imageSize) return
    e.preventDefault()
    setIsSelecting(true)
    setDidDrag(false)
    const img = e.currentTarget.querySelector('img')
    if (!img) return
    
    const imgRect = img.getBoundingClientRect()
    const x = e.clientX - imgRect.left
    const y = e.clientY - imgRect.top
    setStartPos({ x, y })
  }

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting || !startPos || !preview || !imageSize) return
    
    const img = e.currentTarget.querySelector('img')
    if (!img) return
    
    const imgRect = img.getBoundingClientRect()
    const x = e.clientX - imgRect.left
    const y = e.clientY - imgRect.top
    
    const width = Math.abs(x - startPos.x)
    const height = Math.abs(y - startPos.y)
    if (width > 3 || height > 3) {
      setDidDrag(true)
    }
    const minX = Math.min(x, startPos.x)
    const minY = Math.min(y, startPos.y)
    
    // Convert to image coordinates
    const relX = minX / imgRect.width
    const relY = minY / imgRect.height
    const relWidth = width / imgRect.width
    const relHeight = height / imgRect.height
    
    setCurrentArea({
      x: Math.round(relX * imageSize.width),
      y: Math.round(relY * imageSize.height),
      width: Math.round(relWidth * imageSize.width),
      height: Math.round(relHeight * imageSize.height),
    })
  }

  const handleImageMouseUp = () => {
    if (isSelecting && currentArea && currentArea.width > 0 && currentArea.height > 0) {
      setWatermarkAreas([...watermarkAreas, currentArea])
    }
    setCurrentArea(null)
    setIsSelecting(false)
    setStartPos(null)
  }

  const removeArea = (index: number) => {
    setWatermarkAreas(watermarkAreas.filter((_, i) => i !== index))
  }

  const handleRemoveWatermark = async () => {
    if (!file) {
      setError(t('removeWatermark.selectImageError'))
      return
    }

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (userCredits === null || userCredits <= 0) {
      setError(t('removeWatermark.insufficientCredits'))
      router.push('/subscribe')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)
      
      // Send watermark areas if any
      if (watermarkAreas.length > 0) {
        // For now, send the first area (can be extended to support multiple)
        const area = watermarkAreas[0]
        formData.append('x', area.x.toString())
        formData.append('y', area.y.toString())
        formData.append('width', area.width.toString())
        formData.append('height', area.height.toString())
      }

      const response = await fetch('/api/remove-watermark', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove watermark')
      }

      setResult(data.resultUrl)
      
      // Refresh credits after successful processing
      const { data: updatedUser } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single()
      if (updatedUser) {
        setUserCredits(updatedUser.credits)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          {t('removeWatermark.title')}
        </h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">{t('removeWatermark.availableCredits')}</p>
          <p className="text-2xl font-bold text-primary-600">{userCredits ?? 0}</p>
          {userCredits !== null && userCredits <= 0 && (
            <button
              onClick={() => router.push('/subscribe')}
              className="mt-2 text-sm text-primary-600 hover:underline"
            >
              {t('removeWatermark.subscribeNow')}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('removeWatermark.uploadImage')}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[200px] flex items-center justify-center text-center hover:border-primary-500 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg
                  className="w-12 h-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-gray-600">
                  {file ? file.name : t('removeWatermark.uploadHint')}
                </span>
              </label>
            </div>
            {preview && (
              <div className="mt-4 relative">
                <div
                  ref={containerRef}
                  className="relative cursor-crosshair"
                  onClick={handleImageClick}
                  onMouseDown={handleImageMouseDown}
                  onMouseMove={handleImageMouseMove}
                  onMouseUp={handleImageMouseUp}
                  onMouseLeave={handleImageMouseUp}
                >
                  <img
                    ref={imageRef}
                    src={preview}
                    alt="Preview"
                    className="rounded-lg max-w-full h-auto"
                    style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
                  />
                  {/* Render selected areas */}
                  {imageSize && imageRef.current && (
                    <div className="absolute inset-0 pointer-events-none">
                      {watermarkAreas.map((area, index) => {
                        const imgRect = imageRef.current?.getBoundingClientRect()
                        if (!imgRect) return null
                        
                        const scaleX = imgRect.width / imageSize.width
                        const scaleY = imgRect.height / imageSize.height
                        
                        return (
                          <div
                            key={index}
                            className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20 pointer-events-auto"
                            style={{
                              left: `${area.x * scaleX}px`,
                              top: `${area.y * scaleY}px`,
                              width: `${area.width * scaleX}px`,
                              height: `${area.height * scaleY}px`,
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeArea(index)
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                            >
                              ×
                            </button>
                          </div>
                        )
                      })}
                      {currentArea && isSelecting && currentArea.width > 0 && currentArea.height > 0 && imageSize && imageRef.current && (
                        <div
                          className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 pointer-events-none"
                          style={{
                            left: `${(currentArea.x / imageSize.width) * imageRef.current.getBoundingClientRect().width}px`,
                            top: `${(currentArea.y / imageSize.height) * imageRef.current.getBoundingClientRect().height}px`,
                            width: `${(currentArea.width / imageSize.width) * imageRef.current.getBoundingClientRect().width}px`,
                            height: `${(currentArea.height / imageSize.height) * imageRef.current.getBoundingClientRect().height}px`,
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
                {watermarkAreas.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {t('removeWatermark.selectedAreas')}: {watermarkAreas.length}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {t('removeWatermark.clickHint')}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('removeWatermark.result')}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[200px] flex items-center justify-center">
              {loading ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">{t('removeWatermark.processing')}</p>
                </div>
              ) : result ? (
                <div>
                  <Image
                    src={result}
                    alt="Result"
                    width={400}
                    height={400}
                    className="rounded-lg max-w-full h-auto"
                  />
                  <a
                    href={result}
                    download
                    className="mt-4 block bg-primary-600 text-white px-6 py-2 rounded-lg text-center hover:bg-primary-700 transition"
                  >
                    {t('removeWatermark.downloadResult')}
                  </a>
                </div>
              ) : (
                <p className="text-gray-400">{t('removeWatermark.resultPlaceholder')}</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={handleRemoveWatermark}
            disabled={!file || loading}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('removeWatermark.processing') : t('removeWatermark.removeButton')}
          </button>
        </div>
      </div>
    </div>
  )
}
