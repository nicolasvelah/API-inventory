class _Get {
  private data: Map<String, any> = new Map();

  put<T>(dependency: T, key: string) {
    this.data.set(key, dependency);
  }

  find<T>(key: string) {
    if (!this.data.has(key)) {
      return null;
    }
    return this.data.get(key) as T;
  }
}

const Get = new _Get();
export default Get;
