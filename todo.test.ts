import { describe, it, expect, beforeEach } from 'vitest';
import { addTodo, toggleTodo, todos, clearAll } from './todo';

describe('Todo 核心业务逻辑测试', () => {
  beforeEach(() => {
    clearAll();
  });

  // 1. 正常添加
  it('应该能成功添加一个新任务', () => {
    addTodo('写作业');
    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe('写作业');
    expect(todos[0].completed).toBe(false);
  });

  // 2. 边界：空输入拦截
  it('输入为空或纯空格时不应添加任务', () => {
    addTodo('   ');
    expect(todos.length).toBe(0);
  });

  // 3. 正常切换
  it('应该能正确切换任务状态', () => {
    addTodo('看书');
    const id = todos[0].id;
    toggleTodo(id);
    expect(todos[0].completed).toBe(true);
  });

  // 4. 修补 AI 的边界防御测试
  it('应对非法输入（如 null）时不应崩溃', () => {
    addTodo(null as any); 
    expect(todos.length).toBe(0);
  });
});