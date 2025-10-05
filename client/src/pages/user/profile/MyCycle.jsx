//user cycle calender page
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../../components/Footer/UserFooter";
import UserHeader from "../../../components/Header/UserHeader";
import ProfileNav from "../../../components/UserProfileSideNav/ProfileNav";
import { Card, Form, Button } from "react-bootstrap";
import "./userProfile.css";
import {
    saveCycleInfo,
    clearCycleErrors,
    getCycleInfo,
} from "../../../features/periodCycleSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";

function MyCycle() {
    const dispatch = useDispatch();

    const { cycle, loadingByAction, errorByAction } = useSelector(
        (state) => state.cycle
    );

    const [lastPeriodDate, setLastPeriodDate] = useState("");
    const [cycleLength, setCycleLength] = useState(28);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            dispatch(saveCycleInfo({ lastPeriodDate, cycleLength })).unwrap();
        } catch (err) {
        }
    };

    const getNextPeriodDate = () => {
        if (!lastPeriodDate) return "-";
        let start = new Date(lastPeriodDate);
        start.setDate(start.getDate() + parseInt(cycleLength));
        return start.toDateString();
    };

    const getFieldError = (fieldName) => {
        return errorByAction.saveCycleInfo?.find((e) => e.field === fieldName)
            ?.message;
    };

    useEffect(() => {
        dispatch(clearCycleErrors());
        dispatch(getCycleInfo());
    }, [dispatch]);

    useEffect(() => {
        if (cycle) {
            setLastPeriodDate(cycle.lastPeriodDate?.slice(0, 10)); 
            setCycleLength(cycle.cycleLength || 28);
        }
    }, [cycle]);

    return (
        <>
            {(loadingByAction.saveCycleInfo || loadingByAction.getCycleInfo) && <LoadingSpinner />}
            <UserHeader />
            <div className='myCycle container mt-5 mb-5'>
                <div className='row'>
                    {/* Sidebar */}
                    <div className='col-xl-3 col-lg-4 col-md-5 col-sm-12'>
                        <ProfileNav />
                    </div>

                    {/* Main Content */}
                    <div className='col-xl-9 col-lg-8 col-md-7 col-sm-12'>
                        <Card className='p-4 cycle-card shadow-lg'>
                            <h3 className='mb-3'>🌸 My Period Cycle</h3>
                            <p className='text-muted'>
                                Track your period and get reminders when its
                                time to stock up on your essentials.
                            </p>

                            <Form onSubmit={handleSave} noValidate>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='fw-semibold'>
                                        Last Period Start Date
                                    </Form.Label>
                                    <Form.Control
                                        type='date'
                                        value={lastPeriodDate}
                                        name='lastPeriodDate'
                                        onChange={(e) =>
                                            setLastPeriodDate(e.target.value)
                                        }
                                    />
                                    {getFieldError("lastPeriodDate") && (
                                        <small className='text-danger'>
                                            {getFieldError("lastPeriodDate")}
                                        </small>
                                    )}
                                </Form.Group>

                                <Form.Group className='mb-3'>
                                    <Form.Label className='fw-semibold'>
                                        Average Cycle Length (days)
                                    </Form.Label>
                                    <Form.Control
                                        type='number'
                                        min='20'
                                        max='40'
                                        name='cycleLength'
                                        value={cycleLength}
                                        onChange={(e) =>
                                            setCycleLength(e.target.value)
                                        }
                                    />
                                    {getFieldError("cycleLength") && (
                                        <small className='text-danger'>
                                            {getFieldError("cycleLength")}
                                        </small>
                                    )}
                                </Form.Group>

                                <div className='prediction-box mt-4 p-3 rounded shadow-sm'>
                                    <h6 className='fw-bold'>
                                        📅 Predicted Next Period:
                                    </h6>
                                    <p className='next-date'>
                                        {getNextPeriodDate()}
                                    </p>
                                </div>

                                <Button className='mt-4 save-btn' type='submit'>
                                    Save Cycle Info
                                </Button>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default MyCycle;
