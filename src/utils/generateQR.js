const { JSDOM } = require("jsdom");
const { QRCodeStyling } = require("qr-code-styling/lib/qr-code-styling.common.js");
const cloudinary = require('../config/cloudinary');

const generateAndUploadQRCode = async (data, folder) => {
    try {
        const options = {
            width: 300,
            height: 300,
            data: data,
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
            folder: folder,
            use_filename: true,
        });

        return uploadResponse.secure_url;
    } catch (error) {
        throw new Error(`Failed to generate and upload QR code: ${error.message}`);
    }
};

module.exports = generateAndUploadQRCode;