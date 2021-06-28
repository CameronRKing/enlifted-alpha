import { WebPlugin } from '@capacitor/core';
export class TranscribeWeb extends WebPlugin {
    constructor() {
        // Call super with the name of our plugin (this should match the native name),
        // along with the platforms this plugin will activate on. For example, it's possible
        // to use a web plugin for Android and iOS by adding them to the platforms list (lowercased)
        super({
            name: 'Transcribe',
            platforms: ['web'],
        });
        // requestPermissions() {}
        this.interval = null;
    }
    startRecord() {
        let i = 1;
        this.interval = setInterval(() => {
            this.notifyListeners('meter', {
                avgDb: i++ * 10 % 100 - 90,
                // why am I putting all this data in if the client doesn't use it?
                // for conceptual reasons long ago, I suppose
                peakPCM: 0,
                rms: 'doesnt actually matter'
            });
        }, 112);
        setTimeout(() => this.notifyListeners('results', { text: 'I' }), 50);
        setTimeout(() => this.notifyListeners('results', { text: 'I think this' }), 100);
        setTimeout(() => this.notifyListeners('results', { text: 'I think this app' }), 150);
        setTimeout(() => this.notifyListeners('results', { text: 'I think this app can help' }), 200);
        setTimeout(() => this.notifyListeners('results', { text: 'I think this app can help me improve' }), 2000);
    }
    stopRecord() {
        clearInterval(this.interval);
        this.notifyListeners('done', {
            maxVolume: -10,
            avgVolume: -50,
            text: 'Test text from the mock transcription service.',
        });
    }
}
// Register as a web plugin
import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(new TranscribeWeb());
import { Plugins, FilesystemDirectory } from '@capacitor/core';
const { Transcribe, Filesystem } = Plugins;
Transcribe.restart = (path) => {
    Filesystem.deleteFile({ path, directory: FilesystemDirectory.Documents });
};
// we should also register a web mock in here
export default Transcribe;
//# sourceMappingURL=Transcribe.ts.map