// utils/audio.ts

let audioInstance: HTMLAudioElement | null = null;

export const getAudio = () => {
  if (typeof window === "undefined") return null;

  if (!audioInstance) {
    audioInstance = new Audio("/music.mp3");
    audioInstance.loop = true;
  }

  return audioInstance;
};