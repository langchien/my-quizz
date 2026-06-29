// A simple sound utility using HTML5 Audio

const SOUNDS = {
  countdown: 'https://assets.mixkit.co/active_storage/sfx/2821/2821-preview.mp3', // Tick
  correct: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3', // Win/Success chime
  incorrect: 'https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3', // Error/Buzzer
  start: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Game start
}

// Preload audio objects
const audioElements: Record<string, HTMLAudioElement> = {}

if (typeof window !== 'undefined') {
  Object.entries(SOUNDS).forEach(([key, url]) => {
    const audio = new Audio(url)
    audio.preload = 'auto'
    audioElements[key] = audio
  })
}

export function playSound(type: keyof typeof SOUNDS) {
  try {
    const audio = audioElements[type]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch((e) => console.warn('Audio play prevented:', e))
    }
  } catch (err) {
    console.error('Error playing sound', err)
  }
}
