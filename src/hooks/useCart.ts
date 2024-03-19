import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProductItemProps} from '@/types/Product';
import dayjs from 'dayjs';
import {createSelectors} from '@/utils/zustand';

interface UseCartProps {
  cart: ProductItemProps[];
  addToCart: (newItem: ProductItemProps) => void;
  updateCart: (val: number, id: number) => void;
  selectCartItem: (val: boolean, id: number) => void;
  clearCart: () => void;
}

const useCartBase = create(
  persist<UseCartProps>(
    set => ({
      cart: [],
      addToCart: (newItem: ProductItemProps) =>
        set(prevState => {
          const updatedCart = [...prevState.cart];
          const existingProductIndex = updatedCart.findIndex(
            item => item.id === newItem.id,
          );

          if (existingProductIndex !== -1) {
            const existingProduct = updatedCart[existingProductIndex];
            const count = existingProduct.count ?? 0;
            const total = existingProduct.total ?? 0;

            updatedCart[existingProductIndex] = {
              ...existingProduct,
              count: count + (newItem.count ?? 0),
              total: total + (newItem.total ?? 0),
              updatedAt: dayjs(),
            };
          } else {
            newItem.updatedAt = dayjs();
            updatedCart.push(newItem);
          }
          const sortedCartByDate = updatedCart.sort(
            (a: ProductItemProps, b: ProductItemProps) =>
              dayjs(b.updatedAt).toDate().getTime() -
              dayjs(a.updatedAt).toDate().getTime(),
          );
          return {cart: sortedCartByDate};
        }),
      updateCart: (val: number, id: number) =>
        set(prevState => {
          const existingProductIndex = prevState.cart.findIndex(
            (item: ProductItemProps) => item.id === id,
          );
          const updatedCart = [...prevState.cart];

          if (existingProductIndex !== -1) {
            updatedCart[existingProductIndex] = {
              ...updatedCart[existingProductIndex],
              count: val,
              total: updatedCart[existingProductIndex].price * val,
            };
          }
          return {cart: updatedCart};
        }),
      selectCartItem: (val: boolean, id: number) =>
        set(prevState => {
          const existingProductIndex = prevState.cart.findIndex(
            (item: ProductItemProps) => item.id === id,
          );
          const updatedCart = [...prevState.cart];

          if (existingProductIndex !== -1) {
            updatedCart[existingProductIndex] = {
              ...updatedCart[existingProductIndex],
              selected: val,
            };
          }
          return {cart: updatedCart};
        }),
      clearCart: () => set(() => ({cart: []})),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useCartStore = createSelectors(useCartBase);
