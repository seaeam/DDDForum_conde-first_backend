"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = require("./api");
const router = (0, express_1.Router)();
router.post('/users/new', api_1.createUser);
router.post('/users/edit', api_1.editUser);
router.get('/users', api_1.getUserByEmail);
exports.default = router;
//# sourceMappingURL=routes.js.map