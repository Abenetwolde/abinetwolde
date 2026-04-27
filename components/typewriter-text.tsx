'use client'

import { useEffect, useState, useRef } from 'react'

interface TypewriterTextProps {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export function TypewriterText({
  texts,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseDuration = 2000,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    if (!texts || texts.length === 0) return

    const currentText = texts[indexRef.current % texts.length]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1))
          } else {
            // Pause then start deleting
            setTimeout(() => setIsDeleting(true), pauseDuration)
          }
        } else {
          // Deleting
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            indexRef.current++
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, texts, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className="inline-flex items-center">
      <span className="text-lg font-semibold text-primary md:text-xl">
        {displayText}
      </span>
      <span className="ml-1 inline-block h-6 w-0.5 animate-cursor bg-primary" />
    </span>
  )
}
