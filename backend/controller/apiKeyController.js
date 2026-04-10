import handleAsyncError from "../middleware/handleAsyncError.js";

export const getApiKey = handleAsyncError(async (req, res, next) => {
    res.status(200).json({
        success: true,
        apiKey: process.env.VITE_TINYMCE_API_KEY,
    });
});
