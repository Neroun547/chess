import {readFile, stat} from "fs/promises";
import { resolve } from "path";

export async function sendJavaScriptStaticFile(url, res) {
    try {
        if(await stat(resolve("static" + url))) {
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.end(await readFile(resolve("static" + url)));
        }
    } catch(e) {
        res.writeHead(404);
        res.end();
    }
}

