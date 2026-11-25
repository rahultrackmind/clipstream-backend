const http = require('http')

function readJson(req, limit = 1_000_000) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
    let chunkCount = 0;
        req.on('data', (chunk) => {
            size += chunk.length;
               chunkCount++;
                console.log(`\n--- [Chunk #${chunkCount} Received] ---`);
            console.log(`Size of this chunk: ${chunk.length} bytes`);
            console.log(`Raw Buffer:`, chunk);
            console.log(`Chunk as Text: "${chunk.toString()}"`);
            console.log(`Total bytes so far: ${size} bytes`);
            if(size > limit) {
                reject(new Error('Body too large'));
                 req.destroy();
                return;
            }
            console.log(chunk)
            chunks.push(chunk);
        })
        console.log('outsinde socket')
        req.on('end', () => {
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
            } catch {
                reject(new Error('Invaid JSON'));
            }
        })
        req.on('error', reject);
    })
}

const server = http.createServer((req,res) => {
    const url = new URL(req.url, 'http://localhost');
    console.log(req.url, 'URL --------------')
      if(url.pathname === '/crash') {
        throw new Error('Something broke')
    }
    if(req.method === 'GET' && url.pathname === '/health') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        return res.end(JSON.stringify({ok: true}));
    }
    if(req.method === 'POST' && url.pathname === '/videos') {
           return readJson(req).then((body) => {
                 res.writeHead(201, { 'Content-Type': 'application/json'});
            return res.end(JSON.stringify({id: Date.now(), title: body.title}))
            }).catch(err => {
                 res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({error: err.message}));
            })
    }

  
    res.writeHead(404)
    res.end('Not found')
});



server.listen(3000, () => console.log("Listening on 3000"));