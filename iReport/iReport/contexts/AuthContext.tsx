import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { User, StaffMember, Student, UserRole, StaffPermission, hasPermission } from '@/types';
import { AUTH_TOKEN_STORAGE_KEY, hasBackendApi, loginWithBackend } from '@/lib/backendApi';

const STORAGE_KEYS = {
  CURRENT_USER: 'school_current_user',
  STAFF: 'school_staff_members',
};

const BACKEND_ROLE_MAP: Record<'student' | 'teacher' | 'admin' | 'staff', UserRole> = {
  student: 'student',
  teacher: 'teacher',
  admin: 'admin',
  staff: 'guidance',
};

const DEFAULT_ADMIN: StaffMember = {
  id: 'admin_default',
  role: 'admin',
  fullName: 'System Administrator',
  email: 'admin@school.edu',
  password: 'admin123',
  schoolEmail: 'admin@school.edu',
  staffId: 'ADMIN001',
  position: 'principal',
  permissions: [
    'edit_students',
    'assign_grades_sections',
    'promote_transfer_students',
    'edit_staff_profiles',
    'manage_reports',
    'access_sensitive_data',
    'manage_permissions',
    'view_all_reports',
    'create_grades_sections',
    'remove_students',
  ],
  isActive: true,
  createdAt: new Date().toISOString(),
};

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [currentUser, setCurrentUser] = useState<User | StaffMember | Student | null>(null);
  const queryClient = useQueryClient();

  const currentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    },
  });

  useEffect(() => {
    if (currentUserQuery.data !== undefined) {
      setCurrentUser(currentUserQuery.data);
    }
  }, [currentUserQuery.data]);

  const staffQuery = useQuery({
    queryKey: ['staffMembers'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.STAFF);
      if (stored) {
        const staffList = JSON.parse(stored);
        const hasAdmin = staffList.some((s: StaffMember) => s.id === 'admin_default');
        if (!hasAdmin) {
          const updated = [...staffList, DEFAULT_ADMIN];
          await AsyncStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(updated));
          return updated;
        }
        return staffList;
      }
      await AsyncStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify([DEFAULT_ADMIN]));
      return [DEFAULT_ADMIN];
    },
  });

  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem('school_students');
      return stored ? JSON.parse(stored) : [];
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      // Prefer backend authentication when API URL is configured.
      if (hasBackendApi) {
        const result = await loginWithBackend(email, password);
        const mappedRole = BACKEND_ROLE_MAP[result.user.role] || 'student';

        if (mappedRole === 'student') {
          const backendStudent: Student = {
            id: result.user.id,
            role: 'student',
            fullName: result.user.name,
            email: result.user.email,
            schoolEmail: result.user.email,
            password: '',
            profilePhoto: undefined,
            createdAt: new Date().toISOString(),
            isActive: true,
            lrn: result.user.id.slice(-6),
            gradeLevelId: 'g7',
            sectionId: 'backend',
            violationHistory: [],
          };
          await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(backendStudent));
          await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token);
          return backendStudent;
        }

        const backendStaff: StaffMember = {
          id: result.user.id,
          role: mappedRole as StaffMember['role'],
          fullName: result.user.name,
          email: result.user.email,
          schoolEmail: result.user.email,
          password: '',
          profilePhoto: undefined,
          createdAt: new Date().toISOString(),
          isActive: true,
          staffId: result.user.id.slice(-6).toUpperCase(),
          position: mappedRole === 'teacher' ? 'teacher' : 'guidance_counselor',
          permissions: [],
        };
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(backendStaff));
        await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token);
        return backendStaff;
      }

      // Ensure data is loaded before login attempt
      let staffMembers: StaffMember[] = staffQuery.data || [];
      const students: Student[] = studentsQuery.data || [];
      
      // If staff data not loaded yet, try to load it directly
      if (staffMembers.length === 0) {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.STAFF);
        if (stored) {
          staffMembers = JSON.parse(stored);
        } else {
          // Initialize with default admin if nothing exists
          staffMembers = [DEFAULT_ADMIN];
          await AsyncStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffMembers));
        }
      }
      
      const staffUser = staffMembers.find(s => 
        s.schoolEmail.toLowerCase() === email.toLowerCase() && 
        s.password === password &&
        s.isActive
      );
      
      if (staffUser) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(staffUser));
        return staffUser;
      }
      
      const studentUser = students.find(s => 
        (s.email.toLowerCase() === email.toLowerCase() || s.schoolEmail?.toLowerCase() === email.toLowerCase()) && 
        s.password === password &&
        s.isActive
      );
      
      if (studentUser) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(studentUser));
        return studentUser;
      }

      throw new Error('Invalid email or password');
    },
    onSuccess: (user) => {
      setCurrentUser(user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    },
    onSuccess: () => {
      setCurrentUser(null);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const updateCurrentUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      if (!currentUser) throw new Error('No user logged in');
      
      const updated = { ...currentUser, ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
      
      if (currentUser.role === 'student') {
        const students: Student[] = studentsQuery.data || [];
        const index = students.findIndex(s => s.id === currentUser.id);
        if (index !== -1) {
          students[index] = updated as Student;
          await AsyncStorage.setItem('school_students', JSON.stringify(students));
          queryClient.invalidateQueries({ queryKey: ['students'] });
        }
      } else {
        const staffMembers: StaffMember[] = staffQuery.data || [];
        const index = staffMembers.findIndex(s => s.id === currentUser.id);
        if (index !== -1) {
          staffMembers[index] = updated as StaffMember;
          await AsyncStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffMembers));
          queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
        }
      }
      
      return updated;
    },
    onSuccess: (user) => {
      setCurrentUser(user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'principal';
  const isGuidance = currentUser?.role === 'guidance';
  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';
  
  const canAccessFullDashboard = isAdmin || isGuidance;
  
  const checkPermission = (permission: StaffPermission): boolean => {
    if (!currentUser || currentUser.role === 'student') return false;
    return hasPermission(currentUser as StaffMember, permission);
  };

  const getStaffMember = (): StaffMember | null => {
    if (!currentUser || currentUser.role === 'student') return null;
    return currentUser as StaffMember;
  };

  const getStudent = (): Student | null => {
    if (!currentUser || currentUser.role !== 'student') return null;
    return currentUser as Student;
  };

  return {
    currentUser,
    isLoading: currentUserQuery.isLoading || staffQuery.isLoading || studentsQuery.isLoading,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    updateCurrentUser: updateCurrentUserMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    isAdmin,
    isGuidance,
    isTeacher,
    isStudent,
    canAccessFullDashboard,
    checkPermission,
    getStaffMember,
    getStudent,
  };
});
