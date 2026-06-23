'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, mockDb, isSupabaseConfigured } from '@/lib/supabase';

const AuthContext = createContext({});

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [goals, setGoals] = useState({ monthly_target: 50000, current: 0 });
  const [achievements, setAchievements] = useState([]);
  const [toast, setToast] = useState(null);
  const [dbError, setDbError] = useState(false); // Tracks if Supabase tables are missing/broken

  // Trigger browser-only confetti
  const triggerConfetti = async () => {
    if (typeof window !== 'undefined') {
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#80F474', '#39D353', '#ffffff', '#1b5e20']
        });
      } catch (err) {
        console.error('Confetti failed to fire', err);
      }
    }
  };

  // Show a temporary message toast
  const showToast = (message, title = 'Notification') => {
    setToast({ message, title });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Recalculates clients based on projects list
  const recalculateClients = (allProjects, currentClientsList) => {
    const clientMap = new Map();
    
    // Initialize map with current clients to preserve avatars/growth
    currentClientsList.forEach(c => {
      clientMap.set(c.name.toLowerCase(), {
        id: c.id,
        name: c.name,
        avatar: c.avatar,
        revenue: 0,
        projects: 0,
        growth: c.growth
      });
    });

    allProjects.forEach(p => {
      const nameLower = p.client.toLowerCase();
      if (!clientMap.has(nameLower)) {
        const icons = ['💻', '🎨', '🚀', '🎬', '📸', '✨'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        clientMap.set(nameLower, {
          id: 'c-' + Math.random().toString(36).substr(2, 9),
          name: p.client,
          avatar: randomIcon,
          revenue: 0,
          projects: 0,
          growth: 10
        });
      }
      
      const clientObj = clientMap.get(nameLower);
      clientObj.projects += 1;
      if (p.status === 'Completed') {
        clientObj.revenue += p.amount;
      }
    });

    const updatedList = Array.from(clientMap.values());
    updatedList.sort((a, b) => b.revenue - a.revenue);
    return updatedList;
  };

  // Sync state from Mock DB or Supabase
  const initializeData = useCallback(async () => {
    setLoading(true);
    setDbError(false);
    try {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      setUser(sessionUser);

      let fetchedProjects = [];
      let fetchedClients = [];
      let fetchedAchievements = [];
      let monthlyTarget = 50000;

      // Attempt Supabase Fetch if configured
      if (isSupabaseConfigured && sessionUser) {
        try {
          const { data: projData, error: projErr } = await supabase
            .from('projects')
            .select('*')
            .order('date', { ascending: false });

          if (projErr) throw projErr;
          if (projData) fetchedProjects = projData;

          const { data: clientData, error: clientErr } = await supabase
            .from('clients')
            .select('*')
            .order('revenue', { ascending: false });

          if (clientErr) throw clientErr;
          if (clientData) fetchedClients = clientData;

          const { data: goalData, error: goalErr } = await supabase
            .from('goals')
            .select('monthly_target')
            .single();

          // Ignore single row not found errors
          if (goalErr && goalErr.code !== 'PGRST116') throw goalErr;
          if (goalData) monthlyTarget = goalData.monthly_target;

          // Generate/unlock achievements dynamically based on database values
          fetchedAchievements = [
            { id: 'ach1', name: 'First Client', desc: 'Secure your first paid creative gig', unlocked: false, date: null, icon: '🤝' },
            { id: 'ach2', name: 'First ₹10,000', desc: 'Earn your first ten thousand rupees', unlocked: false, date: null, icon: '💰' },
            { id: 'ach3', name: 'First ₹1 Lakh', desc: 'Reach ₹100,000 in total creative earnings', unlocked: false, date: null, icon: '👑' },
            { id: 'ach4', name: '100 Projects', desc: 'Complete 100 creative deliverables', unlocked: false, date: null, icon: '🔥' },
            { id: 'ach5', name: 'Top Month Ever', desc: 'Exceed your previous highest monthly earnings', unlocked: false, date: null, icon: '🚀' }
          ];

          const totalEarnings = fetchedProjects.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
          const totalCount = fetchedProjects.filter(p => p.status === 'Completed').length;

          fetchedAchievements = fetchedAchievements.map(ach => {
            let unlocked = false;
            if (ach.id === 'ach1' && totalCount >= 1) unlocked = true;
            if (ach.id === 'ach2' && totalEarnings >= 10000) unlocked = true;
            if (ach.id === 'ach3' && totalEarnings >= 100000) unlocked = true;
            if (ach.id === 'ach4' && totalCount >= 100) unlocked = true;
            if (ach.id === 'ach5' && totalCount >= 2) unlocked = true; // simplified check
            
            return {
              ...ach,
              unlocked,
              date: unlocked ? 'Active' : null
            };
          });

        } catch (dbErr) {
          console.error('Failed to query Supabase tables, database warning triggered:', dbErr);
          setDbError(true);
        }
      }

      // Fallback to local storage mock db if not configured
      if (!isSupabaseConfigured || !sessionUser) {
        const dbState = mockDb.getData();
        if (dbState) {
          fetchedProjects = dbState.projects || [];
          fetchedClients = dbState.clients || [];
          fetchedAchievements = dbState.achievements || [];
          monthlyTarget = dbState.goals?.monthly_target || 50000;
        }
      }

      setProjects(fetchedProjects);
      setClients(fetchedClients);
      setAchievements(fetchedAchievements);
      
      // Calculate current month's total for goals dynamically
      const currentMonthStr = getLocalDateString().slice(0, 7);
      const currentMonthEarnings = fetchedProjects
        .filter(p => p.date.startsWith(currentMonthStr) && p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);

      setGoals({
        monthly_target: monthlyTarget,
        current: currentMonthEarnings
      });
    } catch (err) {
      console.error('Error during data initialization:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize once on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Subscribe to real-time changes in Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;

    const channel = supabase
      .channel('realtime-dashboard-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${user.id}` },
        () => {
          initializeData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clients', filter: `user_id=eq.${user.id}` },
        () => {
          initializeData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'goals', filter: `user_id=eq.${user.id}` },
        () => {
          initializeData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, initializeData]);

  // Login handler
  const signIn = async (email, password) => {
    setLoading(true);
    setDbError(false);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      setUser(data.user);
      showToast('Welcome back to Freelens!', 'Logged In');
      
      let fetchedProjects = [];
      let fetchedClients = [];
      let fetchedAchievements = [];
      let monthlyTarget = 50000;

      if (isSupabaseConfigured) {
        try {
          const { data: projData, error: projErr } = await supabase.from('projects').select('*').order('date', { ascending: false });
          if (projErr) throw projErr;
          if (projData) fetchedProjects = projData;

          const { data: clientData, error: clientErr } = await supabase.from('clients').select('*').order('revenue', { ascending: false });
          if (clientErr) throw clientErr;
          if (clientData) fetchedClients = clientData;

          const { data: goalData, error: goalErr } = await supabase.from('goals').select('monthly_target').single();
          if (goalErr && goalErr.code !== 'PGRST116') throw goalErr;
          if (goalData) monthlyTarget = goalData.monthly_target;
        } catch (e) {
          console.warn('Supabase fetch failed during signin, database warning triggered.');
          setDbError(true);
        }
      }

      if (!isSupabaseConfigured) {
        const dbState = mockDb.getData();
        fetchedProjects = dbState.projects || [];
        fetchedClients = dbState.clients || [];
        fetchedAchievements = dbState.achievements || [];
        monthlyTarget = dbState.goals?.monthly_target || 50000;
      }

      setProjects(fetchedProjects);
      setClients(fetchedClients);
      setAchievements(fetchedAchievements);
      
      const currentMonthStr = getLocalDateString().slice(0, 7);
      const currentMonthEarnings = fetchedProjects
        .filter(p => p.date.startsWith(currentMonthStr) && p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);

      setGoals({
        monthly_target: monthlyTarget,
        current: currentMonthEarnings
      });
    }
    setLoading(false);
    return { data, error };
  };

  // Signup handler
  const signUp = async (email, password, name, role) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role || 'Creative Professional',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
          monthly_goal: 50000
        }
      }
    });
    if (!error && data.user) {
      setUser(data.user);
      showToast('Your Freelens journey starts now!', 'Account Created');
    }
    setLoading(false);
    return { data, error };
  };

  // Sign out handler
  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProjects([]);
      setClients([]);
      setGoals({ monthly_target: 50000, current: 0 });
      showToast('Logged out successfully.', 'See You Soon');
    }
    setLoading(false);
  };

  // Add project and trigger updates, goals, and achievements
  const addProject = async (projectData) => {
    const newProject = {
      id: 'p-' + Math.random().toString(36).substr(2, 9),
      name: projectData.name,
      amount: Number(projectData.amount),
      client: projectData.client,
      category: projectData.category,
      date: projectData.date || getLocalDateString(),
      status: projectData.status || 'Completed'
    };

    // Update active state arrays
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);

    // Recalculate client revenues
    const updatedClients = recalculateClients(updatedProjects, clients);
    setClients(updatedClients);

    // Calculate goals and progress (restricted to current month)
    const currentMonthStr = getLocalDateString().slice(0, 7);
    const currentMonthEarnings = updatedProjects
      .filter(p => p.date.startsWith(currentMonthStr) && p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const updatedGoals = {
      ...goals,
      current: currentMonthEarnings
    };
    
    // Trigger achievement unlocks
    let achievementsModified = false;
    const totalEarningsAllTime = updatedProjects
      .filter(p => p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalProjectsCount = updatedProjects.filter(p => p.status === 'Completed').length;

    const updatedAchievements = achievements.map(ach => {
      if (!ach.unlocked) {
        let shouldUnlock = false;
        
        if (ach.id === 'ach1' && totalProjectsCount >= 1) shouldUnlock = true;
        if (ach.id === 'ach2' && totalEarningsAllTime >= 10000) shouldUnlock = true;
        if (ach.id === 'ach3' && totalEarningsAllTime >= 100000) shouldUnlock = true;
        if (ach.id === 'ach4' && totalProjectsCount >= 100) shouldUnlock = true;
        
        if (shouldUnlock) {
          achievementsModified = true;
          triggerConfetti();
          showToast(`Unlocked achievement: "${ach.name}"!`, 'Achievement Unlocked 🏆');
          return {
            ...ach,
            unlocked: true,
            date: getLocalDateString()
          };
        }
      }
      return ach;
    });

    if (achievementsModified) {
      setAchievements(updatedAchievements);
    } else {
      if (updatedGoals.current >= updatedGoals.monthly_target && goals.current < goals.monthly_target) {
        triggerConfetti();
        showToast('You hit your monthly creative income goal! 🎯', 'Goal Reached!');
      }
    }

    setGoals(updatedGoals);

    // Sync to Supabase if configured
    if (isSupabaseConfigured && user) {
      try {
        await supabase.from('projects').insert({
          id: newProject.id,
          name: newProject.name,
          amount: newProject.amount,
          client: newProject.client,
          category: newProject.category,
          date: newProject.date,
          status: newProject.status,
          user_id: user.id
        });

        const targetClient = updatedClients.find(c => c.name.toLowerCase() === projectData.client.toLowerCase());
        if (targetClient) {
          await supabase.from('clients').upsert({
            id: targetClient.id,
            name: targetClient.name,
            avatar: targetClient.avatar,
            revenue: targetClient.revenue,
            projects: targetClient.projects,
            growth: targetClient.growth,
            user_id: user.id
          });
        }
      } catch (dbErr) {
        console.error('Failed to sync project/client update to Supabase:', dbErr);
        setDbError(true);
      }
    }

    // Always sync to local storage mock db
    const dbState = mockDb.getData();
    dbState.projects = updatedProjects;
    dbState.clients = updatedClients;
    dbState.goals = updatedGoals;
    dbState.achievements = updatedAchievements;
    mockDb.saveData(dbState);

    showToast(`Added project "${newProject.name}" successfully!`, 'Project Tracked');
  };

  // Toggle project status between Completed and Pending
  const toggleProjectStatus = async (projectId) => {
    let wasCompleted = false;
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const nextStatus = p.status === 'Completed' ? 'Pending' : 'Completed';
        if (nextStatus === 'Completed') {
          wasCompleted = true;
        }
        showToast(`Project status marked as "${nextStatus === 'Completed' ? 'Completed' : 'Pending'}"`, 'Status Updated');
        return {
          ...p,
          status: nextStatus
        };
      }
      return p;
    });

    setProjects(updatedProjects);

    const updatedClients = recalculateClients(updatedProjects, clients);
    setClients(updatedClients);

    const currentMonthStr = getLocalDateString().slice(0, 7);
    const currentMonthEarnings = updatedProjects
      .filter(p => p.date.startsWith(currentMonthStr) && p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const updatedGoals = {
      ...goals,
      current: currentMonthEarnings
    };
    setGoals(updatedGoals);

    let achievementsModified = false;
    let finalAchievements = achievements;

    if (wasCompleted) {
      triggerConfetti();

      const totalEarningsAllTime = updatedProjects
        .filter(p => p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);
      const totalProjectsCount = updatedProjects.filter(p => p.status === 'Completed').length;

      finalAchievements = achievements.map(ach => {
        if (!ach.unlocked) {
          let shouldUnlock = false;
          
          if (ach.id === 'ach1' && totalProjectsCount >= 1) shouldUnlock = true;
          if (ach.id === 'ach2' && totalEarningsAllTime >= 10000) shouldUnlock = true;
          if (ach.id === 'ach3' && totalEarningsAllTime >= 100000) shouldUnlock = true;
          if (ach.id === 'ach4' && totalProjectsCount >= 100) shouldUnlock = true;
          
          if (shouldUnlock) {
            achievementsModified = true;
            triggerConfetti();
            showToast(`Unlocked milestone: "${ach.name}"!`, 'Milestone Unlocked 🏆');
            return {
              ...ach,
              unlocked: true,
              date: getLocalDateString()
            };
          }
        }
        return ach;
      });

      if (achievementsModified) {
        setAchievements(finalAchievements);
      } else {
        if (updatedGoals.current >= updatedGoals.monthly_target && goals.current < goals.monthly_target) {
          triggerConfetti();
          showToast('You hit your monthly creative income goal! 🎯', 'Goal Reached!');
        }
      }
    }

    // Sync to Supabase if configured
    if (isSupabaseConfigured && user) {
      try {
        const targetProj = updatedProjects.find(p => p.id === projectId);
        await supabase.from('projects').update({ status: targetProj.status }).eq('id', projectId);

        const targetClient = updatedClients.find(c => c.name.toLowerCase() === targetProj.client.toLowerCase());
        if (targetClient) {
          await supabase.from('clients').upsert({
            id: targetClient.id,
            name: targetClient.name,
            avatar: targetClient.avatar,
            revenue: targetClient.revenue,
            projects: targetClient.projects,
            growth: targetClient.growth,
            user_id: user.id
          });
        }
      } catch (dbErr) {
        console.error('Failed to sync project status update to Supabase:', dbErr);
        setDbError(true);
      }
    }

    const dbState = mockDb.getData();
    dbState.projects = updatedProjects;
    dbState.clients = updatedClients;
    dbState.goals = updatedGoals;
    dbState.achievements = finalAchievements;
    mockDb.saveData(dbState);

    if (updatedGoals.current >= updatedGoals.monthly_target && goals.current < goals.monthly_target) {
      triggerConfetti();
      showToast('You hit your monthly creative income goal! 🎯', 'Goal Reached!');
    }
  };

  // Add client directly
  const addClient = async (clientName, avatarEmoji) => {
    if (clients.some(c => c.name.toLowerCase() === clientName.toLowerCase())) {
      showToast(`Client "${clientName}" is already registered.`, 'Client Exists');
      return;
    }

    const newClient = {
      id: 'c-' + Math.random().toString(36).substr(2, 9),
      name: clientName,
      avatar: avatarEmoji || '💼',
      revenue: 0,
      projects: 0,
      growth: 10
    };

    const updatedClients = [newClient, ...clients];
    setClients(updatedClients);

    // Sync to Supabase if configured
    if (isSupabaseConfigured && user) {
      try {
        await supabase.from('clients').insert({
          id: newClient.id,
          name: newClient.name,
          avatar: newClient.avatar,
          revenue: newClient.revenue,
          projects: newClient.projects,
          growth: newClient.growth,
          user_id: user.id
        });
      } catch (dbErr) {
        console.error('Failed to insert client to Supabase:', dbErr);
        setDbError(true);
      }
    }

    const dbState = mockDb.getData();
    dbState.clients = updatedClients;
    mockDb.saveData(dbState);

    showToast(`Client "${clientName}" registered successfully!`, 'Client Registered');
  };

  // Delete client and associated projects
  const deleteClient = async (clientId) => {
    const targetClient = clients.find(c => c.id === clientId);
    if (!targetClient) return;

    const clientName = targetClient.name;
    const updatedClients = clients.filter(c => c.id !== clientId);
    setClients(updatedClients);

    // Filter out associated projects
    const updatedProjects = projects.filter(p => p.client.toLowerCase() !== clientName.toLowerCase());
    setProjects(updatedProjects);

    // Recalculate current month's goals
    const currentMonthStr = getLocalDateString().slice(0, 7);
    const currentMonthEarnings = updatedProjects
      .filter(p => p.date.startsWith(currentMonthStr) && p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const updatedGoals = {
      ...goals,
      current: currentMonthEarnings
    };
    setGoals(updatedGoals);

    // Sync to Supabase if configured
    if (isSupabaseConfigured && user) {
      try {
        await supabase.from('clients').delete().eq('id', clientId);
        await supabase.from('projects').delete().eq('client', clientName);
      } catch (dbErr) {
        console.error('Failed to delete client/projects in Supabase:', dbErr);
        setDbError(true);
      }
    }

    // Save to local storage
    const dbState = mockDb.getData();
    dbState.clients = updatedClients;
    dbState.projects = updatedProjects;
    dbState.goals = updatedGoals;
    mockDb.saveData(dbState);

    showToast(`Client "${clientName}" and associated projects deleted.`, 'Client Removed');
  };

  // Update client name/avatar and cascade to associated projects
  const updateClient = async (clientId, newName, newAvatar) => {
    const targetClient = clients.find(c => c.id === clientId);
    if (!targetClient) return;

    const oldName = targetClient.name;
    
    if (oldName.toLowerCase() !== newName.toLowerCase() && clients.some(c => c.id !== clientId && c.name.toLowerCase() === newName.toLowerCase())) {
      showToast(`Client "${newName}" is already registered.`, 'Client Exists');
      return;
    }

    const updatedClients = clients.map(c => {
      if (c.id === clientId) {
        return { ...c, name: newName, avatar: newAvatar };
      }
      return c;
    });

    const updatedProjects = projects.map(p => {
      if (p.client.toLowerCase() === oldName.toLowerCase()) {
        return { ...p, client: newName };
      }
      return p;
    });

    setClients(updatedClients);
    setProjects(updatedProjects);

    // Sync to Supabase if configured
    if (isSupabaseConfigured && user) {
      try {
        await supabase.from('clients').update({
          name: newName,
          avatar: newAvatar
        }).eq('id', clientId);

        await supabase.from('projects').update({
          client: newName
        }).eq('client', oldName);
      } catch (dbErr) {
        console.error('Failed to update client/projects in Supabase:', dbErr);
        setDbError(true);
      }
    }

    // Save to local storage
    const dbState = mockDb.getData();
    dbState.clients = updatedClients;
    dbState.projects = updatedProjects;
    mockDb.saveData(dbState);

    showToast(`Client updated to "${newName}" successfully!`, 'Client Updated');
  };

  // Set monthly goal amount
  const updateGoal = async (targetAmount) => {
    const updatedGoals = {
      ...goals,
      monthly_target: Number(targetAmount)
    };
    setGoals(updatedGoals);

    if (isSupabaseConfigured && user) {
      try {
        await supabase.from('goals').upsert({
          user_id: user.id,
          monthly_target: Number(targetAmount)
        });
      } catch (dbErr) {
        console.error('Failed to sync goal to Supabase:', dbErr);
        setDbError(true);
      }
    }

    const dbState = mockDb.getData();
    dbState.goals = updatedGoals;
    mockDb.saveData(dbState);
    
    showToast(`Monthly goal set to ₹${targetAmount.toLocaleString()}`, 'Settings Updated');
    if (goals.current >= targetAmount) {
      triggerConfetti();
    }
  };

  // Update user profile metadata (username/avatar)
  const updateProfile = async (fullName, avatarUrl) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl
        }
      });
      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
        showToast('Your profile settings have been saved.', 'Profile Updated');
      }
      return { data, error: null };
    } catch (err) {
      console.error('Error updating user profile:', err);
      showToast(err.message || 'Failed to update profile.', 'Update Error');
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      projects,
      clients,
      goals,
      achievements,
      toast,
      dbError,
      isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
      addProject,
      updateGoal,
      updateProfile,
      toggleProjectStatus,
      addClient,
      deleteClient,
      updateClient,
      showToast,
      triggerConfetti
    }}>
      {children}
      {toast && (
        <div className="toast-popup animate-slide-in-up">
          <div className="toast-icon">🏆</div>
          <div className="toast-details">
            <h4>{toast.title}</h4>
            <p>{toast.message}</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
