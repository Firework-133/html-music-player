const buttonRow = document.createElement('div');
buttonRow.style.position = 'fixed';
buttonRow.style.top = '0px'; // 距离顶部的距离
buttonRow.style.right = '0px'; // 距离右侧的距离
buttonRow.style.display = 'flex'; // 使用 flex 布局
buttonRow.style.justifyContent = 'flex-end'; // 将按钮靠右对齐

const titleBar = document.createElement('div');
titleBar.style.position = 'fixed';
titleBar.style.top = '0'; // 距离页面顶部的距离为 0
titleBar.style.right = '0'; // 距离页面右侧的距离为 0
titleBar.style.width = '100%'; // 宽度占满整个页面
titleBar.style.height = '36px'; // 设置高度为 1px，模拟标题栏的线条
titleBar.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'
titleBar.style.transition = 'transform 0.3s'; // 平滑过渡效果

// 添加拖拽区域
const dragRegion = document.createElement('div');
dragRegion.style.width = '100%';
dragRegion.style.height = '100%';
dragRegion.style.cursor = 'grab'; // 设置鼠标样式为抓取

//pywebview的拖拽区
const drag = document.createElement('div');
drag.classList.add('pywebview-drag-region'); // 添加类名
drag.style.width = '100%';
drag.style.height = '100%';
dragRegion.appendChild(drag);

/*
// 创建一个检测区域
const detectionZone = document.createElement('div');
detectionZone.style.position = 'fixed';
detectionZone.style.top = '0';
detectionZone.style.left = '0';
detectionZone.style.width = '100%';
detectionZone.style.height = '40px';
detectionZone.style.opacity = '0'; // 使检测区域透明
detectionZone.style.pointerEvents = 'none'; // 允许鼠标事件穿透检测区域
*/

// 在拖拽逻辑中调用 restore() 方法
dragRegion.addEventListener('pointermove', async (event) => {
    // 等待获取窗口最大化状态
    //const isMaximized = await window.pywebview.api.isMaximized();
    if (event.buttons === 1) {
        // 如果窗口最大化，调用 restore() 方法
        if (isMaximized) {
            // 获取鼠标在全屏状态下的位置
            const proportion_X = (event.clientX / window.innerWidth);
            const proportion_Y = (event.clientY / window.innerHeight);
            /*
            const Mouse_Down = new MouseEvent('mousedown', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'screenX': event.screenX,
                'screenY': event.screenX,
                'clientX': event.clientX,
                'clientY': event.clientY
            });
            */
            await window.pywebview.api.restore();
            //await window.pywebview.api.window_resize_to_default();
            //const window_size = await window.pywebview.api.window_size();
            //const window_width = window_size[0]; // 获取宽度
            //const window_height = window_size[1]; // 获取高度
            const window_width = window.innerWidth;
            const window_height = window.innerHeight;
            const move_x = window_width * proportion_X;
            const move_y = window_height * proportion_Y;
            //const window_location = await window.pywebview.api.window_location();
            //const window_location_x = window_location[0];
            //const window_location_y = window_location[1];
            const mouseX = event.screenX;
            const mouseY = event.screenY;
            //let newLeft = mouseX -window_location_x - move_x;
            //let newTop = mouseY -window_location_x - move_y;
            let newLeft = mouseX - move_x;
            let newTop = mouseY - move_y;
            newLeft = newLeft < 0 ? 0 : newLeft;
            newTop = newTop < 0 ? 0 : newTop;
            //drag.dispatchEvent(Mouse_Down);
            await window.pywebview.api.window_move(newLeft, newTop);
        }
    };
    if (event.buttons === 0) {
        if (!isMaximized) {
            const window_location = await window.pywebview.api.window_location();
            const window_x = window_location[0];
            const window_y = window_location[1];
            if (window_y < 0) {
                await window.pywebview.api.maximize();
            }
        }
    };
});

/*
// 当鼠标移动到检测区域时显示标题栏
detectionZone.addEventListener('mouseenter', async function () {
    const isMaximized = await window.pywebview.api.isMaximized();
    if (isMaximized) {
        titleBar.style.transform = 'translateY(0%)';
    }
});

// 当鼠标离开检测区域时隐藏标题栏
detectionZone.addEventListener('mouseleave', async function () {
    const isMaximized = await window.pywebview.api.isMaximized();
    if (isMaximized) {
        titleBar.style.transform = 'translateY(-100%)';
    }
});
*/

//添加按钮
const minimizeButton = document.createElement('button');
//minimizeButton.innerText = 'Minimize';
minimizeButton.style.backgroundImage = 'url("img/subtract-fill.png")';
minimizeButton.style.width = '36px'; // 设置按钮宽度
minimizeButton.style.height = '36px'; // 设置按钮高度
minimizeButton.style.backgroundColor = 'transparent'; // 设置背景色为透明
minimizeButton.style.border = 'none'; // 去除边框
minimizeButton.style.backgroundSize = 'contain';
minimizeButton.onclick = () => {
    window.pywebview.api.minimize();
};

const maximizeButton = document.createElement('button');
//maximizeButton.innerText = 'Maximize'; 
maximizeButton.style.backgroundImage = 'url("img/expand-diagonal-fill.png")';
maximizeButton.style.width = '36px'; // 设置按钮宽度
maximizeButton.style.height = '36px'; // 设置按钮高度
maximizeButton.style.backgroundColor = 'transparent'; // 设置背景色为透明
maximizeButton.style.border = 'none'; // 去除边框
maximizeButton.style.backgroundSize = 'contain';
maximizeButton.onclick = () => {
    window.pywebview.api.maximize();
    maximizeButton.style.display = 'none';
    windowedButton.style.display = 'block';
};

const windowedButton = document.createElement('button');
//windowedButton.innerText = 'Windowed'; 
windowedButton.style.backgroundImage = 'url("img/collapse-diagonal-fill.png")';
windowedButton.style.width = '36px'; // 设置按钮宽度
windowedButton.style.height = '36px'; // 设置按钮高度
windowedButton.style.backgroundColor = 'transparent'; // 设置背景色为透明
windowedButton.style.border = 'none'; // 去除边框
windowedButton.style.backgroundSize = 'contain';
windowedButton.onclick = () => {
    window.pywebview.api.restore();
    windowedButton.style.display = 'none';
    maximizeButton.style.display = 'block';
};

const closeButton = document.createElement('button');
//closeButton.innerText = 'Close';
closeButton.style.backgroundImage = 'url("img/close-large-line.png")';
closeButton.style.width = '36px'; // 设置按钮宽度
closeButton.style.height = '36px'; // 设置按钮高度
closeButton.style.backgroundColor = 'transparent'; // 设置背景色为透明
closeButton.style.border = 'none'; // 去除边框
closeButton.style.backgroundSize = 'contain';
closeButton.onclick = () => { window.pywebview.api.close(); };

// 默认隐藏最小化窗口（程序默认是窗口运行的）
windowedButton.style.display = 'none';


buttonRow.appendChild(minimizeButton);
buttonRow.appendChild(maximizeButton);
buttonRow.appendChild(windowedButton);
buttonRow.appendChild(closeButton);

titleBar.appendChild(dragRegion);
titleBar.appendChild(buttonRow);
document.body.appendChild(titleBar);
//document.body.appendChild(detectionZone);

//节流器
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

//防抖器
function debounce(func, delay) {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

window.addEventListener('mousemove', throttle(async function (event) {
    //const isMaximized = await window.pywebview.api.isMaximized();
    // 如果鼠标在顶部80px内，显示标题栏
    if (isMaximized) {
        if (event.clientY <= 80) {
            titleBar.style.transform = 'translateY(0%)';
        } else {
            // 如果鼠标离开顶部80px，隐藏标题栏
            titleBar.style.transform = 'translateY(-100%)';
        }
    }
}, 100));

//窗口状态
let isMaximized = false;

//监听窗口变化
window.addEventListener('resize', async () => {
    // Show the appropriate button based on window state
    //const isMaximized = await window.pywebview.api.isMaximized();
    isMaximized = await window.pywebview.api.isMaximized();
    if (isMaximized) {
        maximizeButton.style.display = 'none';
        windowedButton.style.display = 'block';
        titleBar.style.transform = 'translateY(-100%)';
        //drag.style.display = 'none';
    } else {
        maximizeButton.style.display = 'block';
        windowedButton.style.display = 'none';
        titleBar.style.transform = 'translateY(0%)';
        //drag.style.display = 'block';
    }
});