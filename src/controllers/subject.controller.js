const { Subject, School } = require("../models");
const subjectDecorator = require("../decorators/subject.decorator");

const ROOM_TYPES = ["COMMON", "LAB", "COMPUTER"];
const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/i;

const isValidId = (id) => typeof id === "string" && ULID_REGEX.test(id);

const validateSubjectData = (data, { partial = false } = {}) => {
  const errors = [];

  if (!partial || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      errors.push("El nombre es obligatorio");
    }
  }

  if (!partial || data.weekly_hours !== undefined) {
    const hours = Number(data.weekly_hours);
    if (!Number.isInteger(hours) || hours <= 0) {
      errors.push(
        "Las horas por semana deben ser un número entero mayor que 0",
      );
    } else if (hours % 2 !== 0) {
      errors.push("Las horas por semana deben ser un número par");
    }
  }

  if (!partial || data.required_room_type !== undefined) {
    if (!ROOM_TYPES.includes(data.required_room_type)) {
      errors.push("El tipo de aula debe ser COMMON, LAB o COMPUTER");
    }
  }

  return errors;
};

// TODO: volver a req.user.school.id cuando esté listo el middleware de auth
const getSchoolId = async (res) => {
  const school = await School.findOne({ order: [["created_at", "ASC"]] });
  if (!school) {
    res.status(404).json({ message: "No query result for model School" });
    return null;
  }
  return school.id;
};

const notFound = (res) =>
  res.status(404).json({ message: "No query result for model Subject" });

exports.index = async (req, res) => {
  try {
    const schoolId = await getSchoolId(res);
    if (!schoolId) return;

    const subjects = await Subject.findAll({
      where: { school_id: schoolId },
      order: [["created_at", "ASC"]],
    });

    return res.status(200).json({ data: subjects.map(subjectDecorator) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error fetching subjects" });
  }
};

exports.show = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return notFound(res);

    const schoolId = await getSchoolId(res);
    if (!schoolId) return;

    const subject = await Subject.findOne({
      where: { id: req.params.id, school_id: schoolId },
    });

    if (!subject) return notFound(res);

    return res.status(200).json({ data: subjectDecorator(subject) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error fetching subject" });
  }
};

exports.store = async (req, res) => {
  try {
    const schoolId = await getSchoolId(res);
    if (!schoolId) return;

    const { name, weekly_hours, required_room_type } = req.body;

    const errors = validateSubjectData({
      name,
      weekly_hours,
      required_room_type,
    });
    if (errors.length) {
      return res.status(422).json({ errors });
    }

    const subject = await Subject.create({
      school_id: schoolId,
      name,
      weekly_hours,
      required_room_type,
    });

    return res.status(201).json({ data: subjectDecorator(subject) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating subject" });
  }
};

exports.update = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return notFound(res);

    const schoolId = await getSchoolId(res);
    if (!schoolId) return;

    const subject = await Subject.findOne({
      where: { id: req.params.id, school_id: schoolId },
    });

    if (!subject) return notFound(res);

    const { name, weekly_hours, required_room_type } = req.body;
    const errors = validateSubjectData(
      { name, weekly_hours, required_room_type },
      { partial: true },
    );
    if (errors.length) {
      return res.status(422).json({ errors });
    }

    await subject.update({
      ...(name !== undefined && { name }),
      ...(weekly_hours !== undefined && { weekly_hours }),
      ...(required_room_type !== undefined && { required_room_type }),
    });

    return res.status(200).json({ data: subjectDecorator(subject) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error updating subject" });
  }
};

exports.destroy = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return notFound(res);

    const schoolId = await getSchoolId(res);
    if (!schoolId) return;

    const subject = await Subject.findOne({
      where: { id: req.params.id, school_id: schoolId },
    });

    if (!subject) return notFound(res);

    await subject.destroy();

    return res.status(200).json({
      message: "Materia eliminada correctamente",
      data: {
        id: subject.id,
        name: subject.name,
        deleted_at: subject.deleted_at,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error deleting subject" });
  }
};
