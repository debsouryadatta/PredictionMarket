import { create } from 'zustand'


export const useStore = create((set) => ({
    provider: {},
    setProvider: (provider: object) => set({ provider }),
    contract: {},
    setContract: (contract: object) => set({ contract }),
    account: {},
    setAccount: (account: string) => set({ account }),
    isConnected: false,
    setIsConnected: (isConnected: boolean) => set({ isConnected }),
}))