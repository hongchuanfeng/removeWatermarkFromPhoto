'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useRef } from 'react'

interface BarcodeRecognizeProps {
  toolKey: string
}

export default function BarcodeRecognize({ toolKey }: BarcodeRecognizeProps) {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [recognizing, setRecognizing] = useState(false)
  const [useCamera, setUseCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setResult(null)
    }
  }

  const handleRecognize = async () => {
    if (!file && !useCamera) return
    setRecognizing(true)
    
    // Placeholder for actual barcode recognition functionality
    // In a real implementation, you would use a library like quagga
    setTimeout(() => {
      setRecognizing(false)
      // Simulated result
      setResult('1234567890123')
    }, 2000)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setCameraStream(stream)
      setUseCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setUseCamera(false)
  }

  const handleCameraCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        setPreview(canvas.toDataURL('image/png'))
        stopCamera()
      }
    }
  }

  const clearAll = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    stopCamera()
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t(`nav.${toolKey.replace(/-/g, '_')}`)}
          </h1>
          <p className="text-xl text-gray-600">
            {t(`${toolKey.replace(/-/g, '_')}.description`)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => { setUseCamera(false); stopCamera(); }}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  !useCamera 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('barcode.upload_image')}
              </button>
              <button
                onClick={startCamera}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  useCamera 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('barcode.use_camera')}
              </button>
            </div>
          </div>

          {!useCamera ? (
            // Upload Image Mode
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="barcode-upload"
                />
                <label htmlFor="barcode-upload" className="cursor-pointer">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-lg text-gray-700 mb-2">
                    {preview 
                      ? t('barcode.image_selected') 
                      : t(`${toolKey.replace(/-/g, '_')}.upload`)
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {t(`${toolKey.replace(/-/g, '_')}.supported`)}
                  </p>
                </label>
              </div>

              {preview && (
                <div className="mt-4">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-w-full mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {result && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-semibold mb-2">
                    {t('barcode.recognized_result')}:
                  </p>
                  <p className="text-gray-800 break-all">{result}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    {t('barcode.copy_result')}
                  </button>
                </div>
              )}

              <button
                onClick={handleRecognize}
                disabled={!preview || recognizing}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400"
              >
                {recognizing 
                  ? t(`${toolKey.replace(/-/g, '_')}.processing`) 
                  : t(`${toolKey.replace(/-/g, '_')}.recognize`)
                }
              </button>

              {(preview || result) && (
                <button
                  onClick={clearAll}
                  className="w-full text-gray-600 py-2 hover:text-gray-800"
                >
                  {t('csv.clear_all')}
                </button>
              )}
            </div>
          ) : (
            // Camera Mode
            <div className="space-y-6">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline
                  className="w-full h-auto"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCameraCapture}
                  className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  {t('barcode.capture')}
                </button>
                <button
                  onClick={stopCamera}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  {t('barcode.stop_camera')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

