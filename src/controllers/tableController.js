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

const updateTable = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    return TableService.updateTableService({res, id, name});
}

const deleteTable = async (req, res) => {
    const { id } = req.params;
    return TableService.deleteTableService({res, id});
}

const getTablesLayout = async (req,res) => {
    return TableService.getTablesLayoutService({res});
}

const createTableFromLayout = async (req, res) => {
    const { tables } = req.body;
    return TableService.createTableFromLayoutService({res, tables});
}

const getTableOrderByTableId = async (req, res) => {
    return TableService.getTableOrderByTableId({req, res});
}

module.exports = {
    createTable,
    getTables,
    getTable,
    updateTable,
    deleteTable,
    getTablesLayout,
    createTableFromLayout,
    getTableOrderByTableId
};