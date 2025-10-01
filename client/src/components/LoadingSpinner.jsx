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
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
        }}>
        <CircularProgress color='dark' size={50} />
    </div>
);

export default LoadingSpinner;
