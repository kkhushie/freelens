'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import WrappedSlideshow from '@/components/WrappedSlideshow';
import { useRouter } from 'next/navigation';

export default function WrappedRoute() {
  const {
    projects,
    clients,
    goals,
    achievements,
    triggerConfetti
  } = useAuth();

  const router = useRouter();

  return (
    <WrappedSlideshow
      projects={projects}
      clients={clients}
      goals={goals}
      achievements={achievements}
      triggerConfetti={triggerConfetti}
      onClose={() => router.push('/dashboard/overview')}
    />
  );
}
