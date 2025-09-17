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

        const filterInfo = `Date Range: ${
            customRange[0] && customRange[1]
                ? `${customRange[0].toDateString()} - ${customRange[1].toDateString()}`
                : dateRange
        }, Status: ${status || "All"}`;
        doc.setFontSize(10);
        doc.text(filterInfo, 14, 30);

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

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });

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
                <div className='flex-grow-1 d-flex flex-column main-content mt-5'>
                    <div className='flex-grow-1 py-4 container salesReport-container'>
                        <h2 className='mb-4'>Sales Report</h2>

                        {/* date filters */}
                        <div className='row g-2 mb-4 mt-5 align-items-center'>
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

                            <div className='col-12 col-sm-auto'>
                                {/* Status Filter */}
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
                                        <li>
                                            <button
                                                className='dropdown-item'
                                                onClick={() => setStatus("")}>
                                                All Status
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className='dropdown-item'
                                                onClick={() =>
                                                    setStatus("PLACED")
                                                }>
                                                Placed
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className='dropdown-item'
                                                onClick={() =>
                                                    setStatus("DELIVERED")
                                                }>
                                                Delivered
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className='dropdown-item'
                                                onClick={() =>
                                                    setStatus("CANCELLED")
                                                }>
                                                Cancelled
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className='dropdown-item'
                                                onClick={() =>
                                                    setStatus("REFUNDED")
                                                }>
                                                Refunded
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className='dropdown-item'
                                                onClick={() =>
                                                    setStatus("RETURNED")
                                                }>
                                                Returned
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div
                                className='col-12 col-sm-auto'
                                onClick={handleExportPDF}>
                                <Button variant='dark'>Export PDF</Button>
                            </div>
                        </div>

                        {/* Report Table */}
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
                    </div>
                    <AdminFooter />
                </div>
            </div>
        </>
    );
};

export default SalesReport;
