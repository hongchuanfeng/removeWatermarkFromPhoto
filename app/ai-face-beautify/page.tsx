'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Custom CSS for sliders
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider::-webkit-slider-thumb:hover {
    background: #2563eb;
    transform: scale(1.1);
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider::-moz-range-thumb:hover {
    background: #2563eb;
  }
`

export default function AIFaceBeautifyPage() {
  const { t } = useLanguage()

  // Inject custom styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = sliderStyles
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [whitening, setWhitening] = useState<number>(50)
  const [skinSmooth, setSkinSmooth] = useState<number>(50)
  const [faceSlim, setFaceSlim] = useState<number>(50)
  const [eyeEnlarge, setEyeEnlarge] = useState<number>(50)
  const [user, setUser] = useState<any>(null)
  const [userCredits, setUserCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUserAndCredits = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('credits')
          .eq('id', user.id)
          .single()

        if (data && !error) {
          setUserCredits(data.credits)
        }
      }

      setLoading(false)
    }

    getUserAndCredits()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase
          .from('users')
          .select('credits')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (data && !error) {
              setUserCredits(data.credits)
            }
          })
      } else {
        setUserCredits(0)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setProcessedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProcess = async () => {
    if (!selectedImage) return

    // 清除之前的错误
    setError(null)

    // 检查用户是否登录
    if (!user) {
      setError(t('ai_face_beautify.login_message') || 'Please log in to use this feature.')
      return
    }

    // 检查用户是否有足够的积分
    if (userCredits < 1) {
      setError(t('ai_face_beautify.credits_message') || 'You need at least 1 credit to use this feature.')
      return
    }

    setIsProcessing(true)

    const requestData = {
      imageUrl: selectedImage,
      whitening,
      skinSmooth,
      faceSlim,
      eyeEnlarge,
      userId: user.id,
    }

    console.log('=== Frontend AI Face Beautify Request ===')
    console.log('Request data:', {
      imageUrl: selectedImage.substring(0, 100) + '...',
      whitening,
      skinSmooth,
      faceSlim,
      eyeEnlarge,
      userId: user.id,
    })

    try {
      const response = await fetch('/api/ai-face-beautify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Processing failed')
      }

      const data = await response.json()

      console.log('Response data:', {
        success: data.success,
        message: data.message,
        resultImageLength: data.resultImage ? data.resultImage.length : 0,
        resultImagePreview: data.resultImage ? data.resultImage.substring(0, 100) + '...' : 'N/A'
      })

      setProcessedImage(data.resultImage)

      // 更新本地积分
      setUserCredits(prev => prev - 1)

    } catch (error) {
      console.error('Processing error:', error)
      setError(error instanceof Error ? error.message : 'Processing failed, please try again')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImage) return

    const link = document.createElement('a')
    link.href = processedImage
    link.download = 'beautified-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('ai_face_beautify.title') || 'AI Face Beautify'}
          </h1>
          <p className="text-xl text-gray-600">
            {t('ai_face_beautify.description') || 'Enhance your photos with AI-powered facial beautification technology'}
          </p>

          {/* User Info */}
          {user ? (
            <div className="bg-white rounded-lg shadow-md p-4 inline-block border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{t('ai_face_beautify.available_credits') || 'Available Credits'}:</span>
                  <span className="ml-2 font-bold text-primary-600">{userCredits}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {t('ai_face_beautify.processing_cost') || 'Cost: 1 credit per use'}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800">{t('ai_face_beautify.login_required') || 'Login Required'}</p>
                  <p className="text-sm text-yellow-700">{t('ai_face_beautify.login_message') || 'Please log in to use the AI Face Beautify feature.'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Insufficient Credits Warning */}
          {user && userCredits < 1 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 inline-block mt-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="font-medium text-red-800">{t('ai_face_beautify.insufficient_credits') || 'Insufficient Credits'}</p>
                  <p className="text-sm text-red-700">{t('ai_face_beautify.credits_message') || 'You need at least 1 credit to use this feature. Please subscribe to get more credits.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
            {/* Left Column - Upload */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 h-full flex flex-col">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                  {t('ai_face_beautify.upload_title') || 'Upload Your Photo'}
                </h2>

                {!selectedImage ? (
                  !user ? (
                    <div className="h-64 md:h-80 border-2 border-dashed border-gray-300 rounded-xl p-8 md:p-12 text-center flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <svg className="mx-auto h-16 w-16 md:h-20 md:w-20 mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <p className="text-xl md:text-2xl mb-3 font-medium text-gray-700">
                          {t('ai_face_beautify.login_required') || 'Login Required'}
                        </p>
                        <p className="text-sm md:text-base text-gray-600">
                          {t('ai_face_beautify.login_message') || 'Please log in to use the AI Face Beautify feature.'}
                        </p>
                      </div>
                    </div>
                  ) : userCredits < 1 ? (
                    <div className="h-64 md:h-80 border-2 border-dashed border-gray-300 rounded-xl p-8 md:p-12 text-center flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <svg className="mx-auto h-16 w-16 md:h-20 md:w-20 mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <p className="text-xl md:text-2xl mb-3 font-medium text-gray-700">
                          {t('ai_face_beautify.insufficient_credits') || 'Insufficient Credits'}
                        </p>
                        <p className="text-sm md:text-base text-gray-600">
                          {t('ai_face_beautify.credits_message') || 'You need at least 1 credit to use this feature. Please subscribe to get more credits.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="h-64 md:h-80 border-2 border-dashed border-gray-300 rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group flex items-center justify-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-gray-500 group-hover:text-primary-600 transition-colors">
                        <svg className="mx-auto h-16 w-16 md:h-20 md:w-20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-xl md:text-2xl mb-3 font-medium">
                          {t('ai_face_beautify.click_to_upload') || 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm md:text-base text-gray-400">
                          {t('ai_face_beautify.supported_formats') || 'PNG, JPG, JPEG up to 10MB'}
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="space-y-6">
                    <div className="relative group">
                      <img
                        src={selectedImage}
                        alt="Original"
                        className="w-full h-64 md:h-80 object-contain rounded-xl shadow-md"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-3 right-3 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Beautify Settings */}
                    <div className="space-y-6 bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                        {t('ai_face_beautify.beautify_settings') || 'Beautify Settings'}
                      </h3>

                      {/* Whitening Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">
                            {t('ai_face_beautify.whitening') || 'Whitening'}
                          </label>
                          <span className="text-sm font-semibold text-gray-900">{whitening}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={whitening}
                          onChange={(e) => setWhitening(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0</span>
                          <span>100</span>
                        </div>
                      </div>

                      {/* Skin Smooth Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">
                            {t('ai_face_beautify.skin_smooth') || 'Skin Smooth'}
                          </label>
                          <span className="text-sm font-semibold text-gray-900">{skinSmooth}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skinSmooth}
                          onChange={(e) => setSkinSmooth(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0</span>
                          <span>100</span>
                        </div>
                      </div>

                      {/* Face Slim Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">
                            {t('ai_face_beautify.face_slim') || 'Face Slim'}
                          </label>
                          <span className="text-sm font-semibold text-gray-900">{faceSlim}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={faceSlim}
                          onChange={(e) => setFaceSlim(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0</span>
                          <span>100</span>
                        </div>
                      </div>

                      {/* Eye Enlarge Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">
                            {t('ai_face_beautify.eye_enlarge') || 'Eye Enlarge'}
                          </label>
                          <span className="text-sm font-semibold text-gray-900">{eyeEnlarge}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={eyeEnlarge}
                          onChange={(e) => setEyeEnlarge(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <div>
                            <p className="font-medium text-red-800">{t('ai_face_beautify.error_title') || 'Error'}</p>
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Process Button */}
                    {!user ? (
                      <div className="w-full bg-gray-200 text-gray-500 py-4 px-6 rounded-xl font-semibold text-lg text-center">
                        {t('ai_face_beautify.login_required') || 'Login Required'}
                      </div>
                    ) : userCredits < 1 ? (
                      <div className="w-full bg-gray-200 text-gray-500 py-4 px-6 rounded-xl font-semibold text-lg text-center">
                        {t('ai_face_beautify.insufficient_credits') || 'Insufficient Credits'}
                      </div>
                    ) : (
                      <button
                        onClick={handleProcess}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center">
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            {t('ai_face_beautify.processing') || 'Processing...'}
                          </div>
                        ) : (
                          t('ai_face_beautify.process') || 'Beautify Image'
                        )}
                      </button>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Center Column - Before/After Comparison */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 h-full flex flex-col">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                  {t('ai_face_beautify.result') || 'Before & After'}
                </h2>

                {!selectedImage ? (
                  <div className="h-64 md:h-96 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 bg-gray-50">
                    <div className="text-center p-6">
                      <svg className="mx-auto h-16 w-16 md:h-20 md:w-20 mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg md:text-xl font-medium">
                        {t('ai_face_beautify.upload_prompt') || 'Upload an image to see the beautification preview'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Before/After Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Before */}
                      <div className="space-y-3">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {t('ai_face_beautify.before') || 'Before'}
                          </h3>
                          <div className="relative aspect-square overflow-hidden rounded-xl shadow-md bg-gray-100">
                            <img
                              src={selectedImage}
                              alt="Before beautification"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>

                      {/* After */}
                      <div className="space-y-3">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {t('ai_face_beautify.after') || 'After'}
                          </h3>
                          <div className="relative aspect-square overflow-hidden rounded-xl shadow-md bg-gray-100">
                            {processedImage ? (
                              <img
                                src={processedImage}
                                alt="After beautification"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                {isProcessing ? (
                                  <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-sm font-medium">
                                      {t('ai_face_beautify.processing') || 'Processing...'}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="text-center p-4">
                                    <svg className="mx-auto h-12 w-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm font-medium">
                                      {t('ai_face_beautify.result_placeholder') || 'Result will appear here'}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    {processedImage && (
                      <div className="text-center pt-4 border-t border-gray-200">
                        <button
                          onClick={handleDownload}
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-8 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {t('ai_face_beautify.download') || 'Download Result'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              {t('ai_face_beautify.features_title') || 'Key Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.features_ai') || 'Advanced AI Technology'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('ai_face_beautify.features_ai_desc') || 'Powered by Tencent Cloud AI for natural facial enhancement'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.features_quality') || 'High Quality Output'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('ai_face_beautify.features_quality_desc') || 'Maintain image quality while enhancing facial features'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.features_fast') || 'Fast Processing'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('ai_face_beautify.features_fast_desc') || 'Get beautiful results in seconds with our optimized AI models'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.features_custom') || 'Customizable Intensity'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('ai_face_beautify.features_custom_desc') || 'Choose from light, medium, or strong beautification levels'}
                </p>
              </div>
            </div>
          </div>

          {/* How to Use Section */}
          <div className="mt-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              {t('ai_face_beautify.how_to_use_title') || 'How to Use'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.how_to_use_step1') || 'Upload Your Photo'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('ai_face_beautify.how_to_use_step1_desc') || 'Select a clear, high-quality photo of a person'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.how_to_use_step2') || 'Choose Beautify Level'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('ai_face_beautify.how_to_use_step2_desc') || 'Select light, medium, or strong enhancement level'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.how_to_use_step3') || 'Process Image'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('ai_face_beautify.how_to_use_step3_desc') || 'Click "Beautify Image" and wait for AI processing'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.how_to_use_step4') || 'Download Result'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('ai_face_beautify.how_to_use_step4_desc') || 'Download your beautified photo'}
                </p>
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('ai_face_beautify.examples_title') || 'Examples'}
              </h2>
              <p className="text-xl text-gray-600">
                {t('ai_face_beautify.examples_desc') || 'See how our AI enhances facial features at different levels'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Example 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-900 text-center">{t('ai_face_beautify.example1_title') || 'Example 1'}</h3>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-4">
                    <div className="aspect-square overflow-hidden rounded-lg mb-2">
                      <img
                        src="/face/b1.png"
                        alt="Before face beautify example 1"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-gray-500 text-sm text-center block">{t('ai_face_beautify.examples_before') || 'Before'}</span>
                  </div>
                  <div className="p-4">
                    <div className="aspect-square overflow-hidden rounded-lg mb-2">
                      <img
                        src="/face/a1.png"
                        alt="After face beautify example 1"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-gray-500 text-sm text-center block">{t('ai_face_beautify.examples_after') || 'After'}</span>
                  </div>
                </div>
              </div>

              {/* Example 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-900 text-center">{t('ai_face_beautify.example2_title') || 'Example 2'}</h3>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-4">
                    <div className="aspect-square overflow-hidden rounded-lg mb-2">
                      <img
                        src="/face/b2.png"
                        alt="Before face beautify example 2"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-gray-500 text-sm text-center block">{t('ai_face_beautify.examples_before') || 'Before'}</span>
                  </div>
                  <div className="p-4">
                    <div className="aspect-square overflow-hidden rounded-lg mb-2">
                      <img
                        src="/face/a2.png"
                        alt="After face beautify example 2"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-gray-500 text-sm text-center block">{t('ai_face_beautify.examples_after') || 'After'}</span>
                  </div>
                </div>
              </div>

              {/* Example 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-900 text-center">{t('ai_face_beautify.example3_title') || 'Example 3'}</h3>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-4">
                    <div className="aspect-square overflow-hidden rounded-lg mb-2">
                      <img
                        src="/face/b3.png"
                        alt="Before face beautify example 3"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-gray-500 text-sm text-center block">{t('ai_face_beautify.examples_before') || 'Before'}</span>
                  </div>
                  <div className="p-4">
                    <div className="aspect-square overflow-hidden rounded-lg mb-2">
                      <img
                        src="/face/a3.png"
                        alt="After face beautify example 3"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-500 text-sm text-center block">{t('ai_face_beautify.examples_after') || 'After'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              {t('ai_face_beautify.faq_title') || 'Frequently Asked Questions'}
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.faq_q1') || 'What image formats are supported?'}
                </h3>
                <p className="text-gray-600">
                  {t('ai_face_beautify.faq_a1') || 'We support PNG, JPG, and JPEG formats. Images should be under 10MB for best results.'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.faq_q2') || 'How does the beautification work?'}
                </h3>
                <p className="text-gray-600">
                  {t('ai_face_beautify.faq_a2') || 'Our AI analyzes facial features and applies natural enhancements including skin smoothing, color correction, and feature refinement.'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.faq_q3') || 'Can I use any photo?'}
                </h3>
                <p className="text-gray-600">
                  {t('ai_face_beautify.faq_a3') || 'For best results, use clear, high-resolution photos with visible faces. Avoid heavily edited or low-quality images.'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.faq_q4') || 'Is my uploaded photo secure?'}
                </h3>
                <p className="text-gray-600">
                  {t('ai_face_beautify.faq_a4') || 'Yes, all uploads are processed securely and deleted after processing. We prioritize user privacy and data protection.'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('ai_face_beautify.faq_q5') || 'How long does processing take?'}
                </h3>
                <p className="text-gray-600">
                  {t('ai_face_beautify.faq_a5') || 'Processing typically takes 10-30 seconds depending on server load and image complexity.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
