const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Hello! Please enter text (type "exit" or press Ctrl + C to quit):');

rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
        console.log('Goodbye!');
        rl.close();
    } else {
        writeStream.write(`${input}\n`);
        console.log('Text saved! Enter more:');
    }
});

process.on('SIGINT', () => {
    console.log('\nGoodbye!');
    rl.close();
});

rl.on('close', () => {
    writeStream.end();
    process.exit(0);
});
