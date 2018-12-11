/// <reference path="web3d.d.ts" />
declare namespace game {
    class Jsloader {
        private static instance;
        static readonly ins: Jsloader;
        private LoadList;
        addScripte(src: string): void;
        private onComplete;
        private onState;
        preload(onComplete: () => void, onState?: (taskDone: number, tottalTask: number) => void): void;
        loadJsFile(src: string, onComplete: () => void): void;
    }
}
