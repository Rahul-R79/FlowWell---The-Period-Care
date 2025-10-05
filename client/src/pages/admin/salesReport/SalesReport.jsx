// admin sales report
import Sidebar from "../../../components/SideNav/AdminSidebar";
import AdminFooter from "../../../components/Footer/AdminFooter";
import { Table, Button, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSalesReport } from "../../../features/salesReportSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SalesReport = () => {
    const dispatch = useDispatch();
    const { loadingByAction, report } = useSelector(
        (state) => state.salesReport
    );

    const [dateRange, setDateRange] = useState("Last 1 Month");
    const [status, setStatus] = useState("");
    const [customRange, setCustomRange] = useState([null, null]);
    const [calendarOpen, setCalendarOpen] = useState(false);

    const getDates = () => {
        if (customRange[0] && customRange[1]) {
            return {
                startDate: customRange[0].toISOString(),
                endDate: customRange[1].toISOString(),
            };
        }
        const endDate = new Date();
        const startDate = new Date();
        switch (dateRange) {
            case "Last 7 Days":
                startDate.setDate(endDate.getDate() - 7);
                break;
            case "Last 1 Month":
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case "Last 3 Months":
                startDate.setMonth(endDate.getMonth() - 3);
                break;
            default:
                startDate.setMonth(endDate.getMonth() - 1);
        }
        return {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Sales Report", 14, 20);

        const generatedDate = new Date().toDateString();
        doc.setFontSize(10);
        doc.text(`Generated on: ${generatedDate}`, 14, 26);

        const filterInfo = `Date Range: ${
            customRange[0] && customRange[1]
                ? `${customRange[0].toDateString()} - ${customRange[1].toDateString()}`
                : dateRange
        }, Status: ${status || "All"}`;
        doc.setFontSize(10);
        doc.text(filterInfo, 14, 30);

        // Summary Table
        const tableColumn = ["Particular", "Value"];
        const tableRows = [
            ["Total Orders", report.totalOrders],
            ["Total Revenue", report.totalRevenue],
            ["Total Products Sold", report.totalProducts],
            ["Total Customers", report.totalCustomers],
            ["Returned Orders", report.returnedOrders],
            ["Cancelled Orders", report.cancelOrders],
            ["Refunded Orders", report.refundedOrders],
        ];

        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40 });

        // Orders Table
        if (report.orders && report.orders.length > 0) {
            const orderColumns = [
                "Order ID",
                "Customer",
                "Date",
                "Status",
                "Total Amount",
            ];
            const orderRows = report.orders.map((order) => [
                order.orderNumber,
                order.user?.name || "-",
                new Date(order.createdAt).toDateString(),
                order.orderStatus.charAt(0).toUpperCase() +
                    order.orderStatus.slice(1).toLowerCase(),
                order.total,
            ]);

            autoTable(doc, {
                head: [orderColumns],
                body: orderRows,
                startY: doc.lastAutoTable.finalY + 10,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] },
            });
        } else {
            doc.text(
                "No orders found for this report.",
                14,
                doc.lastAutoTable.finalY + 15
            );
        }

        doc.save("sales_report.pdf");
    };

    useEffect(() => {
        const { startDate, endDate } = getDates();
        dispatch(getSalesReport({ startDate, endDate, status }));
    }, [dateRange, status, customRange]);

    return (
        <>
            {loadingByAction.getSalesReport && <LoadingSpinner />}
            <div className='d-flex flex-column flex-lg-row min-vh-100'>
                <Sidebar />
                <div className='flex-grow-1 d-flex flex-column main-content'>
                    <div className='flex-grow-1 py-4 container salesReport-container'>
                        <h2 className='mb-4 text-center text-lg-start'>
                            Sales Report
                        </h2>

                        {/* Filters */}
                        <div className='row g-2 mb-4 mt-5 align-items-center'>
                            {/* Date Range */}
                            <div className='col-12 col-md-auto'>
                                <Dropdown
                                    onSelect={(e) => {
                                        setDateRange(e);
                                        setCustomRange([null, null]);
                                    }}>
                                    <Dropdown.Toggle
                                        variant='outline-dark'
                                        className='w-100'>
                                        {dateRange}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item eventKey='Last 7 Days'>
                                            Last 7 Days
                                        </Dropdown.Item>
                                        <Dropdown.Item eventKey='Last 1 Month'>
                                            Last 1 Month
                                        </Dropdown.Item>
                                        <Dropdown.Item eventKey='Last 3 Months'>
                                            Last 3 Months
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            {/* Custom Calendar */}
                            <div
                                className='col-12 col-sm-auto'
                                style={{ position: "relative" }}>
                                <Button
                                    variant='btn btn-outline-primary'
                                    onClick={() =>
                                        setCalendarOpen(!calendarOpen)
                                    }
                                    className='w-100'>
                                    {customRange[0] && customRange[1] ? (
                                        `${customRange[0].toDateString()} - ${customRange[1].toDateString()}`
                                    ) : (
                                        <i className='bi bi-calendar2-month'></i>
                                    )}
                                </Button>
                                {calendarOpen && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            zIndex: 1000,
                                        }}>
                                        <DatePicker
                                            selectsRange
                                            startDate={customRange[0]}
                                            endDate={customRange[1]}
                                            onChange={setCustomRange}
                                            inline
                                            onCalendarClose={() =>
                                                setCalendarOpen(false)
                                            }
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Status Filter */}
                            <div className='col-12 col-sm-auto'>
                                <div className='dropdown'>
                                    <button
                                        className='btn btn-outline-secondary dropdown-toggle w-100'
                                        type='button'
                                        id='statusDropdown'
                                        data-bs-toggle='dropdown'
                                        aria-expanded='false'>
                                        <i className='bi bi-funnel'></i> Filters
                                    </button>
                                    <ul
                                        className='dropdown-menu'
                                        aria-labelledby='statusDropdown'>
                                        {[
                                            "",
                                            "PLACED",
                                            "DELIVERED",
                                            "CANCELLED",
                                            "REFUNDED",
                                            "RETURNED",
                                        ].map((st) => (
                                            <li key={st || "ALL"}>
                                                <button
                                                    className='dropdown-item'
                                                    onClick={() =>
                                                        setStatus(st)
                                                    }>
                                                    {st || "All Status"}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Export PDF */}
                            <div className='col-12 col-sm-auto'>
                                <Button
                                    variant='dark'
                                    onClick={handleExportPDF}>
                                    Export PDF
                                </Button>
                            </div>
                        </div>

                        {/* Summary Table */}
                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Particular</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Total Orders</td>
                                    <td>{report.totalOrders}</td>
                                </tr>
                                <tr>
                                    <td>Total Revenue</td>
                                    <td>{report.totalRevenue}</td>
                                </tr>
                                <tr>
                                    <td>Total Products Sold</td>
                                    <td>{report.totalProducts}</td>
                                </tr>
                                <tr>
                                    <td>Total Customers</td>
                                    <td>{report.totalCustomers}</td>
                                </tr>
                                <tr>
                                    <td>Returned Orders</td>
                                    <td>{report.returnedOrders}</td>
                                </tr>
                                <tr>
                                    <td>Cancelled Orders</td>
                                    <td>{report.cancelOrders}</td>
                                </tr>
                                <tr>
                                    <td>Refunded Orders</td>
                                    <td>{report.refundedOrders}</td>
                                </tr>
                            </tbody>
                        </Table>

                        {/* Detailed Orders Table */}
                        <h4 className='mt-3'>Order Details</h4>
                        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Order No</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.orders?.length > 0 ? (
                                        report.orders.map((order, idx) => (
                                            <tr key={order._id}>
                                                <td>{idx + 1}</td>
                                                <td>{order.orderNumber}</td>
                                                <td>
                                                    {order.user?.name || "N/A"}
                                                </td>
                                                <td>₹{order.total}</td>
                                                <td>
                                                    {order.orderStatus
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        order.orderStatus
                                                            .slice(1)
                                                            .toLowerCase()}
                                                </td>
                                                <td>
                                                    {new Date(
                                                        order.createdAt
                                                    ).toDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className='text-center'>
                                                No orders found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <AdminFooter />
                </div>
            </div>
        </>
    );
};

export default SalesReport;
