'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AchievementsTab from '@/components/AchievementsTab';

export default function AchievementsRoute() {
  const { achievements } = useAuth();

  return (
    <AchievementsTab
      achievements={achievements}
    />
  );
}
