const express = require('express');
const multer = require('multer');
const path = require('path');
const file = require('file-system');
const fs = require('fs');
const fsExtra = require('fs-extra');
const upload = multer({dest: __dirname + '/uploads/images'});
const app = express();
const PORT = 3000;

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

app.use(express.static('public'));

app.post('/upload', upload.array('photo'), async (req, res) => {

    let svgs = '', count = 0;

    fsExtra.emptyDirSync('icons');

    if(req.files) {
        for(var f of req.files) {
            const tempPath = f.path;
            const originalName = f.originalname;
            const targetPath = path.join(__dirname, "./icons/" + originalName);
            fs.renameSync(tempPath, targetPath, (err) => { err && console.log(`Error in file rename : ${err}`); });
        }
        //await snooze(3000);
        file.recurseSync("icons/", [
            '*.svg'
            ], function(filepath, relative, filename) {
            count ++;
            if (!filename) {
                return;
            }
            var content = file.readFileSync(filepath, {encoding: 'utf-8'});
            svgs += `<div class="svg" title="${filename}">${content}<label>${filename}</label></div>`;
        });
        console.log(`After appending ${count} svgs to variable`);
        file.writeFileSync('final.html', `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        svg { height: 50px; width: auto; margin: 10px; }
                        #container { display: flex; flex-wrap: wrap; }
                        .svg { display: flex; flex-direction: column; margin: 20px 10px; }
                    </style>
                </head>
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
