export const getCroppedImg = (imageSrc, crop, zoom) => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = imageSrc;

    return new Promise((resolve, reject) => {
        img.onload = () => {
            const scaleX = img.naturalWidth / img.width;
            const scaleY = img.naturalHeight / img.height;

            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                img,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            canvas.toBlob((blob) => {
                if (!blob) return reject("Canvas is empty");
                blob.name = "cropped.jpeg";
                resolve(blob);
            }, "image/jpeg");
        };
        img.onerror = () => reject("Image load error");
    });
};
