import { request } from "http";

export function makeRequest(method, hostname, path, body, port, authToken) {
    if(method === "POST") {
        return new Promise((resolve, reject) => {
            const req = request({
                method: method,
                path: path,
                hostname: hostname,
                port: port,
                body: body,
                headers: {
                    "Content-Type": "application/json",
                    'Content-Length': Buffer. byteLength(body),
                    "Authorization": "Bearer " + authToken
                }
            }, (response) => {
                resolve(response);
            });
            req.on("error",err => reject(err));

            req.write(body);
            req.end();
        });
    }
}
