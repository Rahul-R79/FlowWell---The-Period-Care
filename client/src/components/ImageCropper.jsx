// userProfile image cropper
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import { Button, Modal } from "react-bootstrap";

function ImageCropper({ imageSrc, onCropComplete, onClose }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropCompleteHandler = useCallback(
        (croppedArea, croppedAreaPixels) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const handleCropSave = async () => {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(croppedImage);
        onClose();
    };

    return (
        <Modal show={true} onHide={onClose} size='lg' centered>
            <Modal.Header closeButton>
                <Modal.Title>Crop Image</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ position: "relative", height: "400px" }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropCompleteHandler}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={onClose}>
                    Cancel
                </Button>
                <Button variant='primary' onClick={handleCropSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ImageCropper;
