import handleAsyncError from "../middleware/handleAsyncError.js";
import { sendEmail } from "../utils/sendEmail.js";
import HandleError from "../utils/handleError.js";

export const contactUs = handleAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new HandleError("Please provide name, email, and message", 400));
  }

  const subject = "Contact Form Submission";
  const to = "mdsorafuddin@gmail.com";
  
  const emailMessage = `You have a new message from ${name} (${email}):\n\n${message}`;

  try {
    await sendEmail({
      email: to,
      subject,
      message: emailMessage,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new HandleError("Could not send email, please try again", 500));
  }
});
