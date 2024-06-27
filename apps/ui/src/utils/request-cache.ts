class RequestCache {
  public cache = new Map();

  set(key: string, value: Record<string, unknown>) {
    this.cache.set(key, value);
  }

  get(key: string) {
    this.cache.get(key);
  }
}

const requestCache = new RequestCache();

export default requestCache;
