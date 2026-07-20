import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogService } from '../services/BlogService';
import { Blog } from '../types/blog';

const DEFAULT_BLOGS: Blog[] = [];

export const useBlogs = () => {
  const queryClient = useQueryClient();

  const blogsQuery = useQuery<Blog[], Error>({
    queryKey: ['blogs'],
    queryFn: BlogService.getBlogs,
  });

  const createBlogMutation = useMutation({
    mutationFn: BlogService.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, blog }: { id: number; blog: Partial<Blog> }) =>
      BlogService.updateBlog(id, blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: BlogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  return {
    blogs: blogsQuery.data || DEFAULT_BLOGS,
    isLoading: blogsQuery.isLoading,
    isError: blogsQuery.isError,
    createBlog: createBlogMutation.mutateAsync,
    isCreating: createBlogMutation.isPending,
    updateBlog: updateBlogMutation.mutateAsync,
    isUpdating: updateBlogMutation.isPending,
    deleteBlog: deleteBlogMutation.mutateAsync,
    isDeleting: deleteBlogMutation.isPending,
  };
};

export const useBlog = (slug: string) => {
  const blogQuery = useQuery<Blog, Error>({
    queryKey: ['blog', slug],
    queryFn: () => BlogService.getBlogBySlug(slug),
    enabled: !!slug,
  });

  return {
    blog: blogQuery.data,
    isLoading: blogQuery.isLoading,
    isError: blogQuery.isError,
  };
};
