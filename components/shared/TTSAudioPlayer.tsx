import { AudioPlayer } from '@/components/shared/AudioPlayer';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

interface TTSAudioPlayerProps {
  text: string;
  apiKey: string;
  languageCode?: string;
  voiceName?: string;
  speakingRate?: number;
  pitch?: number;
}

export const TTSAudioPlayer: React.FC<TTSAudioPlayerProps> = ({
  text,
  apiKey,
  languageCode = 'en-US',
  voiceName = 'en-US-Standard-A',
  speakingRate = 1.0,
  pitch = 0.0,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [progress, setProgress] = useState(0);
  const [audioContent, setAudioContent] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const soundRef = useRef<Audio.Sound | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio mode
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };
    initAudio();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Format time helper
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Start progress tracking
  const startProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(async () => {
      if (soundRef.current) {
        try {
          const status = await soundRef.current.getStatusAsync();
          if (status.isLoaded && status.durationMillis && status.positionMillis !== undefined) {
            const currentSeconds = status.positionMillis / 1000;
            const totalSeconds = status.durationMillis / 1000;
            
            setCurrentTime(formatTime(currentSeconds));
            setDuration(formatTime(totalSeconds));
            setProgress(currentSeconds / totalSeconds);

            if (status.didJustFinish) {
              setIsPlaying(false);
              setProgress(0);
              setCurrentTime('0:00');
              if (progressInterval.current) {
                clearInterval(progressInterval.current);
              }
            }
          }
        } catch (error) {
          console.error('Error tracking progress:', error);
        }
      }
    }, 100);
  };

  // Stop progress tracking
  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Synthesize speech from Google TTS API
  const synthesizeSpeech = async (): Promise<string> => {
    console.log('Synthesizing speech...');
    
    const requestBody = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender: 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate,
        pitch
      }
    };

    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TTS API Error:', errorText);
      throw new Error(`TTS API failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data.audioContent) {
      throw new Error('No audio content received');
    }

    console.log('Speech synthesis successful');
    return data.audioContent;
  };

  // Create and load audio from base64 content
  const createAudioFromContent = async (audioContent: string): Promise<Audio.Sound> => {
    console.log('Creating audio from content...');
    
    // Stop and unload any existing sound
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    const audioUri = `data:audio/mp3;base64,${audioContent}`;
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: false, progressUpdateIntervalMillis: 100 }
    );

    // Verify the sound loaded
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) {
      await sound.unloadAsync();
      throw new Error('Failed to load audio file');
    }

    console.log('Audio created and loaded successfully');
    return sound;
  };

  // Handle play/pause button press
  const handlePlayPause = async () => {
    // Portfolio demo build: no Google TTS key ships publicly, so on the web
    // use the browser's built-in Speech Synthesis for a real spoken voice.
    const synth =
      typeof window !== 'undefined' ? (window as any).speechSynthesis : undefined;
    if (synth) {
      if (isPlaying) {
        synth.cancel();
        setIsPlaying(false);
      } else {
        synth.cancel();
        const utter = new (window as any).SpeechSynthesisUtterance(text);
        utter.lang = languageCode;
        utter.rate = speakingRate || 1;
        utter.onend = () => setIsPlaying(false);
        utter.onerror = () => setIsPlaying(false);
        synth.speak(utter);
        setIsPlaying(true);
      }
      return;
    }

    try {
      if (isLoading) return;

      // If no audio content, synthesize first
      if (!audioContent) {
        console.log('No audio content, synthesizing...');
        setIsLoading(true);
        
        const newAudioContent = await synthesizeSpeech();
        setAudioContent(newAudioContent);
        
        const sound = await createAudioFromContent(newAudioContent);
        soundRef.current = sound;
        
        // Start playing
        await sound.playAsync();
        setIsPlaying(true);
        startProgressTracking();
        setIsLoading(false);
        
        console.log('Started playing new audio');
        return;
      }

      // If we have audio content but no sound object, create it
      if (!soundRef.current && audioContent) {
        console.log('Recreating sound object...');
        const sound = await createAudioFromContent(audioContent);
        soundRef.current = sound;
      }

      // Handle play/pause for existing audio
      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        
        if (status.isLoaded) {
          if (isPlaying) {
            // Pause
            console.log('Pausing audio');
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
            stopProgressTracking();
          } else {
            // Play/Resume
            console.log('Playing/Resuming audio');
            await soundRef.current.playAsync();
            setIsPlaying(true);
            startProgressTracking();
          }
        }
      }
    } catch (error) {
      console.error('Error in play/pause:', error);
      setIsLoading(false);
      setIsPlaying(false);
      stopProgressTracking();
      Alert.alert('Playback Error', error instanceof Error ? error.message : 'Failed to play audio');
    }
  };

  // Handle mute toggle
  const handleMute = async () => {
    try {
      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          const newMutedState = !isMuted;
          await soundRef.current.setVolumeAsync(newMutedState ? 0 : 1);
          setIsMuted(newMutedState);
          console.log(newMutedState ? 'Audio muted' : 'Audio unmuted');
        }
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  // Handle restart from beginning
  const handleRestart = async () => {
    try {
      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          console.log('Restarting audio from beginning');
          await soundRef.current.setPositionAsync(0);
          setProgress(0);
          setCurrentTime('0:00');
          
          // If it was playing, continue playing from start
          if (isPlaying) {
            await soundRef.current.playAsync();
            startProgressTracking();
          }
        }
      }
    } catch (error) {
      console.error('Error restarting audio:', error);
    }
  };

  return (
    <AudioPlayer
      duration={duration}
      currentTime={currentTime}
      isPlaying={isPlaying}
      isLoading={isLoading}
      isMuted={isMuted}
      onPlayPause={handlePlayPause}
      onMute={handleMute}
      onRestart={handleRestart}
      progress={progress}
    />
  );
};