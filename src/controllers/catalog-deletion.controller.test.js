const { test } = require('node:test');
const assert = require('node:assert/strict');

const modelsPath = require.resolve('../models');
const originalModels = require.cache[modelsPath];
const models = { ClassSession: {} };
for (const name of ['Teacher', 'Classroom', 'Course', 'Subject']) models[name] = {};
require.cache[modelsPath] = { id: modelsPath, filename: modelsPath, loaded: true, exports: models };
const controllers = Object.fromEntries(
    ['teacher', 'classroom', 'course', 'subject'].map(entity => [entity, require(`./${entity}.controller`)])
);
if (originalModels) require.cache[modelsPath] = originalModels;
else delete require.cache[modelsPath];

const id = '01JYQZ8K3M4N5P6Q7R8S9T0V1W';
const schoolId = '01JYQZ9A4B5C6D7E8F9G0H1J2K';
const response = () => ({
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
});

for (const [entity, controller] of Object.entries(controllers)) {
    const model = models[entity[0].toUpperCase() + entity.slice(1)];
    for (const count of [6, 1, 0]) {
        test(`${entity}: deleting a record with ${count} classes`, async () => {
            let deleted = false;
            let counted = false;
            const record = {
                id, school_id: schoolId, name: 'Ana Rojas',
                async destroy() {
                    assert.equal(counted, true);
                    deleted = true;
                },
            };
            model.findOne = async ({ where }) => {
                assert.deepEqual(where, { id, school_id: schoolId });
                return record;
            };
            model.findAll = async () => deleted ? [] : [record];
            models.ClassSession.count = async ({ where }) => {
                assert.deepEqual(where, { [`${entity}_id`]: id, school_id: schoolId });
                counted = true;
                return count;
            };
            const req = { params: { id }, user: { school: { id: schoolId } } };
            const res = response();
            await controller.destroy(req, res);
            assert.equal(res.statusCode, count ? 422 : 200);
            assert.equal(deleted, count === 0);
            if (count) {
                assert.deepEqual(res.body, {
                    message: `No se puede eliminar a Ana Rojas: tiene ${count} ${count === 1 ? 'clase asignada' : 'clases asignadas'}`,
                });
            }
            const list = response();
            await controller.index(req, list);
            assert.equal(list.statusCode, 200);
            assert.equal(list.body.data.length, count ? 1 : 0);
        });
    }
    test(`${entity}: missing or other-school record is not counted or deleted`, async () => {
        model.findOne = async ({ where }) => {
            assert.deepEqual(where, { id, school_id: schoolId });
            return null;
        };
        let counted = false;
        models.ClassSession.count = async () => { counted = true; return 6; };
        const res = response();
        await controller.destroy({ params: { id }, user: { school: { id: schoolId } } }, res);
        assert.equal(res.statusCode, 404);
        assert.equal(counted, false);
    });
    test(`${entity}: count failure prevents deletion`, async () => {
        let deleted = false;
        model.findOne = async () => ({
            id, school_id: schoolId, name: 'Ana Rojas',
            async destroy() { deleted = true; },
        });
        models.ClassSession.count = async () => { throw new Error('Database unavailable'); };
        const res = response();
        await controller.destroy({ params: { id }, user: { school: { id: schoolId } } }, res);
        assert.equal(res.statusCode, 500);
        assert.equal(deleted, false);
    });
}
