class AudioInterceptor extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    process(inputs, outputs, parameters) {
        this.port.postMessage(inputs[0][0]);
        return true;
    }
}

registerProcessor('audio-interceptor', AudioInterceptor)