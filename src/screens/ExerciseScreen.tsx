import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addSession } from '../store/statsSlice';
import { RootStackParamList, Session } from '../types';
import { useTranslation } from 'react-i18next';

type ExerciseScreenRouteProp = RouteProp<RootStackParamList, 'Exercise'>;
type ExerciseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Exercise'>;

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

export default function ExerciseScreen() {
  const navigation = useNavigation<ExerciseScreenNavigationProp>();
  const route = useRoute<ExerciseScreenRouteProp>();
  const { exercise } = route.params;
  const { t } = useTranslation();
  
  const dispatch = useDispatch();
  const [phase, setPhase] = useState<Phase>('inhale');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  
  // Animacje z Animated API
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  // Kolory dla faz
  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return '#31FBE2';
      case 'hold': return '#8b5cf6';
      case 'exhale': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Tekst instrukcji
  const getPhaseText = () => {
    switch (phase) {
    case 'inhale': return t('inhale');
    case 'hold': return t('hold');
    case 'exhale': return t('exhale');
    default: return t('rest');
    }
  };

  // Animuj koło dla danej fazy
  const animatePhase = (targetScale: number, duration: number) => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: targetScale,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: targetScale === 1 ? 1 : 0.6,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Główna logika ćwiczenia
  useEffect(() => {
    if (!isRunning) return;

    let timer: NodeJS.Timeout;
    let phaseDuration = 0;

    switch (phase) {
      case 'inhale':
        phaseDuration = exercise.inhale;
        animatePhase(1, phaseDuration);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'hold':
        phaseDuration = exercise.hold || 0;
        animatePhase(1, phaseDuration);
        break;
      case 'exhale':
        phaseDuration = exercise.exhale;
        animatePhase(0.5, phaseDuration);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }

    setTimeLeft(phaseDuration);

    // Timer odliczający
    let remaining = phaseDuration;
    timer = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
        moveToNextPhase();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isRunning, currentCycle]);

  // Przejdź do następnej fazy
  const moveToNextPhase = () => {
    if (phase === 'inhale') {
      if (exercise.hold) {
        setPhase('hold');
      } else {
        setPhase('exhale');
      }
    } else if (phase === 'hold') {
      setPhase('exhale');
    } else if (phase === 'exhale') {
      // Zakończ cykl
      if (currentCycle >= exercise.cycles) {
        // Ćwiczenie zakończone
        completeExercise();
      } else {
        setCurrentCycle(prev => prev + 1);
        setPhase('inhale');
      }
    }
  };

  // Rozpocznij ćwiczenie
  const startExercise = () => {
    setIsRunning(true);
    setPhase('inhale');
    setCurrentCycle(1);
    setTotalTime(0);
  };

  // Zakończ ćwiczenie
  const completeExercise = () => {
    setIsRunning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Zapisz sesję
    const session: Session = {
      id: Date.now().toString(),
      exerciseId: exercise.id,
      date: new Date().toISOString(),
      duration: Math.round(totalTime / 60),
      cycles: currentCycle,
    };
    
    dispatch(addSession(session));
    
    // Wróć do HomeScreen
    setTimeout(() => navigation.goBack(), 1000);
  };

  // Zatrzymaj ćwiczenie
  const stopExercise = () => {
    setIsRunning(false);
    setPhase('inhale');
    setCurrentCycle(1);
    scaleAnim.setValue(0.5);
    opacityAnim.setValue(0.6);
  };

  // Timer całkowity
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTotalTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
        {/* Header */}
        <View className="pt-14 pb-6 px-6">
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
                <Text className="text-[#31FBE2] text-lg -translate-y-0.5">←</Text>
                <Text className="text-[#31FBE2] text-lg ml-1">{t('back')}</Text>
            </TouchableOpacity>
        </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Cycle Counter */}
        <Text className="text-white text-lg mb-8">
          {t('cycle')} {currentCycle} / {exercise.cycles}
        </Text>

        {/* Animated Circle */}
        <View className="relative items-center justify-center mb-12">
          <Animated.View
            style={{
              width: 280,
              height: 280,
              borderRadius: 140,
              backgroundColor: getPhaseColor(),
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }}
          />
          
          {/* Center Text */}
          <View className="absolute items-center">
            <Text className="text-black text-6xl font-bold mb-2">
              {timeLeft}
            </Text>
            <Text className="text-black text-2xl font-bold">
              {getPhaseText()}
            </Text>
          </View>
        </View>

        {/* Exercise Info */}
        <View className="items-center mb-8">
          <Text className="text-white text-3xl font-bold mb-2">
            {exercise.icon} {t(`exercise_${exercise.id}_name`)}
          </Text>
          <Text className="text-white text-base">
            {t(`exercise_${exercise.id}_desc`)}
          </Text>
        </View>

        {/* Control Buttons */}
        {!isRunning ? (
          <TouchableOpacity
            onPress={startExercise}
            className="bg-[#31FBE2] rounded-full px-12 py-5 shadow-lg active:opacity-80"
          >
            <Text className="text-black text-xl font-bold">
              {t('start')}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={stopExercise}
            className="bg-red-500 rounded-full px-12 py-5 shadow-lg active:opacity-80"
          >
            <Text className="text-white text-xl font-bold">
              {t('stop')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Timer */}
      <View className="pb-8 px-6 items-center">
        <Text className="text-white text-sm">
          {t('totalTime')}: {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
        </Text>
      </View>
    </View>
  );
}