#!/usr/bin/env node

const execa = require('execa');
const fs = require('fs');

(async () => {
    try {
        console.log('Switching branches...');
        await execa('git', ['checkout', '--orphan', 'gh-pages']);

        console.log('Building...');
        await execa('npm', ['run', 'build']);

        await execa('git', ['--work-tree', 'dist', 'add', '--all']);
        await execa('git', ['--work-tree', 'dist', 'commit', '-m', 'gh-pages']);

        console.log('Pushing to gh-pages...');
        await execa('git', ['push', 'origin', 'HEAD:gh-pages', '--force']);

        console.log('Cleaning up...');
        await execa('rm', ['-r', 'dist']);
        await execa('git', ['checkout', '-f', 'master']);
        await execa('git', ['branch', '-D', 'gh-pages']);

        console.log('Successfully deployed');
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
})();