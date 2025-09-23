//loading spinner
import CircularProgress from "@mui/material/CircularProgress";

const LoadingSpinner = () => (
    <div
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
        }}>
        <CircularProgress color='primary' size={80} />
    </div>
);

export default LoadingSpinner;
