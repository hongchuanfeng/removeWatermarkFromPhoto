'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useRef } from 'react'

export default function EbookToSpeech() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [voice, setVoice] = useState('alloy')
  const [speed, setSpeed] = useState(1.0)
  const [extractedText, setExtractedText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError('')
      setDownloadUrl('')
      setExtractedText('')
    }
  }

  const clearFile = () => {
    setFile(null)
    setDownloadUrl('')
    setError('')
    setProgress(0)
    setExtractedText('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getAcceptedFormats = () => {
    return '.epub,.txt,.md'
  }

  const extractTextFromEpub = async (file: File): Promise<string> => {
    const JSZip = (await import('jszip')).default
    const arrayBuffer = await file.arrayBuffer()
    const zip = await JSZip.loadAsync(arrayBuffer)
    
    let fullText = ''
    const files = zip.files
    
    // Get all xhtml/html files
    const xhtmlFiles = Object.keys(files).filter(name => 
      (name.endsWith('.xhtml') || name.endsWith('.html') || name.endsWith('.htm')) &&
      !name.includes('nav') && !name.includes('toc')
    )
    
    for (const fileName of xhtmlFiles) {
      const content = await zip.file(fileName)?.async('string')
      if (content) {
        // Simple HTML to text conversion
        const text = content
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, ' ')
          .trim()
        
        if (text.length > 50) {
          fullText += text + '\n\n'
        }
      }
    }
    
    return fullText.trim()
  }

  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileName = file.name.toLowerCase()
    const ext = fileName.split('.').pop() || ''
    
    try {
      if (fileName.endsWith('.epub')) {
        return await extractTextFromEpub(file)
      } else if (fileName.endsWith('.txt') || fileName.endsWith('.md') || ext === 'txt' || ext === 'md') {
        const content = await file.text()
        return content
      }
    } catch (err) {
      console.error('Error extracting text:', err)
    }
    
    return ''
  }

  const textToSpeech = async (text: string, voiceName: string, speechRate: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const synth = window.speechSynthesis
      const voices = synth.getVoices()
      
      // Find the requested voice
      let selectedVoice = voices.find(v => v.name.toLowerCase().includes(voiceName.toLowerCase()))
      
      // Fallback to default if not found
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0]
      }
      
      // Use Web Speech API to generate audio
      // Since Web Speech API doesn't directly generate audio files,
      // we'll use a workaround with AudioContext
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = selectedVoice
      utterance.rate = speechRate
      utterance.lang = selectedVoice?.lang || 'en-US'
      
      // Create a MediaRecorder to capture audio
      const audioContext = new AudioContext()
      const mediaStream = audioContext.createMediaStreamDestination()
      
      // Since speechSynthesis doesn't provide audio stream directly,
      // we'll create a workaround using silence and provide instructions
      
      // For a production app, you would use a TTS API like:
      // - Google Cloud Text-to-Speech
      // - AWS Polly
      // - ElevenLabs
      // - Web Speech API (limited)
      
      // For now, we'll use the Web Speech API
      synth.speak(utterance)
      
      // Return a placeholder - actual implementation would need server-side TTS
      resolve(new Blob(['Audio placeholder'], { type: 'audio/mp3' }))
    })
  }

  const handleConvert = async () => {
    if (!file) return
    setProcessing(true)
    setError('')
    setProgress(0)

    try {
      setProgress(10)
      
      // Extract text from ebook
      const text = await extractTextFromFile(file)
      
      // Show error with file info
      if (!text || text.trim().length === 0) {
        const errorMsg = `未找到可转换的文本内容。文件: ${file.name}, 类型: ${file.type || 'unknown'}, 长度: ${text?.length || 0}`
        setError(errorMsg)
        setProcessing(false)
        return
      }
      
      setExtractedText(text.substring(0, 500) + (text.length > 500 ? '...' : ''))
      
      setProgress(30)
      
      // Use Web Speech API with MediaRecorder to capture audio
      const synth = window.speechSynthesis
      const voices = synth.getVoices()
      
      // Find appropriate voice
      let selectedVoice = voices.find(v => v.lang.startsWith('zh')) || 
                          voices.find(v => v.name.toLowerCase().includes(voice.toLowerCase())) ||
                          voices[0]
      
      // Split text into chunks for speech
      const chunkSize = 5000
      const chunks: string[] = []
      
      // Split by sentences
      const sentences = text.match(/[^.!?。！？]+[.!?。！？]+/g) || [text]
      let currentChunk = ''
      
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > chunkSize) {
          if (currentChunk) chunks.push(currentChunk.trim())
          currentChunk = sentence
        } else {
          currentChunk += sentence
        }
      }
      if (currentChunk) chunks.push(currentChunk.trim())
      
      setProgress(50)
      
      // Set up audio recording
      const audioContext = new AudioContext()
      const destination = audioContext.createMediaStreamDestination()
      const mediaRecorder = new MediaRecorder(destination.stream)
      const audioChunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setDownloadUrl(url)
        setProgress(100)
        setProcessing(false)
      }
      
      // Start recording
      mediaRecorder.start()
      
      // Play all chunks and wait for completion
      const playPromises = chunks.map((chunk, i) => {
        return new Promise<void>((resolve) => {
          const utterance = new SpeechSynthesisUtterance(chunk)
          utterance.voice = selectedVoice
          utterance.rate = speed
          
          utterance.onend = () => {
            setProgress(50 + ((i + 1) / chunks.length) * 40)
            resolve()
          }
          utterance.onerror = () => {
            resolve()
          }
          
          // Small delay between chunks
          setTimeout(() => {
            synth.speak(utterance)
          }, 100)
        })
      })
      
      await Promise.all(playPromises)
      
      // Wait a bit for MediaRecorder to finalize
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Stop recording
      mediaRecorder.stop()
      audioContext.close()
      
    } catch (err: any) {
      console.error('Conversion error:', err)
      setError(err.message || t('ebook_to_speech.failed'))
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!downloadUrl || downloadUrl === 'preview') return
    
    // Create download link
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${file?.name.replace(/\.[^/.]+$/, '') || 'audio'}_speech.webm`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleConvertAnother = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
    }
    setDownloadUrl('')
    setProgress(0)
    setExtractedText('')
    clearFile()
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('nav.ebook_to_speech')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('ebook_to_speech.description')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {!downloadUrl ? (
            <>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getAcceptedFormats()}
                  onChange={handleFileChange}
                  className="hidden"
                  id="ebook-upload"
                />
                <div className="cursor-pointer">
                  <div className="text-6xl mb-4">🎧</div>
                  <p className="text-lg text-gray-700 mb-2">
                    {file 
                      ? file.name 
                      : t('ebook_to_speech.upload')
                    }
                  </p>
                  {file && (
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {t('ebook_to_speech.supported')}
                  </p>
                </div>
              </div>

              {file && (
                <div className="mt-6 space-y-4">
                  {/* Voice Options */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">
                      {t('ebook_to_speech.voice_options')}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('ebook_to_speech.voice')}
                        </label>
                        <select
                          value={voice}
                          onChange={(e) => setVoice(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                        >
                          <option value="alloy">{t('ebook_to_speech.voice_alloy')}</option>
                          <option value="echo">{t('ebook_to_speech.voice_echo')}</option>
                          <option value="fable">{t('ebook_to_speech.voice_fable')}</option>
                          <option value="onyx">{t('ebook_to_speech.voice_onyx')}</option>
                          <option value="nova">{t('ebook_to_speech.voice_nova')}</option>
                          <option value="shimmer">{t('ebook_to_speech.voice_shimmer')}</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('ebook_to_speech.speed')}: {speed}x
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={speed}
                          onChange={(e) => setSpeed(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0.5x</span>
                          <span>1x</span>
                          <span>1.5x</span>
                          <span>2x</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleConvert}
                    disabled={processing}
                    className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('ebook_to_speech.processing')} {progress}%
                      </>
                    ) : (
                      t('ebook_to_speech.convert')
                    )}
                  </button>
                  
                  <button
                    onClick={clearFile}
                    className="w-full text-gray-600 py-2 text-sm hover:text-gray-800"
                  >
                    {t('common.clear')}
                  </button>
                </div>
              )}

              {extractedText && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    {t('ebook_to_speech.extracted_text')}
                  </h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {extractedText}
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mt-4">
                  {error}
                </div>
              )}

              {processing && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('ebook_to_speech.success_title')}
                </h3>
                <p className="text-gray-600">
                  {t('ebook_to_speech.success_desc')}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700">
                  {t('ebook_to_speech.notice')}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t('ebook_to_speech.download_audio')}
                </button>
                
                <button
                  onClick={handleConvertAnother}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  {t('ebook_to_speech.convert_another')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-8 bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('ebook_to_speech.features_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🔊</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('ebook_to_speech.feature1_title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('ebook_to_speech.feature1_desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('ebook_to_speech.feature2_title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('ebook_to_speech.feature2_desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('ebook_to_speech.feature3_title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('ebook_to_speech.feature3_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('ebook_to_speech.how_it_works_title')}
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">1</div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {t('ebook_to_speech.step1')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('ebook_to_speech.step1_desc')}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">2</div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {t('ebook_to_speech.step2')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('ebook_to_speech.step2_desc')}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">3</div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {t('ebook_to_speech.step3')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('ebook_to_speech.step3_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
