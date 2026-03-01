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
require("dotenv/config");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var categoryElectronics, categoryFashion, categoryHome, productsData, _i, productsData_1, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting seed...');
                    // Delete existing data to prevent duplicates on re-seed
                    return [4 /*yield*/, prisma.product.deleteMany()];
                case 1:
                    // Delete existing data to prevent duplicates on re-seed
                    _a.sent();
                    return [4 /*yield*/, prisma.category.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.category.create({
                            data: {
                                name: 'Electronics',
                                imageURL: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop',
                            },
                        })];
                case 4:
                    categoryElectronics = _a.sent();
                    return [4 /*yield*/, prisma.category.create({
                            data: {
                                name: 'Fashion',
                                imageURL: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop',
                            },
                        })];
                case 5:
                    categoryFashion = _a.sent();
                    return [4 /*yield*/, prisma.category.create({
                            data: {
                                name: 'Home & Living',
                                imageURL: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=600&auto=format&fit=crop',
                            },
                        })];
                case 6:
                    categoryHome = _a.sent();
                    productsData = [
                        {
                            title: 'Premium Wireless Headphones',
                            price: 299.99,
                            description: 'Experience pure sound with noise-canceling technology and 30-hour battery life.',
                            imageURL: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
                            categoryId: categoryElectronics.id,
                        },
                        {
                            title: 'Modern Smart Watch',
                            price: 199.99,
                            description: 'Track your health, stay connected, and look stylish with this modern smart watch.',
                            imageURL: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop',
                            categoryId: categoryElectronics.id,
                        },
                        {
                            title: 'Ergonomic Office Chair',
                            price: 349.00,
                            description: 'Maintain perfect posture with this fully adjustable ergonomic office chair.',
                            imageURL: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=600&auto=format&fit=crop',
                            categoryId: categoryHome.id,
                        },
                        {
                            title: 'Designer Sunglasses',
                            price: 150.00,
                            description: 'UV400 protection with a sleek and modern frame.',
                            imageURL: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
                            categoryId: categoryFashion.id,
                        },
                        {
                            title: '4K Ultra HD Monitor',
                            price: 499.99,
                            description: 'Crystal clear visuals for gaming, designing, and productivity.',
                            imageURL: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop',
                            categoryId: categoryElectronics.id,
                        },
                        {
                            title: 'Minimalist Desk Lamp',
                            price: 45.00,
                            description: 'Adjustable brightness and color temperature for your workspace.',
                            imageURL: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop',
                            categoryId: categoryHome.id,
                        },
                    ];
                    _i = 0, productsData_1 = productsData;
                    _a.label = 7;
                case 7:
                    if (!(_i < productsData_1.length)) return [3 /*break*/, 10];
                    p = productsData_1[_i];
                    return [4 /*yield*/, prisma.product.create({ data: p })];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10:
                    console.log('Seed completed successfully.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
