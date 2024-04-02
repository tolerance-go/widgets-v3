type EventHandler = (...args: any[]) => void;

export class EventBus {
  private listeners: Record<string, EventHandler[]> = {};

  // 注册事件监听器
  on(event: string, handler: EventHandler): EventHandler {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
    return handler;
  }

  // 移除事件监听器
  off(event: string, handler: EventHandler): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter((h) => h !== handler);
  }

  // 触发事件
  emit(event: string, ...args: any[]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((handler) => handler(...args));
  }
}

// 使用 create 方法创建事件中心的工厂函数
export function createEventBus(): EventBus {
  return new EventBus();
}
