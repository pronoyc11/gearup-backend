import { PaymentProvider, PaymentStatus } from "../../../../prisma/generated/prisma/enums"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import { paymentUtils } from "./paymentUtils"


const createCheckoutSession = async (rentalOrderId: string, userId: string, userEmail: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {

        const rentalOrderExists = await tx.rentalOrder.findUnique({
            where: {
                id: rentalOrderId
            },
            include: {
                items: {
                    include: {
                        gear: true,
                        provider: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        if (!rentalOrderExists) {
            throw new Error("No order exists on this id.")
        }
        if (rentalOrderExists.customerId !== userId) {
            throw new Error("Not your order");
        }
        if (rentalOrderExists.status !== "CONFIRMED") {
            throw new Error(`All providers must confirm the order before payment. Current rental status is ${rentalOrderExists.status}`);
        }


        const alreadyPaid = await tx.payment.findUnique({
            where: {
                orderId: rentalOrderId
            }
        })
        if (alreadyPaid) {
            if (alreadyPaid.status === "SUCCESS") {
                throw new Error("You have already paid once.");
            }
        }

        //-------

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],

            mode: "payment",

            line_items: [
                {
                    price_data: {
                        currency: "bdt",

                        product_data: {
                            name: `GearUp rental order ${rentalOrderExists.id}`,
                            description: rentalOrderExists.items
                                .map((item) => `${item.gear.title} x ${item.quantity} (${item.provider.name})`)
                                .join(", "),
                        },

                        // Stripe expects the amount in cents
                        unit_amount: Math.round(Number(rentalOrderExists.totalAmount) * 100),
                    },

                    quantity: 1,
                },
            ],
            customer_email: userEmail,
            metadata: {
                rentalOrderId: rentalOrderExists.id,
                customerId: rentalOrderExists.customerId,
            },

            success_url: `${config.client_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url: `${config.client_url}/payment-cancel`,
        });
        //Session tw korlam, Ebar pending payment save kori
        if (!alreadyPaid) {
            await tx.payment.create({
                data: {
                    orderId: rentalOrderExists.id,
                    amount: rentalOrderExists.totalAmount,
                    provider: PaymentProvider.STRIPE,
                    status: PaymentStatus.PENDING,
                    transactionId: session.id
                }
            })
        }
        //Ebar simply session url ta return kore dibo
        return session.url;
    });

    return transactionResult;
}


const handleWebhook = async (payload: Buffer, signature: string, webhookSecret: string) => {

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
    )

    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            await paymentUtils.updatePaymentWithWebhook(session);
            break;
        default:
            console.log(`Unhandled Event Type ${event.type}`)
            break
    }

}


const viewOwnPayment = async (customerId: string, isAdmin: boolean) => {
    let myPayments;

    if (isAdmin) {
        myPayments = await prisma.payment.findMany({
            include: {
                order: {
                    include: {
                        items: {
                            include: {
                                gear: true,
                                provider: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    } else {
        myPayments = await prisma.payment.findMany({
            where: {
                order: {
                    customerId
                }
            },
            include: {
                order: {
                    include: {
                        items: {
                            include: {
                                gear: true,
                                provider: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    return myPayments;
}

const getPaymentDetails = async (paymentId: string, userId: string, isAdmin: boolean) => {
    const paymentExist = await prisma.payment.findUnique({
        where: {
            id: paymentId
        },
        include: {
            order: {
                include: {
                    items: {
                        include: {
                            gear: true,
                            provider: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    if (!paymentExist) {
        throw new Error("No such payments exist on this ID");
    }
    if (!isAdmin && paymentExist.order.customerId !== userId) {
        throw new Error("This payment ID does not belong to any of yours.");
    }
    return paymentExist;

}
export const paymentService = {
    createCheckoutSession,
    handleWebhook,
    viewOwnPayment,
    getPaymentDetails
}
