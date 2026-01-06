export class CustomEventSource extends EventSource {
  constructor(url: string, eventSourceInitDict?: EventSourceInit) {
    super(url, { ...eventSourceInitDict });
  }
}
