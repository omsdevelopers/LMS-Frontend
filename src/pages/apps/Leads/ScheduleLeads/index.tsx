import React, { useState, useEffect } from 'react'
import SplitPane from "react-split-pane";
import "../SplitPane/style.css";
import { listLeads, leadByID, leadSchedule, leadCategoryUpdate, leadCount, scheduleLeadByID } from '../../../../helpers/api/api';
import { Table, Row, Col, Form, Button, Offcanvas } from 'react-bootstrap';
import Lottie from 'react-lottie-player'
import lottieJson from '../SplitPane/JSON/empty.json'
import ChatList, { MessageItemTypes } from './ChatList';
import Spinner from '../../../../components/Spinner';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import { fetchScheduleLeadCount, fetchScheduleLeads } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import DatePicker from 'react-datepicker';
import { RootState } from '../../../../redux/store';
import LeadsActionTypes from '../../../../redux/scheduleLeads/constants';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Skeleton from 'react-loading-skeleton'

interface Comment {
    id: number;
    lead_id: number;
    comment: string;
    userName: string;
    created_at: string;
    postedOn: string;
    updated_at: string;
}

interface Lead {
    id: number;
    name: string;
    phone: number;
    email: string;
    platform: string;
    address: string;
    websiteDetails: string;
    projectDetails: string;
    interestedServices: string;
    servicesTaken: string;
    group: string;
    tags: string;
    category: string;
    comment: string;
    date_shedule: string;
    comments: Comment[];
    created_at: string;
    updated_at: string;
}


function Index() {
    const dispatch = useDispatch();

    const [leftPanelWidth, setLeftPanelWidth] = useState(33.33);
    const [leads, setLeads] = useState<any[]>();
    const [perLead, setPerLead] = useState<Lead | Record<string, never>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [activeRow, setActiveRow] = useState(null);

    const handleDrag = (e: any) => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: any) => {
        setLeftPanelWidth((e.clientX / window.innerWidth) * 100);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const Reduxleads = useSelector((state: RootState) => state.leadsScheduleReducer?.leads);

    const reduxloading = useSelector((state: RootState) => state.leadsScheduleReducer?.loading);

    const listAll = async () => {
        try {
            setLoading(true)
            dispatch({ type: LeadsActionTypes.SET_SCHEDULE_LEAD });
            await dispatch(fetchScheduleLeads());
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    useEffect(() => {
        listAll()
    }, [dispatch])

    useEffect(() => {
        setLeads(Reduxleads);
    }, [Reduxleads]);

    const convertToIST = (utcDateString: any) => {
        const utcDate = new Date(utcDateString);
        const istOptions = {
            timeZone: 'Asia/Kolkata',
            hour12: true,
        };
        return utcDate.toLocaleString('en-US', istOptions);
    };

    const handleCall = (phone: any) => {
        console.log(`Calling ${phone}`);
    };

    const fetchLeadById = async (id: number) => {
        try {
            const data = await scheduleLeadByID(id);
            setPerLead(data)
        } catch (e) {
            console.log(e)
        }
    }



    //category
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        setSelectedCategory(perLead?.category)
    }, [perLead])


    const handleCategoryClick = async (category: string) => {
        setSelectedCategory(category);
        try {
            const data = await leadCategoryUpdate(perLead?.id, category)
            listAll()
            toast.success(data);
        } catch (error: any) {
            console.log(error)
            toast.error(error);
        }
    };

    const categories = ['New Lead', 'Following', 'Important', 'Ready Lead', 'Converted', 'Not Serious', 'Silent', 'Unwanted', 'For Job', 'Not Sale'];
    //schedule 
    const [selectedTime, setSelectedTime] = useState('');
    const currentDate = moment();

    const generateOptions = (start: number, end: number) => {
        const options = [];
        for (let i = start; i <= end; i++) {
            const paddedValue = i < 10 ? `0${i}` : `${i}`; // Pad with a leading zero if less than 10
            options.push(<option key={i} value={paddedValue}>{paddedValue}</option>);
        }
        return options;
    };

    const handleTimeChange = (event: any) => {
        console.log("current", currentDate.format('MMM D, YYYY'));
        const hoursValue = (document.getElementById('hours') as HTMLSelectElement)?.value;
        const minutesValue = (document.getElementById('minutes') as HTMLSelectElement)?.value;
        const selectedDay = (document.getElementById('days') as HTMLSelectElement)?.value;

        const hoursToAdd = parseInt(hoursValue, 10) || 0;
        const minutesToAdd = parseInt(minutesValue, 10) || 0;
        const daysToAdd = parseInt(selectedDay, 10) || 0; // Number of days to add

        // Create a Moment.js object with the current date and time
        const selectedDateTime = moment(currentDate)
            .add(hoursToAdd, 'hours')
            .add(minutesToAdd, 'minutes')
            .add(daysToAdd, 'days') // Add days to the current date

        console.log('Parsed Hours:', hoursToAdd);
        console.log('Parsed Minutes:', minutesToAdd);
        console.log('Parsed Day:', daysToAdd);

        const formattedTime = selectedDateTime.format('DD/MMM/YYYY h:mmA');

        setSelectedTime(formattedTime);
    };

    const handleSchedule = async () => {
        try {
            const formattedDate = selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : null;
            const data = await leadSchedule(perLead?.id, selectedTime)
            toast.success(data)
            setSelectedTime('')
            dispatch(fetchScheduleLeads(selectedFilterCategory, formattedDate));
            dispatch(fetchScheduleLeadCount(selectedFilterCategory, formattedDate));

            const data1 = await scheduleLeadByID(perLead?.id);
            setPerLead(data1)
        } catch (e: any) {
            toast.error(e)
        }
    }


    //filter
    const [show, setShow] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedFilterCategory, setSelectedFilterCategory] = useState<any[]>([]);


    const toggle = () => {
        setShow((prevState) => !prevState);
    };

    const handleFilterCategory = async (category: string) => {
        const isCategorySelected = selectedFilterCategory.includes(category);

        const updatedCategories = isCategorySelected
            ? selectedFilterCategory.filter((selectedCategory) => selectedCategory !== category)
            : [...selectedFilterCategory, category];

        setSelectedFilterCategory(updatedCategories);
    };

    const handleDateChange = (date: any) => {
        console.log("from date handle", date)
        setSelectedDate(date ? date : '');
    };

    const handleFilter = async () => {
        try {
            const formattedDate = selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : null;
            setLoading(true)
            // const data = await listLeads(selectedFilterCategory, formattedDate);
            dispatch(fetchScheduleLeads(selectedFilterCategory, formattedDate));

            dispatch(fetchScheduleLeadCount(selectedFilterCategory, formattedDate));
            setLoading(false)
            // setSelectedFilterCategory([])
            setSelectedDate('')
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const [remainingTimes, setRemainingTimes] = useState([]);


    useEffect(() => {
        const updateRemainingTimes = () => {
            const updatedRemainingTimes: any = leads?.map((lead) => {
                const dateShedule = moment(lead.date_shedule, "DD/MMM/YYYY h:mmA", true);

                if (!dateShedule.isValid() || dateShedule.isBefore(moment())) {
                    console.error(`Invalid or past date: ${lead.date_shedule}`);
                    return null;
                }

                const duration = moment.duration(dateShedule.diff(moment()));
                const totalSeconds = Math.max(duration.asSeconds(), 0);
                const elapsedSeconds = (lead.category === "Ready Lead" ? 2 : 0);
                const remainingSeconds = Math.max(totalSeconds - elapsedSeconds, 0);

                return {
                    hours: Math.floor(remainingSeconds / 3600),
                    minutes: Math.floor((remainingSeconds % 3600) / 60),
                    seconds: Math.floor(remainingSeconds % 60),
                };
            });

            setRemainingTimes(updatedRemainingTimes);
        };

        const intervalId = setInterval(updateRemainingTimes, 1000);

        return () => clearInterval(intervalId);
    }, [leads]); // Add leads as a dependency to trigger the effect on leads change


    return (
        <div className="split-panel">
            <div className="panel" style={{ width: `${leftPanelWidth}%` }}>
                <div className="panel-content" style={{ overflowY: 'auto' }}>
                    <div className="table-container">

                        <Button className={`btn-sm `} variant="outline-primary" onClick={toggle} style={{ marginBottom: '3px', float: "right" }}>
                            <FeatherIcon icon='filter' className="icon-dual icon-xs me-1" /> Filter</Button>

                        <Offcanvas show={show} onHide={toggle} placement="end" >
                            <Offcanvas.Header closeButton>
                                <h5 id="offcanvasTopLabel">Filter</h5>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Row>
                                    <Col>
                                        <div>
                                            <strong>Category:</strong>
                                            <div className="btn-group" style={{ display: "flex", flexWrap: "wrap" }}>
                                                {categories.map((category) => (
                                                    <button
                                                        key={category}
                                                        type="button"
                                                        className={`btn ${selectedFilterCategory.includes(category) ? 'btn-success' : 'btn-primary'} btn-sm`}
                                                        onClick={() => handleFilterCategory(category)}
                                                        style={{ margin: '5px' }}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                            <br></br>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <div>
                                            <strong>Date:</strong>
                                            <div >
                                                <DatePicker
                                                    selected={selectedDate ? new Date(selectedDate) : null}
                                                    onChange={handleDateChange}
                                                    dateFormat="dd/MM/yyyy" // Adjust the date format as needed
                                                    isClearable
                                                    className="form-control" // Bootstrap form control class
                                                />
                                            </div>

                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Button style={{ marginTop: '25px', width: "100%" }} onClick={handleFilter}>Submit</Button>
                                    </Col>
                                </Row>
                            </Offcanvas.Body>
                        </Offcanvas>

                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Time</th>
                                    <th>Category</th>
                                    <th>Call</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reduxloading ? (
                                    <>
                                        <Spinner className="m-2" color={'info'}>
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </>
                                ) : (
                                    <>
                                        {leads && leads.length > 0 ? (
                                            leads.map((lead, index) => {
                                                const remainingTime: any = remainingTimes[index];

                                                // if (!remainingTime) {
                                                //     return null
                                                // }

                                                return (
                                                    <tr key={lead.id} className={activeRow === lead.id ? 'active-row' : ''}>
                                                        <td style={{ textTransform: "capitalize", cursor: "pointer" }}
                                                            onClick={() => {
                                                                fetchLeadById(lead.id);
                                                                setActiveRow(lead.id === activeRow ? null : lead.id);
                                                            }}
                                                        >
                                                            <a style={{ color: "blue" }}>{lead.name} - {convertToIST(lead.created_at)}</a>
                                                        </td>
                                                        <td style={{ color: "red" }}>
                                                            {remainingTime ? (
                                                                <>
                                                                    {remainingTime.hours} hours {remainingTime.minutes} minutes {remainingTime.seconds} seconds remaining
                                                                </>
                                                            ) : (
                                                                <Skeleton />
                                                            )}
                                                        </td>
                                                        <td>{lead.category}</td>
                                                        <td>
                                                            <button className="call-button" onClick={() => handleCall(lead.phone)}>
                                                                Call
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={3}>No leads available</td>
                                            </tr>
                                        )}
                                    </>
                                )
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="handle" onMouseDown={handleDrag}></div>
            <div className="panel" style={{ width: `33.33%` }}>
                <div className="panel-content" style={{ overflowY: 'auto' }}>
                    {perLead && Object.keys(perLead).length > 0 ? (
                        <div style={{ overflowX: "hidden", marginTop: "50px" }}>
                            <Row>
                                <Col>
                                    <Table striped bordered hover>
                                        <tbody>
                                            <tr>
                                                <td><strong>Name:</strong></td>
                                                <td>{perLead?.name}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Phone:</strong></td>
                                                <td>{perLead?.phone}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Email:</strong></td>
                                                <td>{perLead?.email}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Call Time:</strong></td>
                                                <td>{convertToIST(perLead?.created_at)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Address:</strong></td>
                                                <td>{perLead?.address}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Comment:</strong></td>
                                                <td>{perLead?.comment}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Tag:</strong></td>
                                                <td>{perLead?.tags}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>

                                <Col>
                                    <Table striped bordered hover>
                                        <tbody>
                                            <tr>
                                                <td><strong>Platform:</strong></td>
                                                <td>{perLead?.platform}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Website Details:</strong></td>
                                                <td>{perLead?.websiteDetails}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Project Details:</strong></td>
                                                <td>{perLead?.projectDetails}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Interested Services:</strong></td>
                                                <td>{perLead?.interestedServices}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Services Taken:</strong></td>
                                                <td>{perLead?.comment}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Lead Group:</strong></td>
                                                <td>{perLead?.group}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <div>
                                        <strong>Category:</strong>
                                        <div className="btn-group" style={{ display: "flex", flexWrap: "wrap" }}>
                                            {categories.map((category) => (
                                                <button
                                                    key={category}
                                                    type="button"
                                                    className={`btn ${category === selectedCategory ? 'btn-success' : 'btn-primary'} btn-sm`} // Use 'btn-sm' for smaller buttons
                                                    onClick={() => handleCategoryClick(category)}
                                                    style={{ margin: '5px' }} // Adjust the margin as needed
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                        <br></br>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px", alignItems: "center" }}>
                                <Col>
                                    <div>
                                        <label htmlFor="time"><strong>Time:</strong></label>
                                        <div style={{ display: 'flex' }}>
                                            <Form.Select
                                                style={{ marginRight: '5px' }}
                                                id="hours"
                                                name="hours"
                                                onChange={handleTimeChange}
                                            >
                                                {generateOptions(0, 23)}
                                            </Form.Select>
                                            <Form.Select
                                                style={{ marginRight: '5px' }}
                                                id="minutes"
                                                name="minutes"
                                                onChange={handleTimeChange}
                                            >
                                                {generateOptions(0, 59)}
                                            </Form.Select>
                                        </div>
                                    </div>
                                </Col>

                                <Col>
                                    <div>
                                        <label htmlFor="days"><strong>Days:</strong></label>
                                        <Form.Control
                                            type="number"
                                            id="days"
                                            name="days"
                                            onChange={handleTimeChange}
                                            min="0" // Set minimum value if needed
                                        />
                                    </div>
                                </Col>

                            </Row>
                            {selectedTime ? (
                                <Row style={{ marginTop: '15px', }}>
                                    <Col>
                                        <div >
                                            <p style={{ color: 'blue' }}>Selected Time: {selectedTime}</p>
                                        </div>
                                    </Col>
                                </Row>
                            ) : (
                                <p style={{ color: 'red', marginTop: '15px' }}>Select Time for Schedule</p>
                            )}


                            <Row>
                                <Col>
                                    <Button disabled={!selectedTime} onClick={handleSchedule} style={{ marginTop: '5px', width: "100%" }}>Submit</Button>
                                    <Toaster />
                                </Col>
                            </Row>


                        </div>
                    ) :
                        (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
                                    <Lottie
                                        loop
                                        animationData={lottieJson}
                                        play
                                        style={{ width: 350, height: 250 }}
                                    />
                                    <h6 style={{ textAlign: 'center' }}>Click the leads from left side</h6>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
            <div className="handle" onMouseDown={handleDrag}></div>
            <div className="panel" style={{ width: `${100 - leftPanelWidth - 33.33}%` }}>
                <div className="panel-content" style={{ overflowY: 'auto' }}>
                    {perLead && Object.keys(perLead).length > 0 ? (
                        <div style={{ marginTop: "10px" }}>
                            <ChatList title="Commend" messages={perLead?.comments} id={perLead?.id} />
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
                                <Lottie
                                    loop
                                    animationData={lottieJson}
                                    play
                                    style={{ width: 350, height: 250 }}
                                />
                                <h6 style={{ textAlign: 'center' }}>Click the leads from left side</h6>
                            </div>
                        </>
                    )
                    }
                </div>
            </div>
        </div >
    );
}

export default Index
