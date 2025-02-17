// 从 localStorage 获取菜品数据，如果没有则使用默认菜品
let dishes = JSON.parse(localStorage.getItem('dishes')) || [
    {
        name: '宫保鸡丁',
        ingredients: ['鸡肉', '花生', '黄瓜', '胡萝卜'],
        imageUrl: 'https://via.placeholder.com/100',
        active: true
    },
    {
        name: '水煮鱼',
        ingredients: ['鱼片', '豆芽', '白菜', '辣椒'],
        imageUrl: 'https://via.placeholder.com/100',
        active: true
    },
    {
        name: '青椒炒肉',
        ingredients: ['猪肉', '青椒', '蒜苗'],
        imageUrl: 'https://via.placeholder.com/100',
        active: true
    }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    displayDishes();
    setupFormHandler();
});

// 显示所有菜品
function displayDishes() {
    const dishList = document.getElementById('dish-list');
    dishList.innerHTML = '';

    dishes.forEach((dish, index) => {
        const dishElement = document.createElement('div');
        dishElement.className = 'dish-item';
        dishElement.innerHTML = `
            <div class="dish-info">
                <h3>${dish.name}</h3>
                <p>原料: ${dish.ingredients.join(', ')}</p>
            </div>
            <div class="dish-controls">
                <button class="status-toggle ${dish.active ? 'status-active' : 'status-inactive'}"
                        onclick="toggleDishStatus(${index})">
                    ${dish.active ? '已上架' : '已下架'}
                </button>
                <button class="delete-btn" onclick="deleteDish(${index})">删除</button>
            </div>
        `;
        dishList.appendChild(dishElement);
    });
    
    // 保存到 localStorage
    saveDishes();
}

// 切换菜品状态（上架/下架）
function toggleDishStatus(index) {
    dishes[index].active = !dishes[index].active;
    displayDishes();
}

// 删除菜品
function deleteDish(index) {
    if (confirm('确定要删除这道菜品吗？')) {
        dishes.splice(index, 1);
        displayDishes();
    }
}

// 设置表单处理
function setupFormHandler() {
    const form = document.getElementById('add-dish-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        
        const name = document.getElementById('dishName').value;
        const ingredients = document.getElementById('ingredients').value.split(',').map(i => i.trim());
        const imageUrl = document.getElementById('imageUrl').value;

        dishes.push({
            name,
            ingredients,
            imageUrl,
            active: true
        });

        displayDishes();
        form.reset();
    };
}

// 保存菜品数据到 localStorage
function saveDishes() {
    localStorage.setItem('dishes', JSON.stringify(dishes));
}

// 导出菜品数据
function exportDishes() {
    // 创建要导出的数据对象
    const exportData = {
        dishes: dishes,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };

    // 将数据转换为JSON字符串
    const jsonString = JSON.stringify(exportData, null, 2);

    // 创建Blob对象
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dishes_export_${new Date().toISOString().split('T')[0]}.json`;

    // 触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 导入菜品数据
function importDishes(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // 验证导入的数据格式
            if (!importedData.dishes || !Array.isArray(importedData.dishes)) {
                throw new Error('无效的数据格式');
            }

            // 验证每个菜品对象的必要属性
            const isValidDish = dish => 
                dish.name && 
                Array.isArray(dish.ingredients) && 
                dish.imageUrl && 
                typeof dish.active === 'boolean';

            if (!importedData.dishes.every(isValidDish)) {
                throw new Error('菜品数据格式不正确');
            }

            // 确认导入
            if (confirm(`确定要导入${importedData.dishes.length}个菜品吗？这将覆盖当前的菜品数据。`)) {
                dishes = importedData.dishes;
                saveDishes();
                displayDishes();
                alert('菜品数据导入成功！');
            }
        } catch (error) {
            alert('导入失败：' + error.message);
        }
    };
    reader.readAsText(file);

    // 重置文件输入，允许重复导入相同文件
    event.target.value = '';
} 