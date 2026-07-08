import type Stripe from "stripe";
import { PaymentStatus, RentalStatus } from "../../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";


 const updatePaymentWithWebhook = async (session: Stripe.Checkout.Session) => {
    await prisma.$transaction(async (tx) => {
        const rentalOrderId = session.metadata?.rentalOrderId;

        const checkPaymentStatus = await tx.payment.findUnique({
            where: {
                orderId: rentalOrderId!
            }
        })
        if (checkPaymentStatus?.status === 'SUCCESS') {
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
        await tx.rentalOrder.update({
            where: {
                id: rentalOrderId!
            },
            data: {
                status: RentalStatus.PAID
            }
        });
    })

}


export const paymentUtils = {
    updatePaymentWithWebhook
}