"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const propertyController_1 = require("../controllers/propertyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.optionalAuthenticate, propertyController_1.PropertyController.search);
router.post('/compare', authMiddleware_1.optionalAuthenticate, propertyController_1.PropertyController.getCompareProperties);
router.get('/:id', authMiddleware_1.optionalAuthenticate, propertyController_1.PropertyController.getById);
// Protected Agent/Admin routes
router.post('/', authMiddleware_1.authenticate, (0, roleMiddleware_1.authorize)('AGENT', 'ADMIN'), (0, validationMiddleware_1.validateBody)(schemas_1.propertyCreateSchema), propertyController_1.PropertyController.create);
router.put('/:id', authMiddleware_1.authenticate, (0, roleMiddleware_1.authorize)('AGENT', 'ADMIN'), propertyController_1.PropertyController.update);
router.delete('/:id', authMiddleware_1.authenticate, (0, roleMiddleware_1.authorize)('AGENT', 'ADMIN'), propertyController_1.PropertyController.delete);
exports.default = router;
