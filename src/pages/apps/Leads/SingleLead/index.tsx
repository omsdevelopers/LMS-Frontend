import React, { useState, useEffect, useMemo } from 'react'
import SplitPane from "react-split-pane";
import "../SplitPane/style.css";
import { listLeads, leadByID, leadSchedule, leadCategoryUpdate, leadCount, scheduleLeadByID, leadTagUpdate, getTags, everyLeadByID } from '../../../../helpers/api/api';
import { Table, Row, Col, Form, Button, Offcanvas } from 'react-bootstrap';
import Lottie from 'react-lottie-player'
import lottieJson from '../SplitPane/JSON/empty.json'
import ChatList, { MessageItemTypes } from './ChatList';
import Spinner from '../../../../components/Spinner';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import { fetchEveryLeadCount, fetchLeadCount, fetchScheduleLeadCount, fetchScheduleLeads } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import DatePicker from 'react-datepicker';
import { RootState } from '../../../../redux/store';
import LeadsActionTypes from '../../../../redux/scheduleLeads/constants';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Skeleton from 'react-loading-skeleton'
import { WithContext as ReactTags } from 'react-tag-input';
import { useParams } from 'react-router-dom';

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
    date_shedule: string;
    comments: Comment[];
    created_at: string;
    updated_at: string;
}

interface Tag {
    id: string;
    text: string;
}

interface Lead {
    id: number;
    tags: string[];
}

interface Props {
    perLead: Lead | null;
}

interface RouteParams {
    id: string;
};


function Index() {
    const dispatch = useDispatch();
    const { id } = useParams<RouteParams>();


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

    const refresh = async () => {
        try {
            // Set loading to true while fetching
            dispatch({ type: LeadsActionTypes.SET_SCHEDULE_LEAD });
            await dispatch(fetchScheduleLeads());
        } catch (e) {
            console.log(e);
        }
    };

    const convertToIST = (utcDateString: any) => {
        const utcDate = new Date(utcDateString);
        const istOptions = {
            timeZone: 'Asia/Kolkata',
            hour12: true,
        };
        return utcDate.toLocaleString('en-US', istOptions);
    };

    const handleCall = (phone: any) => {
        const telLink = document.createElement('a');
        telLink.href = `tel:${phone}`;
        telLink.click();
        console.log(`Calling ${phone}`);
    };


    const fetchLeadById = async (id: any) => {
        try {
            const data = await everyLeadByID(id);
            setPerLead(data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchLeadById(id)
    }, [id])



    //category
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        setSelectedCategory(perLead?.category)
    }, [perLead])


    const handleCategoryClick = async (category: string) => {
        setSelectedCategory(category);
        try {
            const data = await leadCategoryUpdate(perLead?.id, category)
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
            toast.success(data);
        } catch (error: any) {
            console.log(error)
            toast.error(error);
        }
    };

    //get tags 

    const [tagsFromAPI, setTagsFromAPI] = useState([]);

    const AllTags = async () => {

        try {
            const tags = await getTags(1);
            setTagsFromAPI(tags.tags)
        } catch (error) {
            console.error(error);
            toast.error('Failed to load tag');
        }
    }

    useMemo(() => {
        AllTags();
    }, []);

    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        updateTags(perLead?.tags);
    }, [perLead]);

    const updateTags = (tagsData: string[] | string | undefined) => {
        if (typeof tagsData === 'string') {
            const parsedTags = tagsData.split(',').map(tag => tag.trim());

            const updatedTags = parsedTags.map((tag, index) => {
                // Parse the tag as JSON and extract the first element (removing square brackets and extra quotes)
                const extractedText = JSON.parse(tag.replace(/\[/g, "").replace(/\]/g, "")).trim();

                return {
                    id: index.toString(),
                    text: extractedText,
                };
            });

            setTags(updatedTags);
        } else if (Array.isArray(tagsData)) {
            setTags(tagsData.map((tag, index) => ({ id: index.toString(), text: tag })));
        } else {
            setTags([]); // Clear tags if perLead has no tags
        }
    };

    const handleAddition = async (tag: Tag) => {
        const updatedTags = [...tags, tag];
        setTags(updatedTags);

        try {
            await leadTagUpdate(perLead?.id, updatedTags.map(tag => tag.text));
            AllTags();
            toast.success('Tag added successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add tag');
        }
    };

    const handleDelete = (i: number) => {
        const updatedTags = [...tags];
        updatedTags.splice(i, 1);
        setTags(updatedTags);
    };

    const handleTagClick = (index: any) => {
        console.log('The tag at index ' + index + ' was clicked');
    };


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

    const handleTimeChange = (e: any) => {
        if (e.target.name === 'hours') {
            setHoursValue(e.target.value);
        } else if (e.target.name === 'minutes') {
            setMinutesValue(e.target.value);
        }
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

    const [hoursValue, setHoursValue] = useState('');
    const [minutesValue, setMinutesValue] = useState('');

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
            setMinutesValue('');
            setSelectedTime('')
            setSelectedTime('')

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
        console.log("from date handle", date)
        setSelectedDate(date ? date : '');
    };

    const handleFilter = async () => {
        try {
            const formattedDate = selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : null;
            setLoading(true)
            // const data = await listLeads(selectedFilterCategory, formattedDate);
            dispatch(fetchScheduleLeads(selectedFilterCategory, formattedDate, selectedFilerTags));

            dispatch(fetchScheduleLeadCount(selectedFilterCategory, formattedDate, selectedFilerTags));
            setLoading(false)
            // setSelectedFilterCategory([])
            setSelectedDate('')
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const [remainingTimes, setRemainingTimes] = useState([]);

    const updateRemainingTimes = () => {
        const updatedRemainingTimes: any = leads?.map((lead) => {
            const dateShedule = moment(lead.date_shedule, "DD/MMM/YYYY h:mmA", true);

            if (!dateShedule.isValid() || dateShedule.isBefore(moment())) {
                console.error(`Invalid or past date: ${lead.date_shedule}`);
                return null;
            }

            const duration = moment.duration(dateShedule.diff(moment()));
            const totalSeconds = Math.max(duration.asSeconds(), 0);
            const elapsedSeconds = lead.category === "Ready Lead" ? 2 : 0;
            const remainingSeconds = Math.max(totalSeconds - elapsedSeconds, 0);

            return {
                hours: Math.floor(remainingSeconds / 3600),
                minutes: Math.floor((remainingSeconds % 3600) / 60),
                seconds: Math.floor(remainingSeconds % 60),
            };
        });

        setRemainingTimes(updatedRemainingTimes);

        updatedRemainingTimes?.forEach((remainingTime: any, index: number) => {
            const lead = leads?.[index];
            if (remainingTime && remainingTime.hours <= 0 && remainingTime.minutes <= 0 && remainingTime.seconds <= 1) {
                console.log("timwwww")
                dispatch(fetchLeadCount());
                dispatch(fetchScheduleLeadCount());

            }
        });
    };

    useEffect(() => {
        updateRemainingTimes();
    }, [leads]);

    // Store initial timestamp in localStorage
    useEffect(() => {
        localStorage.setItem('pageLoadTimestamp', new Date().toISOString());
    }, []);

    return (
        <div className="split-panel">
            <div className="panel" style={{ width: `${leftPanelWidth}%` }}>
                <div className="panel-content" style={{ overflowY: 'auto' }}>
                    <div className="table-container">

                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Call</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <>
                                        <Spinner className="m-2" color={'info'}>
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </>
                                ) : (
                                    <>

                                        <tr>
                                            <td style={{ textTransform: "capitalize", cursor: "pointer" }}>
                                                {/* - {convertToIST(lead.created_at)} */}
                                                <a style={{ color: "blue" }}>{perLead?.name}</a>
                                            </td>

                                            <td>{perLead?.category}</td>
                                            {/* <td>{lead.phone}</td> */}

                                            <td>
                                                <button className="call-button" onClick={() => handleCall(perLead?.phone)} data-tel={perLead?.phone}>
                                                    Call
                                                </button>
                                            </td>
                                        </tr>
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
                                    <Table striped bordered hover responsive>
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
                                        </tbody>
                                    </Table>
                                </Col>

                                <Col>
                                    <Table striped bordered hover>
                                        <tbody>
                                            <tr>
                                                <td><strong>Tag:</strong></td>
                                                <td>{perLead?.tags}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Call Time:</strong></td>
                                                <td>{convertToIST(perLead?.created_at)}</td>
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
                                            {tagsFromAPI.map((tag) => (
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
                                                value={hoursValue}
                                                onChange={handleTimeChange}
                                            >
                                                {generateOptions(0, 23)}
                                            </Form.Select>
                                            <Form.Select
                                                style={{ marginRight: '5px' }}
                                                id="minutes"
                                                name="minutes"
                                                value={minutesValue}
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
