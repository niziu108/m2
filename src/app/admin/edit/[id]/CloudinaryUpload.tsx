'use client'
import { useEffect } from 'react'

declare global {
  interface Window {
    cloudinary: any
  }
}

type Props = {
  multiple?: boolean
  onDone: (urls: string[]) => void
  text: string
}

export default function CloudinaryUpload({ multiple = true, onDone, text }: Props){
  useEffect(()=> {
    if (!window.cloudinary) {
      const s = document.createElement('script')
      s.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
      s.async = true
      document.body.appendChild(s)
    }
  }, [])

  const open = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const preset    = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    if (!window.cloudinary || !cloudName || !preset) {
      alert('Cloudinary widget jeszcze się ładuje albo brak konfiguracji.')
      return
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset: preset,
        sources: ['local','url','camera'],
        multiple,
        maxFiles: multiple ? 20 : 1,
        folder: 'm2',
        clientAllowedFormats: ['jpg','jpeg','png','webp'],
        showAdvancedOptions: false,
        cropping: false,
        resourceType: 'image',
        styles: { palette: { window: '#131313', windowBorder: '#333', tabIcon: '#E9C87D', menuIcons: '#fff', textDark: '#fff', textLight: '#fff', link: '#E9C87D', action: '#E9C87D', inactiveTabIcon: '#bbb', error: '#ff4d4f', inProgress: '#E9C87D', complete: '#26A69A', sourceBg: '#1a1a1a' } }
      },
      (err: any, result: any) => {
        if (!err && result && result.event === 'success') {
          onDone([result.info.secure_url])
        }
        if (!err && result && result.event === 'queues-end' && multiple) {
          const urls = (result?.data?.info?.files || [])
            .map((f: any)=> f?.uploadInfo?.secure_url)
            .filter(Boolean)
          if (urls.length) onDone(urls)
        }
      }
    )
    widget.open()
  }

  return (
    <button type="button" onClick={open}
      className="px-4 py-2 rounded-lg bg-[#E9C87D] text-black font-medium">
      {text}
    </button>
  )
}
