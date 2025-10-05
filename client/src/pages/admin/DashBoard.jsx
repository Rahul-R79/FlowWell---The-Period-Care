//admin dashboard
import Sidebar from "../../components/SideNav/AdminSidebar";
import AdminFooter from "../../components/Footer/AdminFooter";
import { Card, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getDashboard } from "../../features/dashboardSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const DashBoard = () => {
    const dispatch = useDispatch();
    const { data, loadingByAction } = useSelector((state) => state.dashboard);

    const [selectedDate, setSelectedDate] = useState(() => {
        const end = new Date();
        const start = new Date();
        start.setFullYear(end.getFullYear() - 1);
        return [start, end];
    });

    const [range, setRange] = useState("monthly");

    useEffect(() => {
        const [start, end] = selectedDate;
        if (start && end) {
            dispatch(
                getDashboard({
                    startDate: start.toISOString(),
                    endDate: end.toISOString(),
                    range,
                })
            );
        }
    }, [dispatch, selectedDate, range]);

    const generateLabels = (range, startDate, endDate) => {
        const labels = [];
        let current = dayjs(startDate);

        if (range === "monthly") {
            while (
                current.isBefore(dayjs(endDate)) ||
                current.isSame(dayjs(endDate), "month")
            ) {
                labels.push(current.format("MMM YYYY"));
                current = current.add(1, "month");
            }
        } else if (range === "yearly") {
            while (
                current.isBefore(dayjs(endDate)) ||
                current.isSame(dayjs(endDate), "year")
            ) {
                labels.push(current.format("YYYY"));
                current = current.add(1, "year");
            }
        }

        return labels;
    };

    const mapSalesToLabels = (labels, salesTrend, range) => {
        return labels.map((label) => {
            const matched = salesTrend.find((item) => {
                if (range === "monthly")
                    return (
                        dayjs(`${item.year}-${item.month}-01`).format(
                            "MMM YYYY"
                        ) === label
                    );
                if (range === "yearly") return String(item.year) === label;
                return false;
            });
            return matched ? matched.totalSales : 0;
        });
    };

    const chartLabels = generateLabels(range, selectedDate[0], selectedDate[1]);
    const chartDataPoints = mapSalesToLabels(
        chartLabels,
        data.salesTrend,
        range
    );

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: "Sales",
                data: chartDataPoints,
                borderColor: "#6366F1",
                backgroundColor: "#6366F1",
                tension: 0.3,
                fill: false,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
    };

    const salesCard = [
        { title: "Total Orders", value: data.totalOrders },
        { title: "Active Orders", value: data.activeOrders },
        { title: "Completed Orders", value: data.completedOrders },
        { title: "Return Orders", value: data.returnedOrders },
        { title: "Total Revenue", value: `₹${data.totalRevenue}` },
        { title: "Total Refunded", value: `₹${data.refundRevenue}` },
        { title: "Total Products", value: data.totalProducts },
        { title: "Total Users", value: data.totalCustomers },
    ];

    const handleExportTopSellingPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Top Selling Products", 14, 20);

        const filterInfo = `Date Range: ${selectedDate[0].toDateString()} - ${selectedDate[1].toDateString()}`;
        doc.setFontSize(10);
        doc.text(filterInfo, 14, 30);
        const tableColumn = ["#", "Product", "Revenue", "Sold"];
        const tableRows = data.topSellingProducts?.map((top, idx) => [
            idx + 1,
            top.name,
            top.totalSales,
            top.totalQuantity,
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [99, 102, 241], textColor: 255 },
        });

        doc.save("top_selling_products.pdf");
    };

    const handleExportTopCategoriesPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Top Selling Categories", 14, 20);

        const filterInfo = `Date Range: ${selectedDate[0].toDateString()} - ${selectedDate[1].toDateString()}`;
        doc.setFontSize(10);
        doc.text(filterInfo, 14, 30);

        const tableColumn = ["#", "Category", "Sold"];
        const tableRows = data.topSellingCategories?.map((cat, idx) => [
            idx + 1,
            cat._id,
            cat.totalSold,
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [99, 102, 241], textColor: 255 },
        });

        doc.save("top_selling_categories.pdf");
    };

    const orderStatusLabels = data.totalChartGroup?.map((item) => item._id);
    const orderStatusCounts = data.totalChartGroup?.map((item) => item.count);

    const chart = {
        labels: orderStatusLabels,
        datasets: [
            {
                label: "Orders by Status",
                data: orderStatusCounts,
                backgroundColor: [
                    "#6366F1",
                    "#3B82F6",
                    "#22C55E",
                    "#F59E0B",
                    "#EF4444",
                    "#A855F7",
                    "#14B8A6",
                ],
                hoverOffset: 4,
            },
        ],
    };
    return (
        <>
            {loadingByAction.getDashboard && <LoadingSpinner />}
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 d-flex flex-column container'>
                        <h2 className='fw-semi-bold m-0 text-center text-lg-start'>
                            Dashboard
                        </h2>
                        {/*DatePicker */}
                        <div className='d-flex flex-column flex-md-row justify-content-end align-items-md-center mb-5 mt-3'>
                            <DatePicker
                                selectsRange
                                startDate={selectedDate[0]}
                                endDate={selectedDate[1]}
                                onChange={(dates) => setSelectedDate(dates)}
                                placeholderText='Select date range'
                                className='form-control'
                                dateFormat='dd-MM-yyyy'
                            />
                        </div>

                        {/* sales Cards */}
                        <div className='row g-3 mb-4'>
                            {salesCard.map((card, idx) => (
                                <div className='col-md-3' key={idx}>
                                    <motion.div
                                        className='h-100'
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: idx * 0.2,
                                            duration: 0.5,
                                        }}>
                                        <Card className='shadow-sm h-100'>
                                            <Card.Body>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <div>
                                                        <h6 className='text-dark'>
                                                            {card.title}
                                                        </h6>
                                                        <h5 className='fw-bold text-success'>
                                                            {card.value}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className='rounded-circle d-flex justify-content-center align-items-center'
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            background:
                                                                "#f3f4f6",
                                                        }}>
                                                        🛒
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                </div>
                            ))}
                        </div>

                        {/* Sales Graph & Top Products */}
                        <div className='row g-3'>
                            {/* Sales Graph */}
                            <div className='col-lg-8'>
                                <Card className='shadow-sm border-0'>
                                    <Card.Body>
                                        <div className='d-flex justify-content-between align-items-center mb-3'>
                                            <h6 className='fw-bold'>
                                                Sales Graph
                                            </h6>
                                            <div className='d-flex gap-2'>
                                                <Button
                                                    size='sm'
                                                    variant={
                                                        range === "monthly"
                                                            ? "primary"
                                                            : "outline-secondary"
                                                    }
                                                    onClick={() =>
                                                        setRange("monthly")
                                                    }>
                                                    Monthly
                                                </Button>
                                                <Button
                                                    size='sm'
                                                    variant={
                                                        range === "yearly"
                                                            ? "primary"
                                                            : "outline-secondary"
                                                    }
                                                    onClick={() =>
                                                        setRange("yearly")
                                                    }>
                                                    Yearly
                                                </Button>
                                            </div>
                                        </div>
                                        <Line
                                            data={chartData}
                                            options={chartOptions}
                                        />
                                    </Card.Body>
                                </Card>
                            </div>

                            {/* Doughnut Chart */}
                            <div className='col-lg-4'>
                                <Card className='shadow-sm border-0 h-100'>
                                    <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                                        <div className='d-flex gap-2 mb-3'>
                                            <Button
                                                size='sm'
                                                variant={
                                                    range === "monthly"
                                                        ? "primary"
                                                        : "outline-secondary"
                                                }
                                                onClick={() =>
                                                    setRange("monthly")
                                                }>
                                                Monthly
                                            </Button>
                                            <Button
                                                size='sm'
                                                variant={
                                                    range === "yearly"
                                                        ? "primary"
                                                        : "outline-secondary"
                                                }
                                                onClick={() =>
                                                    setRange("yearly")
                                                }>
                                                Yearly
                                            </Button>
                                        </div>
                                        <Doughnut
                                            data={chart}
                                            style={{
                                                marginTop: "20px",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </Card.Body>
                                </Card>
                            </div>

                            {/* Top Selling Products */}
                            <div className='col-lg-4'>
                                <Card className='shadow-sm border-0 h-100'>
                                    <Card.Body>
                                        <div className='d-flex justify-content-between mb-3'>
                                            <h5 className='fw-bold text-primary'>
                                                Top Selling Products
                                            </h5>
                                            <h5 className='fw-bold text-primary'>
                                                Sold
                                            </h5>
                                        </div>
                                        {data.topSellingProducts.map((top) => (
                                            <div
                                                key={top._id}
                                                className='d-flex justify-content-between align-items-center mb-3'>
                                                <div className='d-flex align-items-center'>
                                                    <img
                                                        src={top.image || ""}
                                                        alt={top.name}
                                                        style={{
                                                            width: "50px",
                                                            height: "50px",
                                                            borderRadius: "8px",
                                                            objectFit: "cover",
                                                        }}
                                                        className='me-3'
                                                    />
                                                    <div>
                                                        <div className='fw-semi-bold'>
                                                            {top.name}
                                                        </div>
                                                        <small className='text-muted'>
                                                            Revenue:{" "}
                                                            <small className='text-success fw-bold'>
                                                                ₹
                                                                {top.totalSales}
                                                            </small>
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className='fw-bold text-danger'>
                                                    {top.totalQuantity}
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            variant='primary'
                                            size='lg'
                                            onClick={handleExportTopSellingPDF}>
                                            Report
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </div>

                            {/* Top Selling categories */}
                            <div className='col-lg-4'>
                                <Card className='shadow-sm border-0 h-100'>
                                    <Card.Body>
                                        <div className='d-flex justify-content-between mb-3'>
                                            <h5 className='fw-bold text-primary'>
                                                Top Selling Categories
                                            </h5>
                                            <h5 className='fw-bold text-primary'>
                                                Sold
                                            </h5>
                                        </div>
                                        {data.topSellingCategories.map(
                                            (top) => (
                                                <div
                                                    key={top._id}
                                                    className='d-flex justify-content-between align-items-center mb-3'>
                                                    <div className='d-flex align-items-center'>
                                                        <div>
                                                            <div className='fw-semi-bold'>
                                                                {top._id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='fw-bold text-danger'>
                                                        {top.totalSold}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                        <Button
                                            variant='primary'
                                            size='lg'
                                            onClick={
                                                handleExportTopCategoriesPDF
                                            }>
                                            Report
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <AdminFooter />
                </div>
            </div>
        </>
    );
};

export default DashBoard;
