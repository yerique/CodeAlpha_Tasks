import { nanoid } from "nanoid";
import Url from "../models/urlModel.js";
import config from "../config/config.js";
import validator from "validator";

export const createShortUrl = async (req, res) => {
    const { originalUrl, shortCode } = req.body;

    // 1. Validate that the URL exists and is in a correct format
    if (!originalUrl || !validator.isURL(originalUrl)) {
        return res.status(400).json({
            success: false,
            body: "Invalid URL"
        });
    }

    // 2. Scan the database to see if this long URL has already been shortened
    const existingUrl = await Url.findOne({ originalUrl });

    // 3. If it exists and the user did not supply a custom short code, return the existing mapping
    if (existingUrl && !shortCode) {
        return res.status(200).json({
            success: true,
            body: {
                shortUrl: `${config.BASE_URL}/${existingUrl.shortCode}`,
                shortCode: existingUrl.shortCode,
                clicks: existingUrl.clicks
            }
        });
    }

    // 4. Set the short code: use user-specified custom alias or auto-generate a unique 8-character code
    const generatedCode = shortCode || nanoid(8);

    // 5. Ensure that the short code (whether custom or generated) is not already taken
    const existingCode = await Url.findOne({
        shortCode: generatedCode
    });

    if (existingCode) {
        return res.status(400).json({
            success: false,
            body: "Short code already exists for other URL, please choose a different code"
        });
    }

    // 6. Register and persist the new short link mapping in the database
    const newUrl = await Url.create({
        originalUrl,
        shortCode: generatedCode
    });

    return res.status(201).json({
        success: true,
        body: {
            shortUrl: `${config.BASE_URL}/${newUrl.shortCode}`,
            shortCode: newUrl.shortCode,
            clicks: newUrl.clicks
        }
    });
};


export const redirectToOriginalUrl = async (req, res) => {
    const { shortCode } = req.params;
    try {
        // Attempt to find the URL mapping by its unique short code
        const url = await Url.findOne({ shortCode });
        if (!url) {
            return res.status(404).json({
                success: false,
                body: "Short code not found"
            });
        }
        
        // Increment the click counter and persist the update to database
        url.clicks += 1;
        await url.save();
        
        // Redirect the user to the original destination URL
        return res.status(302).redirect(url.originalUrl);
    } catch (error) {
        // Handle any database or connection errors gracefully
        return res.status(500).json({
            success: false,
            body: "Internal server error"
        });
    }
};

export const getUrlStats = async (req, res) => {
    const { shortCode } = req.params;
    try {
        // Find the URL mapping to retrieve its click and redirection statistics
        const url = await Url.findOne({ shortCode });
        if (!url) {
            return res.status(404).json({
                success: false,
                body: "Short code not found"
            });
        }
        
        // Return statistics including click counts and original destination
        return res.status(200).json({
            success: true,
            body: {
                shortCode: url.shortCode,
                originalUrl: url.originalUrl,
                clicks: url.clicks
            }
        });
    } catch (error) {
        // Handle unexpected errors during stats retrieval
        return res.status(500).json({
            success: false,
            body: "Internal server error"
        });
    }
};