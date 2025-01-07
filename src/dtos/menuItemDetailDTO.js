const menuItemDetailDTO = (menuItemDetail) => {
    return {
        id: menuItemDetail.id,
        name: menuItemDetail.name,
        price: menuItemDetail.price,
        status: menuItemDetail.status,
        ingredient: menuItemDetail.ingredient,
        imageUrl: menuItemDetail.imageUrl
    };
};

module.exports = menuItemDetailDTO;