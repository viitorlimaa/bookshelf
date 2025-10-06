"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./data/db");
var fs_1 = require("fs");
var path_1 = require("path");
function migrate() {
    return __awaiter(this, void 0, void 0, function () {
        var booksPath, genresPath, booksJson, genresJson, _i, genresJson_1, name_1, err_1, _a, booksJson_1, b, payload, err_2;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    booksPath = path_1.default.resolve(process.cwd(), "books.json");
                    genresPath = path_1.default.resolve(process.cwd(), "genres.json");
                    booksJson = JSON.parse(fs_1.default.readFileSync(booksPath, "utf-8"));
                    genresJson = JSON.parse(fs_1.default.readFileSync(genresPath, "utf-8"));
                    _i = 0, genresJson_1 = genresJson;
                    _e.label = 1;
                case 1:
                    if (!(_i < genresJson_1.length)) return [3 /*break*/, 6];
                    name_1 = genresJson_1[_i];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, db_1.db.addGenre(name_1)];
                case 3:
                    _e.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _e.sent();
                    console.warn("G\u00EAnero j\u00E1 existe: ".concat(name_1));
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    _a = 0, booksJson_1 = booksJson;
                    _e.label = 7;
                case 7:
                    if (!(_a < booksJson_1.length)) return [3 /*break*/, 12];
                    b = booksJson_1[_a];
                    payload = {
                        title: b.title || "Título Desconhecido",
                        author: b.author || "Autor Desconhecido",
                        genres: b.genre ? [b.genre] : [],
                        year: (_b = b.year) !== null && _b !== void 0 ? _b : 0,
                        pages: (_c = b.pages) !== null && _c !== void 0 ? _c : 0,
                        rating: (_d = b.rating) !== null && _d !== void 0 ? _d : 0,
                        synopsis: b.synopsis || "",
                        cover: b.cover || "",
                        currentPage: 0,
                        status: "QUERO_LER",
                        isbn: undefined,
                        notes: undefined,
                    };
                    _e.label = 8;
                case 8:
                    _e.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, db_1.db.create(payload)];
                case 9:
                    _e.sent();
                    console.log("Livro migrado: ".concat(b.title));
                    return [3 /*break*/, 11];
                case 10:
                    err_2 = _e.sent();
                    console.error("Erro ao migrar livro: ".concat(b.title), err_2);
                    return [3 /*break*/, 11];
                case 11:
                    _a++;
                    return [3 /*break*/, 7];
                case 12:
                    console.log("Migration concluída!");
                    return [2 /*return*/];
            }
        });
    });
}
migrate().catch(console.error);
