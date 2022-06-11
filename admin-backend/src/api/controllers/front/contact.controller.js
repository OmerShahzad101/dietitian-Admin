const Contact = require("../../models/contact.model");


exports.create = async (req, res, next) => {
  var contact;
  try {
    let { name, email, subject, message } = req.body;
    if (name && email && subject && message) {
      email = email.toLowerCase();

      let payload = {
        name,
        email,
        subject,
        message,
      };

      contact = await Contact.create(payload);

      return res.status(200).send({
        status: true,
        message:
          "Thanks for contacting us! We'll be in touch with you shortly.",
        data: contact,
      });
    } else
      return res.status(500).send({
        status: false,
        message: "Oops Something went wrong",
      });
  } catch (error) {
    next(error);
  }
};
