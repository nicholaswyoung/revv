import {access, F_OK, readFile} from 'fs';
import revHash from 'rev-hash';
import revPath from 'rev-path';
import cp from 'cp-file';
import del from 'del';
import pify from 'pify';

export function exists(file, mode = F_OK) {
	return pify(access, mode)(file).then(() => {
		return true;
	}).catch(() => {
		return false;
	});
}

export function read(file) {
	return pify(readFile)(file).then(buffer => {
		const hashed = revHash(buffer);
		const revved = revPath(file, hashed);
		return {
			original: file,
			hash: hashed,
			revved: revved
		};
	});
}

export function copy(file) {
	return cp(file.original, file.revved).then(() => file);
}

export function tidy(file) {
	if (!file.revved || !file.original) {
		return file;
	}
	return del(file.original).then(() => file);
}
