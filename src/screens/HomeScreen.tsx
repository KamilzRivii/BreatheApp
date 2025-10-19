import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSelector, useDispatch  } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../store';
import { RootStackParamList } from '../types';
import PolandIcon from '../../assets/poland_icon.png';
import UkIcon from '../../assets/uk_icon.png';
import { Image } from 'react-native';
import { setLanguage } from '../store/settingsSlice';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { stats } = useSelector((state: RootState) => state.stats);
  const { exercises } = useSelector((state: RootState) => state.exercises);
  const { language } = useSelector((state: RootState) => state.settings);

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    const toggleLanguage = () => {
        const newLang = language === 'pl' ? 'en' : 'pl';
        dispatch(setLanguage(newLang));
    };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="pt-14 pb-6 px-6 d-flex flex-row justify-between items-center">
        <Text className="text-4xl font-bold text-white">{t('appName')}</Text>

        {/* Language Switcher */}
        <View className="flex-row space-x-1">
            <TouchableOpacity onPress={() => dispatch(setLanguage('pl'))}>
              <Image
                source={PolandIcon}
                style={{
                  width: 30,
                  height: 30,
                  opacity: language === 'pl' ? 1 : 0.5,
                  marginRight: 8,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch(setLanguage('en'))}>
              <Image
                source={UkIcon}
                style={{
                  width: 30,
                  height: 30,
                  opacity: language === 'en' ? 1 : 0.5,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Stats Grid - 4 kafelki */}
        <View className="flex-row flex-wrap justify-between mb-8">
          {/* Sesji dzisiaj */}
          <View className="bg-gray-900 rounded-3xl p-5 mb-4 w-[48%] border border-[#31FBE2]">
            <Text className="text-[#31FBE2] text-sm font-semibold">{t('today')}</Text>
            <Text className="text-white text-4xl font-bold mt-3">{stats.sessionsToday}</Text>
            <Text className="text-white text-xs mt-1">{t('sessions')}</Text>
          </View>

          {/* Minut razem */}
          <View className="bg-gray-900 rounded-3xl p-5 mb-4 w-[48%] border border-[#31FBE2]">
            <Text className="text-[#31FBE2] text-sm font-semibold">{t('total')}</Text>
            <Text className="text-white text-4xl font-bold mt-3">{stats.totalMinutes}</Text>
            <Text className="text-white text-xs mt-1">{t('minutes')}</Text>
          </View>

          {/* Dni z rzędu */}
          <View className="bg-gray-900 rounded-3xl p-5 mb-4 w-[48%] border border-[#31FBE2]">
            <Text className="text-[#31FBE2] text-sm font-semibold">{t('streak')}</Text>
            <Text className="text-white text-4xl font-bold mt-3">{stats.currentStreak}</Text>
            <Text className="text-white text-xs mt-1">{t('daysInRow')}</Text>
          </View>

          {/* Średni czas */}
          <View className="bg-gray-900 rounded-3xl p-5 mb-4 w-[48%] border border-[#31FBE2]">
            <Text className="text-[#31FBE2] text-sm font-semibold">{t('average')}</Text>
            <Text className="text-white text-4xl font-bold mt-3">{stats.averagePerDay}</Text>
            <Text className="text-white text-xs mt-1">{t('minPerDay')}</Text>
          </View>
        </View>

        {/* Exercises Section */}
        <Text className="text-2xl font-bold text-white mb-5">
          {t('exercises')}
        </Text>

        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            onPress={() => navigation.navigate('Exercise', { exercise })}
            className="bg-gray-900 rounded-3xl p-5 mb-6 last:pb-4 border border-[#31FBE2] active:opacity-70"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              {/* Icon */}
              <View className={`${exercise.color} w-16 h-16 rounded-2xl items-center justify-center mr-4`}>
                <Text className="text-4xl">{exercise.icon}</Text>
              </View>

              {/* Content */}
              <View className="flex-1">
                <Text className="text-lg font-bold text-white">
                  {t(`exercise_${exercise.id}_name`)}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  {t(`exercise_${exercise.id}_desc`)}
                </Text>
              </View>

              {/* Duration */}
              <View className="bg-gray-800 px-4 py-2 rounded-full">
                <Text className="text-[#31FBE2] text-xs font-semibold">
                  {exercise.duration}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}