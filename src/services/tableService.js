const nodeCanvas = require("canvas");
const { JSDOM } = require("jsdom");
const { QRCodeStyling } = require("qr-code-styling/lib/qr-code-styling.common.js");
const apiResponse = require('../utils/apiResponse');
const Table = require('../models/tableModel');

const createTableService = async ({res, name}) => {
    try{

        let newRecord = await Table.create({ name, qrImage: '123' });

         const options = {
            width: 300,
            height: 300,
            data: `http://localhost:3000/tables/${newRecord.id}`, // Include the table ID in the QR code data
            image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", // Optional: Add a logo
            dotsOptions: {
                color: "#4267b2",
                type: "rounded"
            },
            backgroundOptions: {
                color: "#e9ebee",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 20
            }
        };

        const qrCodeSvg = new QRCodeStyling({
            jsdom: JSDOM,
            type: "svg",
            ...options
        });

        const qrCodeBuffer = await qrCodeSvg.getRawData("svg");
        newRecord.qrImage = qrCodeBuffer;
        await newRecord.save();

        return apiResponse(res, 201, 'Table created successfully', newRecord);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(err => err.message);
            return apiResponse(res, 400, messages);
        }

        return apiResponse(res, 500, error.message);
    }
};


const getTableService = async ({res, id}) =>{
    try{
        const table = await Table.findByPk(id);

        // Convert the buffer to base64
        const buffer = table.qrImage;
        const base64Svg = buffer.toString('base64');
        const imgSrc = `data:image/svg+xml;base64,${base64Svg}`;

        return apiResponse(res, 200, 'Tables retrieved successfully', {
            id: table.id,
            name: table.name,
            qrImage: imgSrc
        });
    } catch (error) {
        return apiResponse(res, 500, error.message);
    }
}

const getTablesService = async ({res}) =>{
    try{
        const tables = await Table.findAll();
        return apiResponse(res, 200, 'Tables retrieved successfully', tables);
    } catch (error) {
        return apiResponse(res, 500, error.message);
    }
}

module.exports = { 
    createTableService,
    getTablesService,
    getTableService
 };