import {access, F_OK, readFile} from 'fs';
import glob from 'globby';
import revHash from 'rev-hash';
import revPath from 'rev-path';
import cp from 'cp-file';
import del from 'del';
import pify from 'pify';

function map(fn) {
	return val => {
		val = Array.isArray(val) ? val : [val];
		return Promise.all(val.map(fn));
	};
}

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

export default function revv(paths, options = {}) {
	options = {
		tidy: true,
		cwd: process.cwd(),
		...options
	};

	const chain = glob(paths, options)
		.then(map(read))
		.then(map(copy));

	if (options.tidy) {
		return chain.then(map(tidy));
	}

	return chain;
}
