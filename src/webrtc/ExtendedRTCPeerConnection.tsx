import {
  RTCPeerConnection as OriginalRTCPeerConnection,
  RTCIceCandidate,
} from "react-native-webrtc";

type RTCIceCandidateEvent = {
  candidate: RTCIceCandidate | null;
};

type EventListenerOrEventListenerObject =
  | ((evt: any) => void)
  | { handleEvent(evt: any): void };

class EventTargetPolyfill {
  private listeners: {
    [type: string]: Set<EventListenerOrEventListenerObject>;
  } = {};

  addEventListener(type: string, callback: EventListenerOrEventListenerObject) {
    if (!this.listeners[type]) {
      this.listeners[type] = new Set();
    }
    this.listeners[type].add(callback);
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject,
  ) {
    if (this.listeners[type]) {
      this.listeners[type].delete(callback);
    }
  }

  dispatchEvent(event: { type: string; detail?: any }) {
    if (this.listeners[event.type]) {
      for (const callback of this.listeners[event.type]) {
        if (typeof callback === "function") {
          callback(event);
        } else if (callback && typeof callback.handleEvent === "function") {
          callback.handleEvent(event);
        }
      }
    }
    return true;
  }
}

class ExtendedRTCPeerConnection extends OriginalRTCPeerConnection {
  private _eventTarget: EventTargetPolyfill;

  onicecandidate: ((event: RTCIceCandidateEvent) => void) | null = null;
  onicecandidateerror: ((event: any) => void) | null = null;
  oniceconnectionstatechange: ((event: any) => void) | null = null;
  onicegatheringstatechange: ((event: any) => void) | null = null;
  onnegotiationneeded: ((event: any) => void) | null = null;
  onsignalingstatechange: ((event: any) => void) | null = null;
  onconnectionstatechange: ((event: any) => void) | null = null;
  ondatachannel: ((event: any) => void) | null = null;
  ontrack: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;

  constructor(configuration?: any) {
    super(configuration);
    this._eventTarget = new EventTargetPolyfill();
    this._registerInternalEvents();
  }

  private _registerInternalEvents() {
    const map: [string, keyof ExtendedRTCPeerConnection][] = [
      ["icecandidate", "onicecandidate"],
      ["icecandidateerror", "onicecandidateerror"],
      ["iceconnectionstatechange", "oniceconnectionstatechange"],
      ["icegatheringstatechange", "onicegatheringstatechange"],
      ["negotiationneeded", "onnegotiationneeded"],
      ["signalingstatechange", "onsignalingstatechange"],
      ["connectionstatechange", "onconnectionstatechange"],
      ["datachannel", "ondatachannel"],
      ["track", "ontrack"],
    ];

    for (const [eventType, handlerName] of map) {
      // @ts-ignore: react-native-webrtc might not expose these directly
      (this as any)["on" + eventType] = (event: any) => {
        this._eventTarget.dispatchEvent({ type: eventType, detail: event });
        const handler = this[handlerName] as Function | null;
        if (handler) handler(event);
      };
    }
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
    this._eventTarget.addEventListener(type, listener);
  }

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
  ) {
    this._eventTarget.removeEventListener(type, listener);
  }

  dispatchEvent(event: { type: string; detail?: any }): boolean {
    return this._eventTarget.dispatchEvent(event);
  }
}

export default ExtendedRTCPeerConnection;
