const express = require('express');
const multer = require('multer');
const path = require('path');
const file = require('file-system');
const fs = require('fs');
const fsExtra = require('fs-extra');
const upload = multer({dest: __dirname + '/uploads/images'});
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.post('/upload', upload.array('photo'), (req, res) => {

    let svgs = '';

    fsExtra.emptyDirSync('icons');

    if(req.files) {
        for(var i = 0;i < req.files.length;i++) {
            const tempPath = req.files[i].path;
            const originalName = req.files[i].originalname;
            const targetPath = path.join(__dirname, "./icons/" + originalName);
            fs.rename(tempPath, targetPath, err => {});
            console.log(`${tempPath}    ->    ${originalName}`);
        }
        file.recurseSync("icons/", [
            '*.svg'
            ], function(filepath, relative, filename) {
            if (!filename) {
                return;
            }
            var content = file.readFileSync(filepath, {encoding: 'utf-8'});
            svgs += `<div title="${filename}">${content}</div>`;
        });
        file.writeFileSync('final.html', `
            <!DOCTYPE html>
            <html>
                <head><style>svg { height: 50px; width: auto; margin: 10px; } #container { display: flex; flex-wrap: wrap; }</style></head>
                <body>
                    <div>
                        <button onclick="window.history.back();">Back to Home</button>
                    </div>
                    <div id="container">${svgs}</div>
                </body>
            </html>
        `, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    res.sendFile('final.html', {root: __dirname })   
        setTimeout(function(){
        },3000);
        
    }
    else throw 'error';
});

app.listen(PORT, () => {
    console.log('Listening at ' + PORT );
});