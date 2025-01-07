const menuItemDetailDTO = (menuItemDetail) => {
    return {
        id: menuItemDetail.id,
        name: menuItemDetail.name,
        price: menuItemDetail.price,
        status: menuItemDetail.status.charAt(0).toUpperCase() + menuItemDetail.status.slice(1).toLowerCase(),
        ingredient: menuItemDetail.ingredient,
        imageUrl: menuItemDetail.imageUrl
    };
};

module.exports = menuItemDetailDTO;