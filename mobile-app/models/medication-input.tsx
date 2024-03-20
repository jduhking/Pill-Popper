enum Interval {
    HOURS='Hours',
    DAYS='Days', 
    WEEKS='Weeks'
}

type Frequency = {
    value: number;
    interval: string;
}

type MedicationInput = {
    name: string;
    dose: number;
    quantity: number;
    dosage?: number;
    frequency?: Frequency;
}

export {
    MedicationInput,
    Frequency,
    Interval
}