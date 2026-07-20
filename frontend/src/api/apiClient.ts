import productsMock from '../mock/products.json';
import categoriesMock from '../mock/categories.json';
import brandsMock from '../mock/brands.json';
import seriesMock from '../mock/series.json';
import bannersMock from '../mock/banners.json';
import usersMock from '../mock/users.json';
import ordersMock from '../mock/orders.json';
import blogsMock from '../mock/blogs.json';
import reviewsMock from '../mock/reviews.json';
import { ApiResponse } from '../types/common';

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'; // Default to true for demo
const LATENCY = 500; // Simulated network delay in ms

// Seed LocalStorage mock db if empty
const initMockDB = () => {
  if (typeof window === 'undefined') return;
  
  const DB_VERSION = 'v5'; // Increment version to force clear old database
  const currentVersion = localStorage.getItem('prenippon_db_version');
  
  if (currentVersion !== DB_VERSION) {
    const keys = ['products', 'categories', 'brands', 'series', 'banners', 'users', 'orders', 'blogs', 'reviews'];
    keys.forEach(k => localStorage.removeItem(`prenippon_${k}`));
    localStorage.setItem('prenippon_db_version', DB_VERSION);
  }
  
  const tables = {
    products: productsMock,
    categories: categoriesMock,
    brands: brandsMock,
    series: seriesMock,
    banners: bannersMock,
    users: usersMock,
    orders: ordersMock,
    blogs: blogsMock,
    reviews: reviewsMock
  };

  Object.entries(tables).forEach(([key, val]) => {
    if (!localStorage.getItem(`prenippon_${key}`)) {
      localStorage.setItem(`prenippon_${key}`, JSON.stringify(val));
    }
  });
};

initMockDB();

export const getMockTable = <T>(tableName: string): T[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(`prenippon_${tableName}`);
  return data ? JSON.parse(data) : [];
};

export const setMockTable = <T>(tableName: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`prenippon_${tableName}`, JSON.stringify(data));
};

// Delay simulator
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiClient = {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    await delay(LATENCY);
    
    // Router logic for mock data
    if (url.startsWith('/products')) {
      if (url === '/products' || url.startsWith('/products?')) {
        return { statusCode: 200, message: 'Success', data: getMockTable<any>('products') as unknown as T };
      }
      const slug = url.split('/').pop()?.split('?')[0];
      const prod = getMockTable<any>('products').find((p) => p.slug === slug || String(p.id) === slug);
      if (prod) return { statusCode: 200, message: 'Success', data: prod as T };
      throw new Error('Product not found');
    }

    if (url.startsWith('/categories')) {
      return { statusCode: 200, message: 'Success', data: getMockTable<any>('categories') as unknown as T };
    }

    if (url.startsWith('/brands')) {
      return { statusCode: 200, message: 'Success', data: getMockTable<any>('brands') as unknown as T };
    }

    if (url.startsWith('/series')) {
      return { statusCode: 200, message: 'Success', data: getMockTable<any>('series') as unknown as T };
    }

    if (url.startsWith('/banners')) {
      const allBanners = getMockTable<any>('banners');
      // Return only active banners
      return { statusCode: 200, message: 'Success', data: allBanners as unknown as T };
    }

    if (url.startsWith('/blogs')) {
      if (url === '/blogs') {
        return { statusCode: 200, message: 'Success', data: getMockTable<any>('blogs') as unknown as T };
      }
      const slug = url.split('/').pop()?.split('?')[0];
      const blog = getMockTable<any>('blogs').find((b) => b.slug === slug || String(b.id) === slug);
      if (blog) return { statusCode: 200, message: 'Success', data: blog as T };
      throw new Error('Blog post not found');
    }

    if (url.startsWith('/orders')) {
      if (url.startsWith('/orders/track/')) {
        const code = url.split('/').pop();
        const ord = getMockTable<any>('orders').find((o) => o.orderCode === code);
        if (ord) return { statusCode: 200, message: 'Success', data: ord as T };
        throw new Error('Order not found');
      }
      return { statusCode: 200, message: 'Success', data: getMockTable<any>('orders') as unknown as T };
    }

    if (url.startsWith('/users')) {
      return { statusCode: 200, message: 'Success', data: getMockTable<any>('users') as unknown as T };
    }

    if (url.startsWith('/reviews')) {
      return { statusCode: 200, message: 'Success', data: getMockTable<any>('reviews') as unknown as T };
    }

    throw new Error(`Endpoint GET ${url} not mocked.`);
  },

  async post<T>(url: string, body: any): Promise<ApiResponse<T>> {
    await delay(LATENCY);

    if (url === '/auth/login') {
      const users = getMockTable<any>('users');
      const foundUser = users.find(
        (u) => u.email === body.email && body.password === '123456' // Dummy password checker
      );
      if (foundUser) {
        if (foundUser.status === 'BLOCKED') {
          throw new Error('Tài khoản của bạn đã bị khóa!');
        }
        return {
          statusCode: 200,
          message: 'Login Success',
          data: { user: foundUser, token: 'mock-jwt-token-12345' } as unknown as T
        };
      }
      throw new Error('Email hoặc mật khẩu không chính xác!');
    }

    if (url === '/products') {
      const items = getMockTable<any>('products');
      const newItem = { ...body, id: items.length + 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      items.push(newItem);
      setMockTable('products', items);
      return { statusCode: 201, message: 'Created', data: newItem as unknown as T };
    }

    if (url === '/orders') {
      const items = getMockTable<any>('orders');
      const products = getMockTable<any>('products');
      const orderCode = `PRE-2026-${String(items.length + 1).padStart(4, '0')}`;
      
      const newOrder = {
        ...body,
        id: items.length + 1,
        orderCode: orderCode,
        status: body.requiredDeposit > 0 ? 'PENDING' : 'COMPLETED',
        paymentStatus: 'UNPAID',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Deduct product inventory or increase campaign order quantity
      newOrder.items.forEach((item: any) => {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          if (item.type === 'PREORDER' && prod.campaign) {
            prod.campaign.orderedQuantity += item.quantity;
          } else {
            prod.quantity = Math.max(0, prod.quantity - item.quantity);
          }
        }
      });

      setMockTable('products', products);

      // Add payment log if COD
      if (body.paymentMethod === 'COD') {
        newOrder.payments = [
          {
            id: randRange(100000, 999999),
            orderId: newOrder.id,
            amount: newOrder.totalAmount,
            paymentMethod: 'COD',
            paymentType: 'FULL_PAYMENT',
            status: 'PENDING',
            createdAt: new Date().toISOString()
          }
        ];
      }

      items.push(newOrder);
      setMockTable('orders', items);
      return { statusCode: 201, message: 'Order Placed', data: newOrder as unknown as T };
    }

    if (url === '/blogs') {
      const items = getMockTable<any>('blogs');
      const newItem = { ...body, id: items.length + 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      items.push(newItem);
      setMockTable('blogs', items);
      return { statusCode: 201, message: 'Created', data: newItem as unknown as T };
    }

    if (url === '/banners') {
      const items = getMockTable<any>('banners');
      const newItem = { ...body, id: items.length + 1 };
      items.push(newItem);
      setMockTable('banners', items);
      return { statusCode: 201, message: 'Created', data: newItem as unknown as T };
    }

    throw new Error(`Endpoint POST ${url} not mocked.`);
  },

  async put<T>(url: string, body: any): Promise<ApiResponse<T>> {
    await delay(LATENCY);

    if (url.startsWith('/products/')) {
      const id = parseInt(url.split('/').pop() || '0');
      const items = getMockTable<any>('products');
      const idx = items.findIndex((i) => i.id === id);
      if (idx > -1) {
        items[idx] = { ...items[idx], ...body, updatedAt: new Date().toISOString() };
        setMockTable('products', items);
        return { statusCode: 200, message: 'Updated', data: items[idx] as T };
      }
      throw new Error('Product not found');
    }

    if (url.startsWith('/orders/')) {
      const id = parseInt(url.split('/').pop() || '0');
      const items = getMockTable<any>('orders');
      const idx = items.findIndex((i) => i.id === id);
      if (idx > -1) {
        items[idx] = { ...items[idx], ...body, updatedAt: new Date().toISOString() };
        setMockTable('orders', items);
        return { statusCode: 200, message: 'Updated', data: items[idx] as T };
      }
      throw new Error('Order not found');
    }

    if (url.startsWith('/users/')) {
      const id = parseInt(url.split('/').pop() || '0');
      const items = getMockTable<any>('users');
      const idx = items.findIndex((i) => i.id === id);
      if (idx > -1) {
        items[idx] = { ...items[idx], ...body, updatedAt: new Date().toISOString() };
        setMockTable('users', items);
        return { statusCode: 200, message: 'Updated', data: items[idx] as T };
      }
      throw new Error('User not found');
    }

    if (url.startsWith('/blogs/')) {
      const id = parseInt(url.split('/').pop() || '0');
      const items = getMockTable<any>('blogs');
      const idx = items.findIndex((i) => i.id === id);
      if (idx > -1) {
        items[idx] = { ...items[idx], ...body, updatedAt: new Date().toISOString() };
        setMockTable('blogs', items);
        return { statusCode: 200, message: 'Updated', data: items[idx] as T };
      }
      throw new Error('Blog not found');
    }

    if (url.startsWith('/banners/')) {
      const id = parseInt(url.split('/').pop() || '0');
      const items = getMockTable<any>('banners');
      const idx = items.findIndex((i) => i.id === id);
      if (idx > -1) {
        items[idx] = { ...items[idx], ...body };
        setMockTable('banners', items);
        return { statusCode: 200, message: 'Updated', data: items[idx] as T };
      }
      throw new Error('Banner not found');
    }

    throw new Error(`Endpoint PUT ${url} not mocked.`);
  },

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    await delay(LATENCY);

    if (url.startsWith('/products/')) {
      const id = parseInt(url.split('/').pop() || '0');
      let items = getMockTable<any>('products');
      items = items.filter((i) => i.id !== id);
      setMockTable('products', items);
      return { statusCode: 200, message: 'Deleted', data: true as unknown as T };
    }

    if (url.startsWith('/blogs/')) {
      const id = parseInt(url.split('/').pop() || '0');
      let items = getMockTable<any>('blogs');
      items = items.filter((i) => i.id !== id);
      setMockTable('blogs', items);
      return { statusCode: 200, message: 'Deleted', data: true as unknown as T };
    }

    if (url.startsWith('/banners/')) {
      const id = parseInt(url.split('/').pop() || '0');
      let items = getMockTable<any>('banners');
      items = items.filter((i) => i.id !== id);
      setMockTable('banners', items);
      return { statusCode: 200, message: 'Deleted', data: true as unknown as T };
    }

    throw new Error(`Endpoint DELETE ${url} not mocked.`);
  }
};

function randRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
