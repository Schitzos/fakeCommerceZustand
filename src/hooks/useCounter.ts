import {createSelectors} from '@/utils/zustand';
import {create} from 'zustand';

interface UseCounterProps {
  count: number;
  setCount: (val: number) => void;
  resetCount: () => void;
}

export const useCounterBase = create<UseCounterProps>(set => ({
  count: 1,
  setCount: (val: number) => set(() => ({count: val})),
  resetCount: () => set(() => ({count: 1})),
}));

export const useCounterStore = createSelectors(useCounterBase);
