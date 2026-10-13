// ===== 状态 =====
let todos = [];
let filter = 'all';   // all / active / completed

// ===== 加载：localStorage 安全读取 =====
function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem('todos'));
    todos = Array.isArray(saved) ? saved : [];
  } catch (e) {
    console.warn('读取本地数据失败，已重置：', e);
    todos = [];
  }
}

// ===== 保存：try/catch 兜底 =====
function save() {
  try {
    localStorage.setItem('todos', JSON.stringify(todos));
  } catch (e) {
    console.warn('保存失败：', e);
  }
}

// ===== 三个操作函数：不改原数组 =====
function addTodo(text) {
  const t = text.trim();
  if (!t) return;
  todos = [...todos, { id: Date.now(), text: t, done: false }];
  save(); render();
}

function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save(); render();
}

function toggleTodo(id) {
  todos = todos.map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  save(); render();
}

// ===== 脱离 AI 独立完成 =====
function clearCompleted() {
  todos = todos.filter(t => !t.done);
  save(); render();
}
// 【第2次提交】筛选：all / active / completed，仅影响视图，不改 todos
// ===== 筛选 =====
function setFilter(f) {
  filter = f;
  render();
}

// ===== 渲染 =====
function render() {
  const list = document.querySelector('#todo-list');
  const countEl = document.querySelector('#count');
  const emptyTip = document.querySelector('#empty-tip');

  const filterMap = {
    all: () => true,
    active: t => !t.done,
    completed: t => t.done,
  };
  const visible = todos.filter(filterMap[filter]);

  list.innerHTML = '';
  visible.forEach(todo => {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const span = document.createElement('span');
    span.textContent = todo.text;
    if (todo.done) span.classList.add('done');

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = '删除';
    delBtn.addEventListener('click', () => removeTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  const remaining = todos.filter(t => !t.done).length;
  countEl.textContent = `剩余 ${remaining} 项未完成`;
  emptyTip.classList.toggle('show', visible.length === 0);

  // 筛选按钮高亮
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

// ===== 事件绑定 =====
function bindEvents() {
  const input = document.querySelector('#todo-input');
  const addBtn = document.querySelector('#add-btn');
  const clearBtn = document.querySelector('#clear-btn');

  addBtn.addEventListener('click', () => {
    addTodo(input.value);
    input.value = '';
    input.focus();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      addTodo(input.value);
      input.value = '';
    }
  });

  clearBtn.addEventListener('click', clearCompleted);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });
}

// ===== 启动 =====
loadTodos();
bindEvents();
render();

// 暴露到全局，方便控制台验证
window.addTodo = addTodo;
window.removeTodo = removeTodo;
window.toggleTodo = toggleTodo;
window.clearCompleted = clearCompleted;
window.setFilter = setFilter;
window.getTodos = () => todos;