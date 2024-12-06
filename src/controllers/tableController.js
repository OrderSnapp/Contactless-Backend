const TableService = require('../services/tableService');

const createTable = async (req, res) => {
    const { name } = req.body;
    return TableService.createTableService({res, name});
}
const getTables = async (req, res) => {
    return TableService.getTablesService({res});
}

const getTable = async (req, res) => {
    const { id } = req.params;
    return TableService.getTableService({res, id});
}

module.exports = {
    createTable,
    getTables,
    getTable
};