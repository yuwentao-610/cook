document.addEventListener('DOMContentLoaded', () => {
    // 从 URL 获取菜品名称
    const params = new URLSearchParams(window.location.search);
    const dishName = params.get('dish');
    
    if (dishName && dishDetails[dishName]) {
        const dish = dishDetails[dishName];
        
        // 更新页面标题
        document.title = `${dish.name} - 菜品详情`;
        document.getElementById('dish-title').textContent = dish.name;
        
        // 更新图片
        const dishImage = document.getElementById('dish-image');
        dishImage.src = dish.image;
        dishImage.alt = dish.name;
        
        // 更新食材
        document.getElementById('dish-ingredients').textContent = dish.ingredients.join('、');
        
        // 更新制作步骤
        const stepsList = document.getElementById('preparation-steps');
        dish.preparation.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            stepsList.appendChild(li);
        });
    } else {
        // 如果没有找到菜品，返回首页
        window.location.href = 'index.html';
    }
}); 