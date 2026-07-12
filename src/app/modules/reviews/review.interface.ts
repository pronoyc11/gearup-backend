export interface IReview {

    gearId: string;
    rentalOrderId: string;
    rating: number;
    comment?: string
}
export interface IReviewUpdate {

    rating?: number;
    comment?: string
}