let selectedItems = [];

function addToOrder(dishName, ingredients) {
    selectedItems.push({ name: dishName, ingredients: ingredients });
    updateOrderDisplay();
}

function removeFromOrder(index) {
    selectedItems.splice(index, 1);
    updateOrderDisplay();
}

function updateOrderDisplay() {
    const selectedItemsDiv = document.getElementById('selected-items');
    const totalIngredientsUl = document.getElementById('total-ingredients');
    
    // 更新已选菜品显示
    selectedItemsDiv.innerHTML = '';
    selectedItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'selected-item';
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span class="ingredients">${item.ingredients.join(', ')}</span>
            <button class="delete-btn" onclick="removeFromOrder(${index})">删除</button>
        `;
        selectedItemsDiv.appendChild(itemDiv);
    });
    
    // 统计并显示所有需要的食材
    const ingredientCount = {};
    selectedItems.forEach(item => {
        item.ingredients.forEach(ingredient => {
            ingredientCount[ingredient] = (ingredientCount[ingredient] || 0) + 1;
        });
    });
    
    // 更新食材清单显示
    totalIngredientsUl.innerHTML = '';
    Object.entries(ingredientCount).forEach(([ingredient, count]) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${ingredient}</span>
            <span>× ${count}</span>
        `;
        totalIngredientsUl.appendChild(li);
    });
}

function loadMenu() {
    const dishes = JSON.parse(localStorage.getItem('dishes')) || [];
    const menuItems = document.querySelector('.menu-items');
    menuItems.innerHTML = '';

    dishes.forEach(dish => {
        if (dish.active) {  // 只显示已上架的菜品
            const dishElement = document.createElement('div');
            dishElement.className = 'menu-item';
            dishElement.innerHTML = `
                <img src="${dish.imageUrl}" alt="${dish.name}">
                <h3>${dish.name}</h3>
                <p class="ingredients">原料: ${dish.ingredients.join('、')}</p>
                <button onclick="addToOrder('${dish.name}', ${JSON.stringify(dish.ingredients)})">添加到订单</button>
            `;
            menuItems.appendChild(dishElement);
        }
    });
}

document.addEventListener('DOMContentLoaded', loadMenu); 