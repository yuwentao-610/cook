let selectedItems = [];

// 菜品详情数据
const dishDetails = {
    '宫保鸡丁': {
        name: '宫保鸡丁',
        image: 'https://via.placeholder.com/400',
        ingredients: ['鸡肉', '花生', '黄瓜', '胡萝卜'],
        preparation: [
            '鸡肉切丁，用料酒、生抽、淀粉腌制15分钟',
            '花生米炒熟备用',
            '黄瓜、胡萝卜切丁',
            '热锅下油，爆香干辣椒和花椒',
            '加入鸡丁翻炒至变色',
            '加入黄瓜、胡萝卜丁翻炒',
            '加入调味料和花生米',
            '大火翻炒均匀即可'
        ]
    },
    '水煮鱼': {
        name: '水煮鱼',
        image: 'https://via.placeholder.com/400',
        ingredients: ['鱼片', '豆芽', '白菜', '辣椒'],
        preparation: [
            '鱼片腌制调味',
            '豆芽和白菜焯水',
            '锅中放油，爆香花椒和辣椒',
            '加入豆芽和白菜',
            '放入鱼片',
            '加入开水和调味料',
            '大火烧开后转小火煮3分钟',
            '淋上热油即可'
        ]
    },
    '青椒炒肉': {
        name: '青椒炒肉',
        image: 'https://via.placeholder.com/400',
        ingredients: ['猪肉', '青椒', '蒜苗'],
        preparation: [
            '猪肉切片并腌制',
            '青椒切块',
            '蒜苗切段',
            '热锅下油，爆香蒜末',
            '加入猪肉翻炒至变色',
            '加入青椒翻炒',
            '最后加入蒜苗',
            '调味后即可出锅'
        ]
    }
};

function addToOrder(dishName, ingredients) {
    // 检查菜品是否已经在订单中
    if (selectedItems.some(item => item.name === dishName)) {
        alert('该菜品已经在订单中了！');
        return;
    }
    
    selectedItems.push({ name: dishName, ingredients: ingredients });
    updateOrderDisplay();
    updateMenuItemStatus(dishName, true);
}

function removeFromOrder(index) {
    const removedItem = selectedItems[index];
    selectedItems.splice(index, 1);
    updateOrderDisplay();
    updateMenuItemStatus(removedItem.name, false);
}

function updateOrderDisplay() {
    const selectedItemsDiv = document.getElementById('selected-items');
    const totalIngredientsUl = document.getElementById('total-ingredients');
    
    if (!selectedItemsDiv || !totalIngredientsUl) return;
    
    // 更新已选菜品显示
    selectedItemsDiv.innerHTML = '';
    selectedItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'selected-item';
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span class="ingredients">${item.ingredients.join('、')}</span>
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

function updateMenuItemStatus(dishName, isSelected) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const titleElement = item.querySelector('h3');
        if (titleElement && titleElement.textContent === dishName) {
            const addButton = item.querySelector('button');
            if (isSelected) {
                item.classList.add('selected');
                addButton.disabled = true;
                addButton.textContent = '已添加';
            } else {
                item.classList.remove('selected');
                addButton.disabled = false;
                addButton.textContent = '添加到订单';
            }
        }
    });
}

function loadMenu() {
    const menuItems = document.querySelector('.menu-items');
    if (!menuItems) return;
    
    menuItems.innerHTML = '';
    
    Object.entries(dishDetails).forEach(([_, dish]) => {
        const isSelected = selectedItems.some(item => item.name === dish.name);
        
        // 将数组转换为字符串，并处理引号
        const ingredientsStr = JSON.stringify(dish.ingredients).replace(/"/g, '&quot;');
        
        const dishElement = document.createElement('div');
        dishElement.className = `menu-item${isSelected ? ' selected' : ''}`;
        dishElement.innerHTML = `
            <div class="dish-image" onclick="showDishDetail('${dish.name}')">
                <img src="${dish.image}" alt="${dish.name}">
            </div>
            <h3>${dish.name}</h3>
            <p class="ingredients">原料: ${dish.ingredients.join('、')}</p>
            <button onclick="addToOrder('${dish.name}', ${ingredientsStr})"
                    ${isSelected ? 'disabled' : ''}>
                ${isSelected ? '已添加' : '添加到订单'}
            </button>
        `;
        menuItems.appendChild(dishElement);
    });
}

function showDishDetail(dishName) {
    window.location.href = `detail.html?dish=${encodeURIComponent(dishName)}`;
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        loadMenu();
        // 初始化显示订单
        updateOrderDisplay();
    }
}); 