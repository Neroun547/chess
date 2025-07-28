import "dotenv/config";
import { createServer } from "http";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { resolve } from "path";
import { createHash } from "crypto";
import { createClient } from "redis";
import { Server } from "socket.io";
import {sendJavaScriptStaticFile} from "./utils/sendJavaScriptStaticFile.js";
import {sendCssStaticFile} from "./utils/sendCssStaticFile.js";
import {makeRequest} from "./utils/makeRequest.js";

let redisConnection;

(async function() {
    redisConnection = await createClient()
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
})();

const server = createServer( async (req, res) => {
    if(req.method === "GET") {
        if(req.url.includes("/css/")) {
            await sendCssStaticFile(req.url, res);
        } else if(req.url.includes("/js/")) {
            await sendJavaScriptStaticFile(req.url, res);
        } else if(req.url === "/") {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(await readFile(resolve("static/pages/main.html")));
        } else if(req.url === "/single-player") {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(await readFile(resolve("static/pages/single-player/single-player.html")));
        } else if(req.url === "/multi-player") {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(await readFile(resolve("static/pages/multi-player/multi-player-wait-room.html")));
        } else if(req.url === "/multi-player/game") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(await readFile(resolve("static/pages/multi-player/multi-player-game.html")));
        } else if(req.url === "/signup") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(await readFile(resolve("static/pages/signup/signup.html")));
        } else if(req.url === "/auth") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(await readFile(resolve("static/pages/auth/auth.html")));
        } else if(req.url.includes("/img/")) {
            if(existsSync(resolve("static" + req.url))) {
                res.writeHead(200, {"Content-Type": "image/png"});
                res.end(await readFile(resolve("static" + req.url)));
            } else {
                res.writeHead(404);
                res.end("File not found");
            }
        } else {
            res.writeHead(404);
            res.end("Not found");
        }
    } else if(req.method === "POST") {
        if(req.url === "/create-game") {
            const hash = createHash("sha256");

            hash.update(String(Date.now() + Math.floor(Math.random() * 1000000)));

            const hashString = hash.digest("hex");

            await redisConnection.set(hashString, 1, {
                EX: 172800
            });

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ hash: hashString }));
        } else {
            res.writeHead(404);
            res.end("Not found");
        }
    } else {
        res.writeHead(404);
        res.end("Not found");
    }
}).listen(process.env.APP_PORT, () => {
    console.log("Server started on port: " + process.env.APP_PORT);
});

const io = new Server(server);

io.on("connect", (socket) => {
    // Waiting room socket logic
    socket.on("create-room", (hash) => {
        socket.join(hash);
    });
    socket.on("join-to-room", async (hash) => {
        const data = await redisConnection.get(hash);

        if(data && Number(data) === 1) {
            await redisConnection.set(hash, "2", {
                EX: 172800
            });

            socket.join(hash);
            socket.emit("success-connect-to-room", "Success");
            io.to(hash).emit("player-connected");
        } else {
            socket.emit("error-connect-to-room", "Error");
        }
    });
    socket.on("start-game", async (hash) => {
        io.to(hash).emit("start-game");
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(async room => {
            const roomInRedis = await redisConnection.get(room);

            if(roomInRedis) {
                await redisConnection.set(room, Number(roomInRedis) - 1, {
                    EX: 172800
                });
                io.to(room).emit("player-leave", room);
            }
        });
    });
    // Game socket logic
    socket.on("join-to-room-after-start", async (hash) => {
        const roomInRedis = await redisConnection.get(hash);

        if(roomInRedis && Number(roomInRedis) < 2) {
            await redisConnection.set(hash, Number(roomInRedis) + 1, {
                EX: 172800
            });
            const teamInRedis = await redisConnection.get(hash + "-team-another-player");

            if(teamInRedis) {
                socket.join(hash);
                socket.emit("set-team", teamInRedis === "black" ? "white" : "black");
            } else {
                const randomNumber = Math.floor(Math.random() * 2);

                socket.join(hash);
                socket.emit("set-team", randomNumber === 0 ? "black" : "white");

                await redisConnection.set(hash + "-team-another-player", randomNumber === 0 ? "black" : "white", {
                    EX: 172800
                });
            }
            io.to(hash).emit("player-connected");
        }
    });
    socket.on("move-figure", (cordX, cordY, row, col, activeElementRow, activeElementCol, team, figureType, castling) => {
        socket.rooms.forEach(room => {
            io.to(room).emit("move-figure", cordX, cordY, row, col, activeElementRow, activeElementCol, team, figureType, castling);
        });
    });
    socket.on("player-win", async (team, authToken) => {
        socket.rooms.forEach(room => {
             io.to(room).emit("player-win", team);
        });

        const randomWinGameId = Date.now();

        if(authToken && typeof authToken === "string") {
            await redisConnection.set(String(randomWinGameId), authToken, {
                EX: 172800
            });
            makeRequest(
                "POST",
                "localhost",
                "/api/game-statistic/add-win-game/",
                JSON.stringify({ winGameId: randomWinGameId }),
                8090,
                authToken
            )
                .then((res) => {
                    console.log(res);
                })
                .catch(e => console.log("Error add game to game statistic:", e));
        }
    });
    socket.on("get-game-board", (board) => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("get-game-board", board);
        });
    });
    socket.on("offer-lose", (hash) => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("offer-lose");
        });
        redisConnection.del(hash);
        redisConnection.del(hash + "-team-another-player");
    });
    socket.on("offer-draw", () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("offer-draw");
        });
    });
    socket.on("accept-draw", (hash) => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("accept-draw");
        });
        redisConnection.del(hash);
        redisConnection.del(hash + "-team-another-player");
    });
    socket.on("reject-draw", () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("reject-draw");
        });
    });
});



