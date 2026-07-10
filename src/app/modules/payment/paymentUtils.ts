import type Stripe from "stripe";
import { PaymentStatus, RentalStatus } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { rentalUtls } from "../../utils/rentalUtils";


const updatePaymentWithWebhook = async (session: Stripe.Checkout.Session) => {
    await prisma.$transaction(async (tx) => {
        const rentalOrderId = session.metadata?.rentalOrderId;

        const checkPaymentStatus = await tx.payment.findUnique({
            where: {
                orderId: rentalOrderId!
            }
        })
        if (checkPaymentStatus?.status === 'SUCCESS') {
            console.log("Already paid");
            return;
        }


        await tx.payment.update({
            where: {
                orderId: rentalOrderId!
            },
            data: {
                status: PaymentStatus.SUCCESS,
                transactionId: session.id,
                paidAt: new Date()
            }
        });
        const rentalOrder = await tx.rentalOrder.findUnique({
            where: {
                id: rentalOrderId
            }
        })
        if (!rentalOrder) {
            console.log("No order found on this id");
            return;
        }
        let flag = true;
        const today = new Date();

        if (today < rentalOrder.startDate) {
            flag = false;
        }
        const numberOfDays = rentalUtls.rentalDays(rentalOrder.startDate, rentalOrder.endDate);
        if (!numberOfDays.success) {
            flag = false;
        }

        const newStartAndEndDate = rentalUtls.returnNewStartAndEndDate(numberOfDays.data!);

        await tx.rentalOrder.update({
            where: {
                id: rentalOrderId!
            },
            data: {
                status: RentalStatus.PAID,
                startDate: flag ? newStartAndEndDate.startDate : rentalOrder.startDate,
                endDate: flag ? newStartAndEndDate.endDate : rentalOrder.endDate
            }
        });
    })

}


export const paymentUtils = {
    updatePaymentWithWebhook
}