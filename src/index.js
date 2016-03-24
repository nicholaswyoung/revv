import glob from 'globby';
import * as actions from './actions';

function map(fn) {
	return val => {
		val = Array.isArray(val) ? val : [val];
		return Promise.all(val.map(fn));
	};
}

export default function revv(paths, options = {}) {
	const {tidy, manifest, ...rest} = {
		tidy: true,
		manifest: true,
		cwd: process.cwd(),
		...options
	};

	let chain = glob(paths, rest)
		.then(map(actions.read))
		.then(map(actions.copy));
	
	if (tidy) {
		chain = chain.then(map(actions.tidy));
	}

	if (manifest) {
		chain = chain.then(actions.manifest);
	}

	return chain;
}
