'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import OverviewTab from '@/components/OverviewTab';
import { useRouter } from 'next/navigation';

export default function OverviewRoute() {
  const {
    projects,
    clients,
    goals,
    triggerConfetti
  } = useAuth();
  
  const router = useRouter();

  const handleShowGoalSettings = () => router.push('?goal-settings=true');
  const handleShowAddProject = () => router.push('?new-project=true');
  const handleShowAddClient = () => router.push('?new-client=true');

  return (
    <OverviewTab
      projects={projects}
      clients={clients}
      goals={goals}
      triggerConfetti={triggerConfetti}
      onShowGoalSettings={handleShowGoalSettings}
      onShowAddProject={handleShowAddProject}
      onShowAddClient={handleShowAddClient}
    />
  );
}
