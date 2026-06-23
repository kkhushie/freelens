'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LeaderboardTab from '@/components/LeaderboardTab';
import { EditClientModal } from '@/components/Modals';
import { useRouter } from 'next/navigation';

export default function LeaderboardRoute() {
  const { clients, deleteClient, updateClient } = useAuth();
  const router = useRouter();

  const [editingClient, setEditingClient] = useState(null);

  return (
    <>
      <LeaderboardTab
        clients={clients}
        onShowAddClient={() => router.push('?new-client=true')}
        onEditClient={(client) => setEditingClient(client)}
        onDeleteClient={(clientId) => {
          if (confirm("Are you sure you want to delete this client? This will remove all their associated projects and clear their revenue contribution from your metrics.")) {
            deleteClient(clientId);
          }
        }}
      />
      
      <EditClientModal
        isOpen={!!editingClient}
        client={editingClient}
        onClose={() => setEditingClient(null)}
        onUpdateClient={updateClient}
      />
    </>
  );
}
