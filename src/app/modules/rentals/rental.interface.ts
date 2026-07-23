export interface IRentalOrder {
    items: {
        gearId: string;
        quantity: number;
    }[];
    startDate: string;
    endDate: string;
}
