import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/ProductService';
import { Product } from '../types/product';

export const useProducts = () => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: ProductService.getProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createProductMutation = useMutation({
    mutationFn: ProductService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, product }: { id: number; product: Partial<Product> }) =>
      ProductService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: ProductService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    refetch: productsQuery.refetch,
    createProduct: createProductMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    updateProduct: updateProductMutation.mutateAsync,
    isUpdating: updateProductMutation.isPending,
    deleteProduct: deleteProductMutation.mutateAsync,
    isDeleting: deleteProductMutation.isPending,
  };
};

export const useProduct = (slug: string) => {
  const productQuery = useQuery<Product, Error>({
    queryKey: ['product', slug],
    queryFn: () => ProductService.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  return {
    product: productQuery.data,
    isLoading: productQuery.isLoading,
    isError: productQuery.isError,
    error: productQuery.error,
    refetch: productQuery.refetch,
  };
};
