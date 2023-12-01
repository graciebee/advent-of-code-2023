import {readFileSync, PathOrFileDescriptor} from 'fs';

export function parseInput(filename: PathOrFileDescriptor): string[] {
    const contents = readFileSync(filename, 'utf-8');
    return contents.split(/\r?\n/);
}
