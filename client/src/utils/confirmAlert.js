//confrimation alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

/**
 * @param {string} title - The title of the alert
 * @param {string} text - The message text
 * @param {string} confirmText - Text of confirm button
 * @param {string} cancelText - Text of cancel button
 * @returns {Promise<boolean>} - resolves true if confirmed
 */

export const confirmAlert = async (
    title = "Are you sure?",
    text = "This action cannot be undone!",
    confirmText = "Yes",
    cancelText = "Cancel"
) => {
    const result = await MySwal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
    });

    return result.isConfirmed;
};
