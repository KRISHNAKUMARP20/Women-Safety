type EventHandler = (data: any) => void;

class SocketEventService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private isConnected = false;
  private reconnectTimeout: any = null;

  constructor() {
    this.connect();
  }

  public connect() {
    if (typeof window === 'undefined') return;
    if (this.eventSource) {
      this.eventSource.close();
    }

    try {
      this.eventSource = new EventSource('/api/events');

      this.eventSource.onopen = () => {
        this.isConnected = true;
        this.emitLocal('connected', { status: 'connected' });
      };

      this.eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.event && parsed.payload !== undefined) {
            this.emitLocal(parsed.event, parsed.payload);
          }
        } catch (e) {
          // ignore ping or malformed
        }
      };

      this.eventSource.onerror = () => {
        this.isConnected = false;
        this.eventSource?.close();
        // Schedule auto reconnect
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => {
          this.connect();
        }, 3000);
      };
    } catch (e) {
      console.warn('EventSource failed to initialize:', e);
    }
  }

  public on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    return () => {
      this.off(event, handler);
    };
  }

  public off(event: string, handler: EventHandler) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(handler);
    }
  }

  private emitLocal(event: string, payload: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((h) => {
        try {
          h(payload);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  public getConnectedStatus(): boolean {
    return this.isConnected;
  }
}

export const socketService = new SocketEventService();
