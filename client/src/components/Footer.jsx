import React from 'react'
import Avatar from './Avatar'

export default function Footer() {
  return (
    <footer className="mt-12 py-6 bg-white/60 backdrop-blur-sm border-t">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar gender="male" size={48} />
          <div>
            <div className="text-sm font-medium">B Gokul Krishna Sai</div>
            <div className="text-xs text-gray-500">License © B Gokul Krishna Sai</div>
          </div>
        </div>

        <div className="text-xs text-gray-600">Built for ServiceHive ♥ — By B Gokul Krishna Sai</div>
      </div>
    </footer>
  )
}
