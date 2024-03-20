import { create } from 'zustand';
import BleManager, { Peripheral } from 'react-native-ble-manager';
import { Record } from '../models/record'

type State = {
  connectedDispenser: Peripheral | undefined;
  peripherals: Map<string, Peripheral>;
  isScanning: boolean;
  record: Record | undefined;
}

type Actions = {
    setConnectedDispenser: (dispenser: Peripheral | undefined) => void;
    setIsScanning: (value: boolean) => void;
    setPeripherals: (peripherals: Map<string, Peripheral>) => void;
    setRecord: (record: Record) => void;
}

const initialState: State = {
    connectedDispenser: undefined,
    peripherals: new Map<Peripheral['id'], Peripheral>(),
    isScanning: false,
    record: undefined
}

export const useAppStore = create<State & Actions>((set) => ({
    ...initialState,
    setConnectedDispenser: (dispenser: Peripheral | undefined) => set((state) => ({ connectedDispenser: dispenser })),
    setIsScanning: (value: boolean) => set((state) => ({ isScanning: value})),
    setPeripherals: (map: Map<string, Peripheral>) => set((state) => ({ peripherals: map})),
    setRecord: (record: Record) => set((state) => ({ record: record}))
}))