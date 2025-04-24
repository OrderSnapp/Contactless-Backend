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
        // currency: CURRENCY.USD,
        // amount: data.amount,
        currency: CURRENCY.KHR,
        amount: 100,
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

const checkTransaction = async({ req, res }) => {
    try{
        const orderNumber = req.body.orderNumber;

        const response = await fetch(`${process.env.KHQR_BASEURL}/check_transaction_by_md5`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.KHQR_TOKEN}`
            },
            body: JSON.stringify({
                md5: req.body.md5
            })
        });

        if (!response.ok) {
            console.error('Error response from API:', response.statusText);
            return apiResponse(res, response.status, 'Error checking transaction');
        }

        const data = await response.json();

        console.log('Check transaction response:', data);

        if(data.responseCode == 0){
            const order = await Order.findOne({ where: { orderNumber: orderNumber } });
            if(!order){
                return apiResponse(res, 404, 'Order not found');
            }
            const orderHistory = await OrderStatusLogs.findOne({
                where: { orderId: order.id }
            });
            if(!orderHistory){
                console.log(`Order Log Status not found for orderId = ${order.id}`);
            }
            order.orderStatus = 'PAID';
            order.progressStatus = 'COMPLETED';
            await order.save();

            if(orderHistory){
                orderHistory.status = 'COMPLETED';
                orderHistory.updatedAt = new Date();
                await orderHistory.save();
            }

            await Payment.create({
                orderId: order.id,
                paymentDate: new Date(),
                paymentMethod: 'ONLINE',
                paymentAmount: data.data.amount,
                paymentStatus: 'SUCCESS',
                receiveAmount:  data.data.amount,
                changeAmount: 0,
            });
            console.log('Payment created successfully');

            return apiResponse(res, 200, 'Transaction found',1);
        }

        else if(data.responseCode == 1 && data.errorCode == 1){
            return apiResponse(res, 200, 'Transaction Pending/NotFound', 2);
        }

        else if(data.responseCode == 1 && data.errorCode in [2, 12]){
            return apiResponse(res, 200, 'Transaction error', 3);
        }

        return apiResponse(res, 200, 'Transaction not found', 2);

    }
    catch(error){
        console.error('Error checking transaction:', error);
        return apiResponse(res, 500, 'Internal Server Error');
    }
};



module.exports = {
    createPayment,
    generateKhqr,
    checkTransaction
};