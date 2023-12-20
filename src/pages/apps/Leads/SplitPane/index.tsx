import React, { useState, useEffect } from 'react'
import SplitPane from "react-split-pane";
import "../SplitPane/style.css";
import { listLeads, leadByID, leadSchedule, leadCategoryUpdate, leadCount, leadTagUpdate, leadDelete } from '../../../../helpers/api/api';
import { Table, Row, Col, Form, Button, Offcanvas } from 'react-bootstrap';
import Lottie from 'react-lottie-player'
import lottieJson from '../SplitPane/JSON/empty.json'
import ChatList, { MessageItemTypes } from './ChatList';
import Spinner from '../../../../components/Spinner';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import { fetchLeadCount, fetchLeads, fetchScheduleLeadCount } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import DatePicker from 'react-datepicker';
import { RootState } from '../../../../redux/store';
import LeadsActionTypes from '../../../../redux/leads/constants';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditLeadModal from '../../../../components/EditLeadModal';

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
    tags: string[];
    category: string;
    comment: string;
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
    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");

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

    const Reduxleads = useSelector((state: RootState) => state.leadsReducer?.leads);

    const reduxloading = useSelector((state: RootState) => state.leadsReducer?.loading);

    const listAll = async () => {
        try {
            setLoading(true)
            // const data = await listLeads();
            dispatch({ type: LeadsActionTypes.FETCH_LEAD });
            await dispatch(fetchLeads());

            // setLeads(data.leads)
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
            const data = await leadByID(id);
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

    //Tags
    const [selectedTags, setSelectedTags] = useState<any[]>([]);

    const handleTags = async (tag: string) => {
        const isTagSelected = selectedTags.includes(tag);

        const updatedTags = isTagSelected
            ? selectedTags.filter((selectedTag) => selectedTag !== tag)
            : [...selectedTags, tag];
        setSelectedTags(updatedTags);


        try {
            const data = await leadTagUpdate(perLead?.id, updatedTags)
            listAll()
            toast.success(data);
        } catch (error: any) {
            console.log(error)
            toast.error(error);
        }
    };

    const tags = [
        'Quotation',
        'Send Detail',
        'Immediate Sale',
        'Sale',
        'Low Priority',
        'Dynamic',
        'Ecommerce',
        'Static',
        'Mobile App'
    ];


    //schedule 
    const [selectedTime, setSelectedTime] = useState('');
    const currentDate = moment();
    const [days, setDays] = useState(0);



    const generateOptions = (start: number, end: number) => {
        const options = [];
        for (let i = start; i <= end; i++) {
            const paddedValue = i < 10 ? `0${i}` : `${i}`; // Pad with a leading zero if less than 10
            options.push(<option key={i} value={paddedValue}>{paddedValue}</option>);
        }
        return options;
    };

    const handleTimeChange = () => {
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

    const handleSchedule = async (number?: number) => {
        try {

            const defaultHours = 0;
            const defaultMinutes = 0;

            const selectedDateTime = moment(currentDate)
                .set({
                    hours: defaultHours,
                    minutes: defaultMinutes,
                })
                .add(number, 'days');

            const formattedDateTime = selectedDateTime.format('DD/MMM/YYYY h:mmA');

            const formattedDate = selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : null;

            const data = await leadSchedule(perLead?.id, selectedTime ? selectedTime : formattedDateTime)

            console.log("hi", data)

            console.log("date", formattedDate)


            toast.success(data)
            setSelectedTime('')
            dispatch(fetchLeads(selectedFilterCategory, formattedDate));
            // listAll()
            dispatch(fetchLeadCount(selectedFilterCategory, formattedDate));
            dispatch(fetchScheduleLeadCount(selectedFilterCategory, formattedDate));

            const data1 = await leadByID(perLead?.id);
            setPerLead(data1)
        } catch (e: any) {
            toast.error(e)
        }
    }


    //filter
    const [show, setShow] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedFilterCategory, setSelectedFilterCategory] = useState<any[]>([]);
    const [selectedFilerTags, setSelectedFilterTags] = useState<any[]>([]);


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



    const handleFilterTags = async (tag: string) => {
        const isTagSelected = selectedFilerTags.includes(tag);

        const updatedTags = isTagSelected
            ? selectedFilerTags.filter((selectedTag) => selectedTag !== tag)
            : [...selectedFilerTags, tag];

        setSelectedFilterTags(updatedTags);
    };

    const handleDateChange = (date: any) => {
        setSelectedDate(date ? date : '');
    };

    const handleFilter = async () => {
        try {
            const formattedDate = selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : null;
            setLoading(true)
            // const data = await listLeads(selectedFilterCategory, formattedDate);
            dispatch(fetchLeads(selectedFilterCategory, formattedDate, selectedFilerTags));

            dispatch(fetchLeadCount(selectedFilterCategory, formattedDate, selectedFilerTags));
            dispatch(fetchScheduleLeadCount(selectedFilterCategory, formattedDate));

            setLoading(false)
            // setSelectedFilterCategory([])
            setSelectedDate('')
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }


    // lead edit and delete
    const [showModal, setShowModal] = useState(false);
    const [editLeadData, setEditLeadData] = useState({});

    const handleEdit = async (id: number) => {
        const lead = leads?.find((lead) => lead.id === id);

        console.log("dd", lead)
        setEditLeadData(lead);

        setShowModal(true);

    }

    const handleModalClose = () => {
        setShowModal(false);
      };

    const handleDelete = async (id: number) => {
        try {
            if (window.confirm("Are you sure you want to delete this lead?")) {
                const data = await leadDelete(id);
            }
            toast.success("Lead deleted successfully");
            dispatch(fetchLeads());

            dispatch(fetchLeadCount());
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="split-panel">
            <div className="panel" style={{ width: `${leftPanelWidth}%` }}>
                <div className="panel-content" style={{ overflowY: 'auto' }}>
                    <div className="table-container">
                        <EditLeadModal ModalShow={showModal} onModalClose={handleModalClose} leadData={editLeadData}/>
                        <Form>
                            <Row className="mb-3">
                                <Col>
                                    <Form.Group controlId="formName">
                                        {/* <Form.Label>Search by Name:</Form.Label> */}
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter name"
                                            value={searchName}
                                            onChange={(e) => setSearchName(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formDate">
                                        {/* <Form.Label>Search by Date:</Form.Label> */}
                                        <Form.Control
                                            type="date"
                                            value={searchDate}
                                            onChange={(e) => setSearchDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Button className={``} variant="outline-primary" onClick={toggle} style={{ marginBottom: '3px', float: "right" }}>
                                        <FeatherIcon icon='filter' className="icon-dual icon-xs me-1" /> Filter
                                    </Button>
                                </Col>
                            </Row>
                        </Form>


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
                                            <strong>Tags:</strong>
                                            <div className="btn-group" style={{ display: "flex", flexWrap: "wrap" }}>
                                                {tags.map((tag) => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        className={`btn ${selectedFilerTags.includes(tag) ? 'btn-success' : 'btn-primary'} btn-sm`}
                                                        onClick={() => handleFilterTags(tag)}
                                                        style={{ margin: '5px' }}
                                                    >
                                                        {tag}
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

                        {/* table */}
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Call</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <>
                                        <tr>
                                            <td colSpan={4}>
                                                <Spinner className="m-2" color={'info'}>
                                                    <span className="visually-hidden">Loading...</span>
                                                </Spinner>
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    <>
                                        {leads && leads.length > 0 ? (
                                            leads
                                                .filter((lead) => lead.name.toLowerCase().includes(searchName.toLowerCase()))
                                                .filter((lead) => {
                                                    if (searchDate) {
                                                        const leadDate = new Date(lead.created_at).toISOString().split("T")[0];
                                                        return leadDate === searchDate;
                                                    }
                                                    return true;
                                                })
                                                .map((lead) => (
                                                    <tr key={lead.id} className={activeRow === lead.id ? 'active-row' : ''}>
                                                        <td style={{ textTransform: "capitalize", cursor: "pointer" }} onClick={() => {
                                                            fetchLeadById(lead.id);
                                                            setActiveRow(lead.id === activeRow ? null : lead.id);
                                                        }}>
                                                            <a style={{ color: "blue" }}>{lead.name} - {convertToIST(lead.created_at)}</a>
                                                        </td>
                                                        <td>{lead.category}</td>
                                                        <td>
                                                            <button className="call-button" onClick={() => handleCall(lead.phone)}>
                                                                Call
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <FaEdit className="action-icon" style={{ color: "blue", cursor: "pointer" }} onClick={() => handleEdit(lead.id)} />

                                                            <FaTrash className="action-icon" style={{ color: "red", cursor: "pointer" }} onClick={() => handleDelete(lead.id)} />
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4}>No leads available</td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="handle" onMouseDown={handleDrag}></div>
            <div className="panel" style={{ width: `33.33%` }}>
                <div className="panel-content" style={{ overflowY: 'auto' }}>
                    {perLead && Object.keys(perLead).length > 0 ? (
                        <div style={{ overflowX: "hidden", marginTop: "2px" }}>
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

                            <Row>
                                <Col>
                                    <div>
                                        <strong>Tags:</strong>

                                        <div className="btn-group" style={{ display: "flex", flexWrap: "wrap" }}>
                                            {tags.map((tag) => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    className={`btn ${perLead.tags && perLead.tags.includes(tag) || selectedTags?.includes(tag) ? 'btn-success' : 'btn-primary'} btn-sm`}

                                                    onClick={() => handleTags(tag)}
                                                    style={{ margin: '5px' }}
                                                >
                                                    {tag}
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

                                <Col>
                                    <label htmlFor="days"><strong>Snooze:</strong></label>

                                    <div className="btn-group" style={{ display: "flex", flexWrap: "wrap" }}>

                                        {[1].map((number) => (
                                            <Button key={number}
                                                className={`btn ${number === days ? 'btn-success' : 'btn-primary'} btn-sm`}
                                                onClick={() => handleSchedule(number)} style={{ margin: '5px' }}
                                            >
                                                {number} Day
                                            </Button>
                                        ))}
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
                                    <Button disabled={!selectedTime} onClick={() => handleSchedule()} style={{ marginTop: '5px', width: "100%" }}>Submit</Button>
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