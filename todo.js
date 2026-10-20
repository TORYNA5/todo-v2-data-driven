// ===== 状态 =====
let todos = [];
let filter = 'all';

// ===== 加载与保存 =====
function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem('todos'));
    todos = Array.isArray(saved) ? saved : [];
  } catch (e) {
    todos = [];
  }
}

function save() {
  try {
    localStorage.setItem('todos', JSON.stringify(todos));
  } catch (e) {
    console.warn('保存失败：', e);
  }
}

// ===== 操作（不改原数组） =====
function addTodo(text) {
  const t = text.trim();
  if (!t) return;
  todos = [...todos, { id: Date.now(), text: t, completed: false }];
  save(); render();
}

function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save(); render();
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  save(); render();
}

// ===== 渲染（移除了循环内的事件绑定） =====
function render() {
  const list = document.querySelector('#todo-list');
  const filterMap = {
    all: () => true,
    active: t => !t.completed,
    completed: t => t.completed,
  };
  const visible = todos.filter(filterMap[filter]);

  list.innerHTML = '';
  visible.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = todo.id;

    const span = document.createElement('span');
    span.textContent = todo.text;
    if (todo.completed) span.classList.add('done');

    // 新增编辑按钮
    const editBtn = document.createElement('button');
    editBtn.dataset.action = 'edit';
    editBtn.textContent = '编辑';

    const delBtn = document.createElement('button');
    delBtn.dataset.action = 'delete';
    delBtn.textContent = '删除';

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  // 底部统计等逻辑...
}

// ===== 事件委托（统一在父容器） =====
document.querySelector('#todo-list').addEventListener('click', (e) => {
  if (!(e.target instanceof Element)) return;

  const item = e.target.closest('li');
  if (!item || !document.querySelector('#todo-list').contains(item)) return;

  const id = Number(item.dataset.id);
  if (!id) return;

  // 1. 删除操作
  const delBtn = e.target.closest('[data-action="delete"]');
  if (delBtn && item.contains(delBtn)) {
    removeTodo(id);
    return; // 必须 return，防止向下执行
  }

  // 2. 编辑操作
  const editBtn = e.target.closest('[data-action="edit"]');
  if (editBtn && item.contains(editBtn)) {
    const currentText = item.querySelector('span').textContent;
    const newText = prompt('修改任务：', currentText);
    if (newText && newText.trim()) {
      todos = todos.map(t => t.id === id ? { ...t, text: newText.trim() } : t);
      save(); render();
    }
    return; // 必须 return
  }

  // 3. 切换操作（兜底）
  toggleTodo(id);
});

// ===== 启动 =====
loadTodos();
// ... 其他绑定 ...
render();