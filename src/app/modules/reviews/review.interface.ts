export interface IReview {

    rentalOrderItemId: string;
    rating: number;
    comment?: string
}
export interface IReviewUpdate {

    rating?: number;
    comment?: string
}
