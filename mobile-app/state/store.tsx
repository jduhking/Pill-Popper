import { create } from 'zustand';
import BleManager, { Peripheral } from 'react-native-ble-manager';

type State = {
  connectedDispenser: Peripheral | undefined;
  peripherals: Map<string, Peripheral>
  isScanning: boolean;
}

type Actions = {
    setConnectedDispenser: (dispenser: Peripheral | undefined) => void;
    setIsScanning: (value: boolean) => void;
    setPeripherals: (peripherals: Map<string, Peripheral>) => void;
}

const initialState: State = {
    connectedDispenser: undefined,
    peripherals: new Map<Peripheral['id'], Peripheral>(),
    isScanning: false

}

export const useAppStore = create<State & Actions>((set) => ({
    ...initialState,
    setConnectedDispenser: (dispenser: Peripheral | undefined) => set((state) => ({ connectedDispenser: dispenser })),
    setIsScanning: (value: boolean) => set((state) => ({ isScanning: value})),
    setPeripherals: (map: Map<string, Peripheral>) => set((state) => ({ peripherals: map}))
}))