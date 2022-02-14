//import {readFileSync} from 'fs';
//import toml from 'toml';

//const config = toml.parse(readFileSync('./serve_conf.toml','utf-8'));
//console.log(config);

async function serve(
	scope = 'parent',
	kill = 'kill',
	custom = 'default'
) {
	const { default: express } = await import('express');
	const { default: child } = await import('child_process');
	const { default: compression } = await import('compression');

	const { Server } = await import('socket.io');

	const { readFileSync } = await import('fs');
	const toml = await import('toml');

	const http = await import('http');
	const hdf = f2p(import.meta.url);
	const hdr = dropDir(dropDir(hdf)); //trims the last two files off of the file path

	const config = toml.parse(readFileSync(`${hdr}/serve_conf.toml`,'utf-8'));
	const port = config[scope].port;
	const path = config[scope].dir;

	const app = express();
	const server = http.createServer(app);
	const io = new Server(server);

	const log = console.log;

	const functions = {
		serve: ([...args]) => {
			log('serving...');
			let stargs = JSON.stringify(args).replaceAll('"', '\\"');
			let terminal = child.spawn('zsh');
			terminal.stdout.on('data', d => log(`::${d}`.trim()));
			let program = `
			cd ${hdr}/src;
			touch exec.mjs;
			echo "/*COMMENT*/" > exec.mjs;
			echo "import {serve} from '../libs/serve.mjs'" >> exec.mjs;
			echo "serve(...${stargs})" >> exec.mjs;
			echo "console.log(process.pid)" >> exec.mjs;
			node exec.mjs;
			`;
			terminal.stdin.write(program);
			terminal.stdin.end();
			console.log(`served!`);
		},
		log: ([...args]) => {
			args.forEach(e => log(e));
		},
		default: ([...args]) => {
			consol.log('connection established!');
		},
	};
	app.use(compression());
	app.use(express.static(hdr));
	app.get('/', (q, s) => s.sendFile(`${hdr}/${path}`));
	io.on('connection', socket => {
		socket.on(kill, () => process.exit());
		socket.on(custom, data => functions[custom](data));
	});
	server.listen(port, () =>
		log(`served @ http://localhost:${port} | kill -9 ${process.pid}`)
	);

	function dropDir(str) {
		str = str[str.length - 1] == '/' ? str.substring(0, str.length - 1) : str;
		return str.substring(0, str.lastIndexOf('/'));
	}

	function f2p(str) {
		return str.substring(7);
	}
}
export { serve };
