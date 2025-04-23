const apiResponse = require("../utils/apiResponse");
const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");
const OrderStatusLogs = require("../models/orderStatusLogsModel");
const sequelize = require("../config/db");
const { KHQR, CURRENCY, TAG } =  require("ts-khqr");

const createPayment = async ({ req, res }) => {
    const t = await sequelize.transaction();

    try {
        const data = req.body;
        console.log(`Payment for orderId = ${data.orderId}`, data);

        const order = await Order.findByPk(data.orderId, { transaction: t });

        if (!order) {
            await t.rollback();
            return apiResponse(res, 404, 'Order not found!');
        }

        const orderHistory = await OrderStatusLogs.findOne({
            where: { orderId: data.orderId },
            transaction: t
        });

        if (!orderHistory) {
            console.log(`Order Log Status not found for orderId = ${data.orderId}`);
        }

        await Payment.create({
            orderId: data.orderId,
            paymentDate: new Date(),
            paymentMethod: data.paymentType,
            paymentAmount: data.totalOrderAmount,
            paymentStatus: 'SUCCESS',
            receiveAmount: data.recievedAmount,
            changeAmount: data.changeDue,
        }, { transaction: t });

        order.orderStatus = 'PAID';
        order.progressStatus = 'COMPLETED';
        await order.save({ transaction: t });

        if (orderHistory) {
            orderHistory.status = 'COMPLETED';
            orderHistory.updatedAt = new Date();
            await orderHistory.save({ transaction: t });
        }

        await t.commit();
        return apiResponse(res, 200, 'Payment created successfully');

    } catch (error) {
        await t.rollback();
        console.error('Error creating payment:', error);
        return apiResponse(res, 500, 'Internal Server Error');
    }
};

const generateKhqr = async ({ req, res }) => {
    const data = req.body;

    const response = KHQR.generate({
        tag: TAG.INDIVIDUAL,
        accountID: "sun_chengchhay@aclb",
        merchantName: "OrderSnapp",
        currency: CURRENCY.USD,
        amount: data.amount,
        additionalData: {
            mobileNumber: "85510752924",
            billNumber: data.orderNumber,
            storeLabel: "OrderSnapp",
            terminalLabel: "OrderSnapp",
            purposeOfTransaction: "Payment"
        }
    })

    return apiResponse(res, 200, 'QR code generated successfully', {
        qr: response.data.qr,
        md5: response.data.md5,
    });
};

module.exports = {
    createPayment,
    generateKhqr
};