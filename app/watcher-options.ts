

export class WatcherOptions {
    sourceDirectory: string;
    outputDirectory: string;
    includedPatterns: string[] = ['*'];
    excludedPatterns: string[] = ['**/.git', '**/node_modules'];
    monitorExistingOnStart: boolean = false;
}