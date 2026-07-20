import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { UserService } from '../services/UserService';
import { User } from '../types/user';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, login: storeLogin, logout: storeLogout, updateUserPoints, updateUserTier } = useAuthStore();

  const usersQuery = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: UserService.getUsers,
    enabled: isAuthenticated && user?.role === 'ROLE_ADMIN', // Only admins can fetch the users list
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: any) => UserService.login(email, password),
    onSuccess: (data) => {
      storeLogin(data.user, data.token);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: number; user: Partial<User> }) =>
      UserService.updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    user,
    token,
    isAuthenticated,
    users: usersQuery.data || [],
    isLoadingUsers: usersQuery.isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: storeLogout,
    updateUser: updateUserMutation.mutateAsync,
    isUpdatingUser: updateUserMutation.isPending,
    updateUserPoints,
    updateUserTier,
  };
};
