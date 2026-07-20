import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BannerService } from '../services/BannerService';
import { Banner } from '../types/common';

export const useBanners = () => {
  const queryClient = useQueryClient();

  const bannersQuery = useQuery<Banner[], Error>({
    queryKey: ['banners'],
    queryFn: BannerService.getBanners,
  });

  const createBannerMutation = useMutation({
    mutationFn: BannerService.createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: ({ id, banner }: { id: number; banner: Partial<Banner> }) =>
      BannerService.updateBanner(id, banner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: BannerService.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });

  return {
    banners: bannersQuery.data || [],
    isLoading: bannersQuery.isLoading,
    isError: bannersQuery.isError,
    createBanner: createBannerMutation.mutateAsync,
    isCreating: createBannerMutation.isPending,
    updateBanner: updateBannerMutation.mutateAsync,
    isUpdating: updateBannerMutation.isPending,
    deleteBanner: deleteBannerMutation.mutateAsync,
    isDeleting: deleteBannerMutation.isPending,
  };
};
