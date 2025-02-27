interface Amount {
    currency: string;
    value: number;
}

interface Interval {
    unit: string;
    length: number;
}

interface Trial {
    enabled: boolean;
    hold_setup_fee: boolean;
    days: number;
}

export { Amount, Interval, Trial };
