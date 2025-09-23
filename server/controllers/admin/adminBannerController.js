import Banner from "../../models/Banner.js";
import cloudinary from "../../utils/cloudinary.js";

//create banner
export const createBanner = async (req, res) => {
    const { title, subTitle, startingDate, endingDate } = req.body;

    try {
        const existingBanner = await Banner.findOne({
            $or: [{ title }, { subTitle }],
        });

        if (existingBanner) {
            return res.status(400).json({
                errors: [{ field: "general", message: "Banner already exist" }],
            });
        }

        let BannerUrl;

        if (req.file) {
            const url = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "banners" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            BannerUrl = url.secure_url;
        }

        const banner = await Banner.create({
            title,
            subTitle,
            startingDate,
            endingDate,
            image: BannerUrl,
        });

        res.status(200).json({ banner });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//get banner
export const getBanners = async (req, res) => {
    try {
        let { page = 1, limit = 4, search = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const query = search
            ? {
                  $or: [
                      { title: { $regex: search, $options: "i" } },
                      { subTitle: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const totalBanners = await Banner.countDocuments(query);
        const totalPages = Math.ceil(totalBanners / limit);

        const banner = await Banner.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.status(200).json({
            banner,
            currentPage: page,
            totalPages,
            totalBanners,
        });
    } catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
};

//get a single banner
export const getSingleBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(404).json({ message: "banner not found" });
        }

        res.status(200).json({ banner });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//edit a banner
export const editBanner = async (req, res) => {
    const { id } = req.params;
    const { title, subTitle, startingDate, endingDate } = req.body;

    try {
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: "banner not found" });
        }

        const existingBanner = await Banner.findOne({
            _id: { $ne: id },
            $or: [{ title }, { subTitle }],
        });

        if (existingBanner) {
            return res.status(400).json({
                errors: [
                    { field: "general", message: "Banner already exists" },
                ],
            });
        }

        let BannerUrl;
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "banner" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            BannerUrl = result.secure_url;
        }

        banner.title = title;
        banner.subTitle = subTitle;
        banner.startingDate = startingDate;
        banner.endingDate = endingDate;
        if (BannerUrl) {
            banner.image = BannerUrl;
        }

        await banner.save();

        res.status(200).json({ banner });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//delete a banner
export const deleteBanner = async (req, res) => {
    const { id } = req.params;

    try {
        const banner = await Banner.findByIdAndDelete(id);

        if (!banner) {
            return res.status(404).json({ message: "banner not found" });
        }

        return res.status(200).json({ banner });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//change banner status
export const bannerStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(400).json({ message: "banner not found" });
        }

        if (!banner.isActive) {
            await Banner.updateMany(
                { _id: { $ne: id } },
                { $set: { isActive: false } }
            );
            banner.isActive = true;
        } else {
            banner.isActive = false;
        }

        banner.save();

        return res.status(200).json({ banner });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
