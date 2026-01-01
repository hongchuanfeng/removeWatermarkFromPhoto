'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function GenderSwapperPage() {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [targetGender, setTargetGender] = useState<'male' | 'female'>('male')
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [userCredits, setUserCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)
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

    // 检查用户是否登录
    if (!user) {
      return
    }

    // 检查用户是否有足够的积分
    if (userCredits < 1) {
      return
    }

    setIsProcessing(true)
    setError(null) // 清除之前的错误
    try {
      const response = await fetch('/api/gender-swapper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: selectedImage,
          targetGender: targetGender,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Processing failed')
      }

      const data = await response.json()
      console.log('Success response data:', data)
      console.log('Result image data (first 100 chars):', data.resultImage ? data.resultImage.substring(0, 100) : 'null')

      setProcessedImage(data.resultImage)

      // 更新本地积分
      setUserCredits(prev => prev - 1)

    } catch (error) {
      console.error('Processing error:', error)
      setError(error instanceof Error ? error.message : '处理失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImage) return

    const link = document.createElement('a')
    link.href = processedImage
    link.download = 'gender-swapped-image.png'
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
            {t('gender_swapper.title') || 'Gender Swapper'}
          </h1>
          <p className="text-xl text-gray-600">
            {t('gender_swapper.description') || 'Transform your photos with AI-powered gender modification technology'}
          </p>

          {/* User Info */}
          {user ? (
            <div className="bg-white rounded-lg shadow-md p-4 inline-block border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{t('gender_swapper.available_credits') || 'Available Credits'}:</span>
                  <span className="ml-2 font-bold text-primary-600">{userCredits}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {t('gender_swapper.processing_cost') || 'Cost: 1 credit per use'}
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
                  <p className="font-medium text-yellow-800">{t('gender_swapper.login_required') || 'Login Required'}</p>
                  <p className="text-sm text-yellow-700">{t('gender_swapper.login_message') || 'Please log in to use the Gender Swapper feature.'}</p>
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
                  <p className="font-medium text-red-800">{t('gender_swapper.insufficient_credits') || 'Insufficient Credits'}</p>
                  <p className="text-sm text-red-700">{t('gender_swapper.credits_message') || 'You need at least 1 credit to use this feature. Please subscribe to get more credits.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Upload and Controls */}
            <div className="space-y-8">
              {/* Upload Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 min-h-[500px] md:min-h-[600px]">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                  {t('gender_swapper.upload_title') || 'Upload Your Photo'}
                </h2>

                {!selectedImage ? (
                  !user ? (
                    <div className="h-64 md:h-80 border-2 border-dashed border-gray-300 rounded-xl p-8 md:p-12 text-center flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <svg className="mx-auto h-16 w-16 md:h-20 md:w-20 mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <p className="text-xl md:text-2xl mb-3 font-medium text-gray-700">
                          {t('gender_swapper.login_required') || 'Login Required'}
                        </p>
                        <p className="text-sm md:text-base text-gray-600">
                          {t('gender_swapper.login_message') || 'Please log in to use the gender swapper feature.'}
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
                          {t('gender_swapper.insufficient_credits') || 'Insufficient Credits'}
                        </p>
                        <p className="text-sm md:text-base text-gray-600">
                          {t('gender_swapper.credits_message') || 'You need at least 1 credit to use this feature. Please subscribe to get more credits.'}
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
                          {t('gender_swapper.click_to_upload') || 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm md:text-base text-gray-400">
                          {t('gender_swapper.supported_formats') || 'PNG, JPG, JPEG up to 10MB'}
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="space-y-6 h-full">
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

                    {/* Gender Selection */}
                    <div className="space-y-4 bg-gray-50 rounded-lg p-6">
                      <label className="block text-lg font-semibold text-gray-800 text-center">
                        {t('gender_swapper.target_gender') || 'Target Gender'}
                      </label>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setTargetGender('male')}
                          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                            targetGender === 'male'
                              ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {t('gender_swapper.male') || 'Male'}
                        </button>
                        <button
                          onClick={() => setTargetGender('female')}
                          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                            targetGender === 'female'
                              ? 'bg-pink-600 text-white shadow-lg transform scale-105'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {t('gender_swapper.female') || 'Female'}
                        </button>
                      </div>
                    </div>

                    {/* Process Button */}
                    {!user ? (
                      <div className="w-full bg-gray-200 text-gray-500 py-4 px-6 rounded-xl font-semibold text-lg text-center">
                        {t('gender_swapper.login_required') || 'Login Required'}
                      </div>
                    ) : userCredits < 1 ? (
                      <div className="w-full bg-gray-200 text-gray-500 py-4 px-6 rounded-xl font-semibold text-lg text-center">
                        {t('gender_swapper.insufficient_credits') || 'Insufficient Credits'}
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
                            {t('gender_swapper.processing') || 'Processing...'}
                          </div>
                        ) : (
                          t('gender_swapper.process') || 'Process Image'
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

            {/* Right Column - Result */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 min-h-[500px] md:min-h-[600px]">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                  {t('gender_swapper.result') || 'Result'}
                </h2>

                {error ? (
                  <div className="h-64 md:h-80 border-2 border-red-300 rounded-xl flex items-center justify-center text-red-600 bg-red-50">
                    <div className="text-center p-6">
                      <svg className="mx-auto h-16 w-16 md:h-20 md:w-20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg md:text-xl font-medium mb-2">
                        {t('gender_swapper.processing_error') || 'Processing Failed'}
                      </p>
                      <p className="text-sm md:text-base">
                        {error}
                      </p>
                    </div>
                  </div>
                ) : processedImage ? (
                  <div className="space-y-6">
                    <div className="relative group">
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full h-64 md:h-80 object-contain rounded-xl shadow-md"
                      />
                    </div>
                    <button
                      onClick={handleDownload}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {t('gender_swapper.download') || 'Download Result'}
                    </button>
                  </div>
                ) : (
                  <div className="h-64 md:h-80 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 bg-gray-50">
                    <div className="text-center p-6">
                      <svg className="mx-auto h-16 w-16 md:h-20 md:w-20 mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg md:text-xl font-medium">
                        {t('gender_swapper.result_placeholder') || 'Your processed image will appear here'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              {t('gender_swapper.features_title') || 'Key Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.features_ai') || 'Advanced AI Technology'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('gender_swapper.features_ai_desc') || 'Powered by Tencent Cloud AI for precise gender transformation'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.features_quality') || 'High Quality Output'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('gender_swapper.features_quality_desc') || 'Maintain image quality while changing gender appearance'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.features_fast') || 'Fast Processing'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('gender_swapper.features_fast_desc') || 'Get results in seconds with our optimized AI models'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.features_custom') || 'Gender Selection'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('gender_swapper.features_custom_desc') || 'Choose between male and female transformation options'}
                </p>
              </div>
            </div>
          </div>

          {/* How to Use Section */}
          <div className="mt-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              {t('gender_swapper.how_to_use_title') || 'How to Use'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.how_to_use_step1') || 'Upload Your Photo'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('gender_swapper.how_to_use_step1_desc') || 'Select a clear, high-quality photo of a person'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.how_to_use_step2') || 'Choose Target Gender'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('gender_swapper.how_to_use_step2_desc') || 'Select male or female as your target gender'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.how_to_use_step3') || 'Process Image'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('gender_swapper.how_to_use_step3_desc') || 'Click "Process Image" and wait for AI processing'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.how_to_use_step4') || 'Download Result'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('gender_swapper.how_to_use_step4_desc') || 'Download your gender-swapped photo'}
                </p>
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('gender_swapper.examples_title') || 'Examples'}
              </h2>
              <p className="text-xl text-gray-600">
                {t('gender_swapper.examples_desc') || 'See how our AI transforms photos between genders'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Example 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-900 text-center">Example 1</h3>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1 text-center">
                      {t('gender_swapper.examples_before') || 'Before'}
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <Image
                        src="/gender/b1.png"
                        alt="Before example 1"
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1 text-center">
                      {t('gender_swapper.examples_after') || 'After'}
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <Image
                        src="/gender/a1.png"
                        alt="After example 1"
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Example 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-900 text-center">Example 2</h3>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1 text-center">
                      {t('gender_swapper.examples_before') || 'Before'}
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <Image
                        src="/gender/b2.png"
                        alt="Before example 2"
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1 text-center">
                      {t('gender_swapper.examples_after') || 'After'}
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <Image
                        src="/gender/a2.png"
                        alt="After example 2"
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Example 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-900 text-center">Example 3</h3>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1 text-center">
                      {t('gender_swapper.examples_before') || 'Before'}
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <Image
                        src="/gender/b3.png"
                        alt="Before example 3"
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1 text-center">
                      {t('gender_swapper.examples_after') || 'After'}
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <Image
                        src="/gender/a3.png"
                        alt="After example 3"
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              {t('gender_swapper.faq_title') || 'Frequently Asked Questions'}
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.faq_q1') || 'What image formats are supported?'}
                </h3>
                <p className="text-gray-600">
                  {t('gender_swapper.faq_a1') || 'We support PNG, JPG, and JPEG formats. Images should be under 10MB for best results.'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.faq_q2') || 'How accurate is the gender transformation?'}
                </h3>
                <p className="text-gray-600">
                  {t('gender_swapper.faq_a2') || 'Our AI uses advanced facial recognition and transformation algorithms. Results vary based on image quality and facial features.'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.faq_q3') || 'Can I use any photo?'}
                </h3>
                <p className="text-gray-600">
                  {t('gender_swapper.faq_a3') || 'For best results, use clear, high-resolution photos with visible faces. Avoid heavily edited or low-quality images.'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.faq_q4') || 'Is my uploaded photo secure?'}
                </h3>
                <p className="text-gray-600">
                  {t('gender_swapper.faq_a4') || 'Yes, all uploads are processed securely and deleted after processing. We prioritize user privacy and data protection.'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('gender_swapper.faq_q5') || 'How long does processing take?'}
                </h3>
                <p className="text-gray-600">
                  {t('gender_swapper.faq_a5') || 'Processing typically takes 10-30 seconds depending on server load and image complexity.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
