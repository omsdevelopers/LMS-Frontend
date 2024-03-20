import React, { useEffect, useState } from 'react';
import { getActivity } from '../../../../helpers/api/api';
import { Col, Row, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';

function Index() {
    const [loading, setLoading] = useState(false);
    const [activity, setActivity] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        // Get current date in the format dd-MM-yyyy
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year}`;

        // Pass the current date to the API on initial load
        getActivity(formattedDate)
            .then(data => {
                setActivity(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching activity:', error);
                setLoading(false);
            });
    }, []);

    const listByDate = async () => {
        try {
            setLoading(true);

            const parsedDate = new Date(selectedDate);

            // Check if the parsed date is valid
            if (isNaN(parsedDate.getTime())) {
                throw new Error('Invalid date');
            }

            // Format the parsed date
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            const formattedDate = `${day}-${month}-${year}`;

            // Fetch activity data for the selected date
            const data = await getActivity(formattedDate);

            setActivity(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching activity:', error);
            setLoading(false);
        }
    };

    const handleDateChange = (date: any) => {
        setSelectedDate(date ? date : '');
    };

    return (
        <>
            <Row style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Col >
                    <div>
                        <strong>Date:</strong>
                        <div>
                            <DatePicker
                                selected={selectedDate ? new Date(selectedDate) : null}
                                onChange={handleDateChange}
                                dateFormat="dd-MM-yyyy"
                                isClearable
                                className="form-control"
                            />
                        </div>
                    </div>
                </Col>
                <Col style={{marginTop:"18px"}}>
                    <Button onClick={listByDate}>Apply Filter</Button>
                </Col>
            </Row>



            <div className="">
                {loading ? (
                    <p>Loading...</p>
                ) : activity.length === 0 ? (
                    <p style={{ textAlign: "center", marginTop: "50px" }}>No activity found</p>
                ) : (
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Lead Name</th>
                                <th>Activity</th>
                                <th>User</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activity.map((data: any, index) => (
                                <tr key={index}>
                                    <td><Link to={`/apps/activity-leads/${data.lead.id}`}>{data.lead.name}</Link></td>
                                    <td style={{color:"red"}}>{data.activity_type}</td>
                                    <td>{data.user.name}</td>
                                    <td>{new Date(data.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default Index;
