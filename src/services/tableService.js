const { JSDOM } = require("jsdom");
const { QRCodeStyling } = require("qr-code-styling/lib/qr-code-styling.common.js");
const apiResponse = require('../utils/apiResponse');
const Table = require('../models/tableModel');
const cloudinary = require('../config/cloudinary');
const Menu = require("../models/menuModel");
const generateAndUploadQRCode = require('../utils/generateQR');
const sequelize = require('../config/db');
const Setting = require('../models/settingModel');

const createTableService = async ({res, name}) => {
    try{

        let menu = await Menu.findOne({where: {default: true}});
        let setting = await Setting.findOne({where: {id: 1}});
        if (!setting) {
            return apiResponse(res, 404, 'setting not set');
        }

        let newRecord = await Table.create({ name, qrImage: '123', menuId: menu.id });

        const options = {
            width: 300,
            height: 300,
            data: `${setting.systemUrl}/customer/menu?table=${newRecord.id}`,
            image: "",
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
        const base64Svg = qrCodeBuffer.toString('base64');
        const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;

        const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
            folder: 'table-qr-codes',
            use_filename: true,
          });
        
        newRecord.qrImage = uploadResponse.secure_url;
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

const createTableFromLayoutService = async ({ res, tables }) => {
    try {
        const newTables = [];

        console.log(`Data coming: ${JSON.stringify(tables, null, 2)}`);

        let setting = await Setting.findOne({where: {id: 1}});
        if (!setting) {
            return apiResponse(res, 404, 'setting not set');
        }

        for (const table of tables) {

            let existingTable;

            if(table.qrImage){
                existingTable = await Table.findByPk(table.id);
            } else {
                existingTable = null;
            }

            if (existingTable) {
                newTables.push(table);
                existingTable.name = table.number;
                existingTable.number = table.number;
                existingTable.shape = table.shape;
                existingTable.size = `${table.size.width}/${table.size.height}`;
                existingTable.capacity = table.capacity;
                existingTable.position = `${table.position.x}/${table.position.y}`;
                if (table.qrImage) {
                    existingTable.qrImage = table.qrImage;
                }
                await existingTable.save();
                
            } else {
                const newTable = await Table.create({
                    name: table.number.toString(),
                    number: table.number,
                    shape: table.shape,
                    size: `${table.size.width}/${table.size.height}`,
                    capacity: table.capacity,
                    position: `${table.position.x}/${table.position.y}`,
                    qrImage: table.qrImage
                });

                const qrUrlData = `${setting.systemUrl}/customer/menu?table=${newTable.id}`;
                const folderName = 'table-qr-codes';
                const secureUrl = await generateAndUploadQRCode(qrUrlData, folderName);
                const menu = await Menu.findOne({where: {default: true}});

                newTable.qrImage = secureUrl;
                newTable.menuId = menu.id;
                await newTable.save();

                const [width, height] = newTable.size.split('/').map(Number);
                const [x, y] = newTable.position.split('/').map(Number);

                newTables.push({
                    ...newTable.toJSON(),
                    size: { width, height },
                    position: { x, y }
                });
            }
        }
        return apiResponse(res, 201, 'Tables created or updated successfully', newTables);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return apiResponse(res, 500, error.message);
    }
};

const getTablesLayoutService = async ({res}) => {
    try {
        const tables = await Table.findAll({
            attributes: ['id','qrImage','name', 'number', 'shape', 'size', 'capacity', 'position']
        });

        const transformedTables = tables.map(table => {
            const [width, height] = table.size.split('/').map(Number);
            const [x, y] = table.position.split('/').map(Number);
            return {
                ...table.toJSON(),
                size: { width, height },
                position: { x, y }
            };
        });

        return apiResponse(res, 200, 'Tables retrieved successfully', transformedTables);
    } catch (error) {
        return apiResponse(res, 500, error.message);
    }
};


const getTableService = async ({res, id}) =>{
    try{
        const table = await Table.findByPk(id);
        return apiResponse(res, 200, 'Tables retrieved successfully', table);
    } catch (error) {
        return apiResponse(res, 500, error.message);
    }
}

const getTablesService = async ({res}) =>{
    try{
        const tables = await Table.findAll({
            attributes: ['id', 'name', 'number']
        });
        return apiResponse(res, 200, 'Tables retrieved successfully', tables);
    } catch (error) {
        return apiResponse(res, 500, error.message);
    }
}

const updateTableService = async ({res, id, name}) =>{
    try{
        const table = await Table.findByPk(id);
        if(!table){
            return apiResponse(res, 404, 'Table not found');
        }
        table.name = name;
        table.updatedAt = new Date();
        await table.save();
        return apiResponse(res, 200, 'Table updated successfully', table);
    } catch (error) {
        return apiResponse(res, 500, error.message);
    }
}

const deleteTableService = async ({res, id}) =>{
    try{
        const table = await Table.findByPk(id);
        if(!table){
            return apiResponse(res, 404, 'Table not found');
        }
        await table.destroy();
        return apiResponse(res, 200, 'Table deleted successfully');
    } catch (error) {
        return apiResponse(res, 500, error.message);
    }
}

module.exports = { 
    createTableService,
    getTablesService,
    getTableService,
    deleteTableService,
    updateTableService,
    getTablesLayoutService,
    createTableFromLayoutService,
 };