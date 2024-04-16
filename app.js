const http  = require('http');
const axios = require('axios');
const fs    = require('fs').promises;

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        try {
         
            const response     = await axios.get('http://localhost/wp-nodejs/wp-json/wp/v2/posts');
            const posts        = response.data;
            const htmlTemplate = await fs.readFile(__dirname + '/template.html', 'utf-8')
            let htmlContent    = htmlTemplate.replace('{{titles}}', posts.map(post => post.title.rendered).join('<br>'));
            htmlContent        = htmlContent.replace('{{contents}}', posts.map(post => post.content.rendered).join('<br>'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);

        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Error 404 Page Not Found!');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
