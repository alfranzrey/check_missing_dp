//set constant variables
const puppeteer = require('puppeteer');
const vo = require('vo');
const fs = require('fs');
const parse = require('csv-parse');
    
//get csv data first
var csvData=[];
fs.createReadStream('asins.csv')
    .pipe(parse({delimiter: ':'}))
    .on('data', function(csvrow) {
        csvData.push(csvrow);        
    })
    .on('end',function() {
    });
//-----------------------
//-export file result
var exportToCSV = fs.createWriteStream('result8.txt');
var header ='ASIN'  + '\t' +
            'Title'    + '\n';
console.log(header);
exportToCSV.write(header);
function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
           str += obj[p] + '\t';
        }
    }
    return str;
}
//-------------------------


//Main async function
(async function main() {
    try{
        //---------------
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36');
        //-----------------

        //code starts here
        for(var i = 0; i < csvData.length; i++){
            await page.goto("https://www.amazon.com/gp/offer-listing/"+csvData[i], {waitUntil: 'load', timeout: 0}); //bypass timeout
            await page.waitForSelector('body');
            var title = "";

            if (await page.$('#olpProductDetails > h1') !== null){
                title = await page.evaluate(() => document.querySelector('#olpProductDetails > h1').innerText); 
            }
            else{
                title = "Missing Detail page";
            }
            let row = {
                    'Style':csvData[i],
                    'Title':title
                }
            exportToCSV.write(objToString(row) + '\n','utf-8');
            console.log(objToString(row) + '\n'); 
        }

        //end
        console.log("All done!");
        browser.close();
    }
    catch(err){
        console.log("!!!! >>>>>  my error",err);
    }
})();





    

