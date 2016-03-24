import test from 'ava';
import cp from 'cp-file';
import del from 'del';
import revv from './src';
import { read, copy, tidy, exists } from './src/actions';

test.beforeEach(async t => {
	await cp('support/logo.svg', 'support/one.tmp.svg');
	await cp('support/logo.svg', 'support/two.tmp.svg');
});

test.after('cleanup', async t => {
	await del('support/*.tmp.*');
	await del('support/*.tmp-*');
});

test('read() should return a file object', async t => {
	const file = await read('support/logo.svg');

	t.is(typeof file, 'object');
	t.same(Object.keys(file), ['original', 'hash', 'revved']);
});

test('read() throws if file does not exist', async t => {
	try {
		const file = await read('support/xyz.svg');
	} catch (err) {
		t.not(err, undefined);
	}
});

test('exists() return true if a file exists', async t => {
	t.is(await exists('support/logo.svg'), true);
	t.is(await exists('support/xyz.svg'), false);
});

test('copy() accepts a file object, and copies it', async t => {
	const file = await read('support/one.tmp.svg');
	const copied = await copy(file);

	t.is(await exists(file.original), true);
	t.is(await exists(file.revved), true);
});

test('copy() returns an identical file object', async t => {
	const file = await read('support/one.tmp.svg');
	const copied = await copy(file);

	t.same(file, copied);
});

test('tidy() accepts a file object, then removes original', async t => {
	const file = await read('support/one.tmp.svg');
	await copy(file);
	await tidy(file);

	t.is(await exists(file.original), false);
});

test('tidy() throws if file is not file object', async t => {
	try {
		const tidied = await tidy('x');
	} catch (err) {
		t.not(err, undefined);
	}
});

test('tidy() throws if file does not exist', async t => {
	try {
		const tidied = await tidy({
			original: 'support/xyz.svg'
		});
	} catch (err) {
		t.not(err, undefined);
	}
});

test('revv() revs, copies, and cleans up', async t => {
	const revved = await revv('support/one.tmp.svg');
	
	t.is(await exists('support/one.tmp.svg'), false);
	t.is(await exists(revved[0].original), false);
	t.is(await exists(revved[0].revved), true);
});

test('revv() with tidy = false leaves originals', async t => {
	const copied = await copy({
		original: 'support/two.tmp.svg',
		revved: 'support/three.tmp.svg'
	});

	const revved = await revv('support/three.tmp.svg', {
		tidy: false 
	});

	t.is(await exists('support/three.tmp.svg'), true);
	t.is(await exists(revved[0].original), true);
	t.is(await exists(revved[0].revved), true);
});
