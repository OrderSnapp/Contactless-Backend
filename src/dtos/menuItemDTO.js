const menuItemDTO = (menuItem) => {
    return {
        id: menuItem.id,
        name: menuItem.name,
        menuId: menuItem.menuId,
        icon: menuItem.icon,
    };
};

module.exports = menuItemDTO;