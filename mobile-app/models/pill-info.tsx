export type PillInfo = {
    id: string; // string representing the id of the pill
    name: string; // name of the pill
    // slot: number;
    dosage: number; // measurement of that specific dose e.g 500mg, its always in mg
    dose: number; // how much is taken at a time e.g twice a day
    times: string[]; // an array of time strings representing the times to take the pill
  }

