'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import TimelineTab from '@/components/TimelineTab';

export default function TimelineRoute() {
  const { projects, toggleProjectStatus } = useAuth();

  return (
    <TimelineTab
      projects={projects}
      onToggleProjectStatus={toggleProjectStatus}
    />
  );
}
