//userAddressController
import Address from "../../models/Address.js";

/**
 * @function addAddress
 * @description Adds a new address for the logged-in user (max 3 addresses allowed).
 * @expectedInput req.body: { fullName, phone, pincode, locality, streetAddress, city, state, landmark?, alternatePhone?, type }
 * @expectedOutput { message: "address created successfully", address } or { errors: [{field, message}] } or { message: "internal server error" }
 */
export const addAddress = async (req, res) => {
    const {
        fullName,
        phone,
        pincode,
        locality,
        streetAddress,
        city,
        state,
        landmark,
        alternatePhone,
        type,
    } = req.body;

    try {
        const addressCount = await Address.countDocuments({
            user: req.user.id,
        });
        if (addressCount >= 3) {
            return res
                .status(400)
                .json({
                    errors: [
                        {
                            field: "general",
                            message: "You can only add up to 3 addresses",
                        },
                    ],
                });
        }
        const address = await Address.create({
            fullName,
            phone,
            pincode,
            locality,
            streetAddress,
            city,
            state,
            landmark,
            alternatePhone,
            type,
            user: req.user.id,
        });

        res.status(201).json({
            message: "address created successfully",
            address,
        });
    } catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function getAllAddresses
 * @description Retrieves all addresses for the logged-in user.
 * @expectedInput req.user.id
 * @expectedOutput { addresses } or { message: "internal server error" }
 */
export const getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id }).sort({
            createdAt: -1,
        });
        return res.status(200).json({ addresses });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function getSingleAddress
 * @description Retrieves a single address by ID.
 * @expectedInput req.params: { id }
 * @expectedOutput { address } or { message: "Address not found" } or { message: "internal server error" }
 */
export const getSingleAddress = async (req, res) => {
    const { id } = req.params;

    try {
        const address = await Address.findById(id);

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({ address });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function editAddress
 * @description Updates an existing address by ID.
 * @expectedInput req.params: { id }, req.body: { fullName, phone, pincode, locality, streetAddress, city, state, landmark?, alternatePhone?, type }
 * @expectedOutput { address } or { message: "address not found" } or { message: "internal server error" }
 */
export const editAddress = async (req, res) => {
    const { id } = req.params;
    const {
        fullName,
        phone,
        pincode,
        locality,
        streetAddress,
        city,
        state,
        landmark,
        alternatePhone,
        type,
    } = req.body;

    try {
        const address = await Address.findById(id);

        if (!address) {
            return res.status(404).json({ message: "address not found" });
        }

        address.fullName = fullName;
        address.phone = phone;
        address.pincode = pincode;
        address.locality = locality;
        address.streetAddress = streetAddress;
        address.city = city;
        address.state = state;
        address.landmark = landmark;
        address.alternatePhone = alternatePhone;
        address.type = type;

        await address.save();
        res.status(200).json({ address });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function deleteAddress
 * @description Deletes an address by ID.
 * @expectedInput req.params: { id }
 * @expectedOutput { message: "address deleted successfully", address } or { message: "address not found" } or { message: "internal server error" }
 */
export const deleteAddress = async (req, res) => {
    const { id } = req.params;

    try {
        const address = await Address.findById(id);

        if (!address) {
            return res.status(404).json({ message: "address not found" });
        }

        await address.deleteOne();

        return res
            .status(200)
            .json({ message: "address deleted successfully", address });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
