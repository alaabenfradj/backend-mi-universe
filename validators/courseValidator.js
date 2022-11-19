const yup = require("yup");
const courseValidator = yup.object().shape({
  label: yup.string().min(2).max(15).required().trim(),
  description: yup.string().required().trim(),
  level: yup
    .string()
    .oneOf(["beginner", "intermediate", "advanced"])
    .default("beginner"),
  languages: yup
    .string()
    .oneOf(["english", "french", "arabic"])
    .default("english"),
  price: yup.number().min(0).integer().required(),
  duration: yup.number().min(0).integer().required(),
  category: yup
    .string()
    .oneOf([
      "voice",
      "guitar",
      "keyboards",
      "strings",
      "percussions",
      "brass",
      "woodwind",
      "others",
    ])
    .default("others"),
  CourseImage: yup
    .string()
    .notRequired()
    .default("1648931926897--téléchargement.jpg"),
});
const courseUpdateValidator = yup.object().shape({
  label: yup.string().min(2).max(15).trim().notRequired(),
  description: yup.string().trim().notRequired(),
  level: yup
    .string()
    .oneOf(["beginner", "intermediate", "advanced"])
    .notRequired(),
  languages: yup.string().oneOf(["english", "french", "arabic"]).notRequired(),
  price: yup.number().integer().min(0).notRequired(),
  duration: yup.number().integer().min(0).notRequired(),
  category: yup
    .string()
    .oneOf([
      "voice",
      "guitar",
      "keyboards",
      "strings",
      "percussions",
      "brass",
      "woodwind",
      "others",
    ])
    .notRequired(),
  CourseImage: yup.string().notRequired(),
});
const courseSearchValidator = yup.object().shape({
  label: yup.string().min(4).max(15).trim().notRequired(),
  description: yup.string().max(255).trim().notRequired(),
  level: yup
    .string()
    .oneOf(["beginner", "intermediate", "advanced"])
    .notRequired(),
  languages: yup.string().oneOf(["english", "french", "arabic"]).notRequired(),
  maxprice: yup.number().positive().notRequired(),
  maxduration: yup.number().positive().notRequired(),
  minprice: yup.number().positive().notRequired(),
  minduration: yup.number().positive().notRequired(),
  category: yup
    .string()
    .oneOf([
      "voice",
      "guitar",
      "keyboards",
      "strings",
      "percussions",
      "brass",
      "woodwind",
      "others",
    ])
    .notRequired(),
});
const courseTreeValidator = yup.object().shape({
  price: yup.number().oneOf([1, -1]).notRequired(),
  duration: yup.number().oneOf([1, -1]).notRequired(),
  subscribers: yup.number().oneOf([1, -1]).notRequired(),
});

module.exports = {
  courseValidator,
  courseUpdateValidator,
  courseSearchValidator,
  courseTreeValidator,
};
