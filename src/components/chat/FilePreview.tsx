'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, Image, File, Download, Eye } from 'lucide-react';

interface FilePreviewProps {
  file: {
    name: string;
    type: string;
    size: number;
    url?: string;
  };
  onDownload?: () => void;
  onView?: () => void;
}

export default function FilePreview({ file, onDownload, onView }: FilePreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type === 'application/pdf') return FileText;
    return File;
  };

  const getFileAnimation = () => {
    if (file.type.startsWith('image/')) {
      return {
        initial: { scale: 0.8, rotateY: -15 },
        animate: isHovered ? { scale: 1.1, rotateY: 5 } : { scale: 1, rotateY: 0 }
      };
    }
    if (file.type === 'application/pdf') {
      return {
        initial: { rotateY: -10 },
        animate: isHovered ? { rotateY: 10, scale: 1.05 } : { rotateY: 0, scale: 1 }
      };
    }
    return {
      initial: { y: 10, opacity: 0 },
      animate: isHovered ? { y: -5, opacity: 1 } : { y: 0, opacity: 1 }
    };
  };

  const Icon = getFileIcon();
  const animation = getFileAnimation();

  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 cursor-pointer border border-gray-700 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={animation.initial}
      animate={animation.animate}
      whileHover={{ boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
      style={{ perspective: '1000px' }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        {/* File icon with animation */}
        <motion.div
          className="flex justify-center mb-3"
          animate={isHovered ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {file.type.startsWith('image/') && <Image className="w-12 h-12 text-purple-400" />}
          {file.type === 'application/pdf' && <FileText className="w-12 h-12 text-purple-400" />}
          {!file.type.startsWith('image/') && file.type !== 'application/pdf' && <File className="w-12 h-12 text-purple-400" />}
        </motion.div>

        {/* File name */}
        <motion.h4
          className="text-sm font-medium text-white text-center mb-2 truncate"
          animate={isHovered ? { color: '#a855f7' } : { color: '#ffffff' }}
        >
          {file.name}
        </motion.h4>

        {/* File size */}
        <p className="text-xs text-gray-400 text-center mb-3">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-2">
          <motion.button
            onClick={onView}
            className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-3 h-3" />
            View
          </motion.button>
          <motion.button
            onClick={onDownload}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-3 h-3" />
            Download
          </motion.button>
        </div>
      </div>

      {/* Holographic effect for images */}
      {file.type.startsWith('image/') && isHovered && (
        <motion.div
          className="absolute inset-0 border-2 border-purple-400 rounded-lg"
          animate={{
            boxShadow: [
              '0 0 0 rgba(168, 85, 247, 0)',
              '0 0 20px rgba(168, 85, 247, 0.8)',
              '0 0 0 rgba(168, 85, 247, 0)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Book opening effect for PDFs */}
      {file.type === 'application/pdf' && isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ originX: 0 }}
        />
      )}
    </motion.div>
  );
}