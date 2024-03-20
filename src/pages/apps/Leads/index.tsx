import React, { useEffect, useState } from 'react';
import '@fullcalendar/react';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// components
import PageTitle from '../../../components/PageTitle';

// images
import calendarImg from '../../../assets/images/cal.png';
import Table from '../../../components/Table';

import { records as datas, expandableRecords } from '../../tables/data';
import { leadGeneration } from '../../../helpers/api/api';
import { tableList } from '../../../helpers/api/api';
import { useDispatch } from 'react-redux';
import { fetchLeadCount, fetchEveryLeads, fetchEveryLeadCount } from '../../../redux/actions';

const columns = [
    {
        Header: 'ID',
        accessor: 'id',
        sort: true,
    },
    {
        Header: 'Name',
        accessor: 'name',
        sort: true,
    },
    {
        Header: 'Phone Number',
        accessor: 'phone',
        sort: false,
    },
    {
        Header: 'Lead Age',
        accessor: 'age',
        sort: true,
    },
    {
        Header: 'Category',
        accessor: 'category',
        sort: false,
    },

];




const IntroCard = () => {
    const [show, setShow] = useState<boolean>(false);
    const [message, setMessage] = useState<string>();
    const [error, setError] = useState<string>();
    const [data, setData] = useState();


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const [formData, setFormData] = useState({
        comment: '',
        name: '',
        email: '',
        phone: '',
        platform: 'FB',
        address: '',
        websiteDetails: '',
        projectDetails: '',
        interestedServices: '',
        servicesTaken: '',
        group: '',
        tags: '',
        category: 'New Lead'
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const dispatch = useDispatch()

    const handleSubmit = async () => {
        try {
            const data = await leadGeneration(formData);
            setMessage(data.message || 'Submission successful');
            setFormData({
                comment: '',
                name: '',
                email: '',
                phone: '',
                platform: 'FB',
                address: '',
                websiteDetails: '',
                projectDetails: '',
                interestedServices: '',
                servicesTaken: '',
                group: '',
                tags: '',
                category: 'New Lead'
            });
            dispatch(fetchLeadCount());
            dispatch(fetchEveryLeadCount());

            window.location.reload();

        } catch (error: any) {
            console.log(error)
            if (error) {
                setMessage(error)
            }
        }
    }


    return (
        <Row className="align-items-center">
            <Col xl={2} lg={3} xs={6}>
                <img src={calendarImg} className="me-4 align-self-center img-fluid" alt="" />
            </Col>
            <Col xl={10} lg={9}>
                <div className="mt-4 mt-lg-0">
                    <h5 className="mt-0 mb-1 fw-bold">Welcome to LMS</h5>
                    <p className="text-muted mb-2">
                        The calendar shows the events synced from all your linked calendars. Click on event to see or
                        edit the details. You can create new event by clicking on "Create New event" button or any cell
                        available in calendar below.
                    </p>
                    {/* add events */}
                    <Button variant="primary" className="mt-2 me-1" id="btn-new-event" onClick={handleShow}>
                        <i className="uil-plus-circle"></i> Create New Leads
                    </Button>
                </div>

                <Modal show={show} onHide={handleClose} size='xl'>
                    <Modal.Header onHide={handleClose} closeButton>
                        <Modal.Title as="h5">Create Lead</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="form-horizontal">
                            <Row>
                                <Col md={12}>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2} htmlFor="simpleinput">
                                            Comment
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Control onChange={handleInputChange} type="text" id="simpleinput" value={formData.comment}
                                                placeholder='Enter Comment' name="comment"
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2} htmlFor="simpleinput">
                                            Name
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Control name="name" value={formData.name} onChange={handleInputChange} type="text" id="simpleinput" placeholder='Enter Lead Name' />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2} htmlFor="example-email">
                                            Email
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Control
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                type="email"
                                                id="example-email"
                                                name="email"
                                                placeholder="Email"
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2} htmlFor="example-email">
                                            Phone
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Control
                                                type="text"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                id="example-email"
                                                name="phone"
                                                placeholder="Phone"
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2}>
                                            Platform
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Select name="platform"
                                                value={formData.platform} onChange={handleInputChange}>
                                                <option>FB</option>
                                                <option>Instagram</option>
                                                <option>Linkdin</option>
                                                <option>Google</option>
                                                <option>Other</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2} htmlFor="example-textarea">
                                            Address
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Control as="textarea" value={formData.address}
                                                onChange={handleInputChange} rows={5} id="example-textarea"
                                                name="address"
                                                placeholder='Address' />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2} htmlFor="simpleinput">
                                            Website Details
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Control value={formData.websiteDetails}
                                                onChange={handleInputChange} type="text" id="simpleinput"
                                                name="websiteDetails" placeholder='Enter Website Details' />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2} htmlFor="simpleinput">
                                            Project Details Description                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Control name="projectDetails" value={formData.projectDetails}
                                                onChange={handleInputChange} type="text" id="simpleinput" placeholder='Enter Project Details' />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2} htmlFor="simpleinput">
                                            Interested Services List
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Control value={formData.interestedServices}
                                                onChange={handleInputChange} type="text" id="simpleinput" placeholder='Enter Interested Services' name="interestedServices" />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2} htmlFor="simpleinput">
                                            Services taken List
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Control value={formData.servicesTaken}
                                                onChange={handleInputChange} type="text" id="simpleinput" placeholder='Enter Services taken' name="servicesTaken" />
                                        </Col>
                                    </Form.Group>

                                </Col>
                                <Col md={12}>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2} htmlFor="simpleinput">
                                            Group
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Control value={formData.group}
                                                onChange={handleInputChange} type="text" id="simpleinput" placeholder='Enter Group' name="group" />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2} htmlFor="simpleinput">
                                            Tags
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Control value={formData.tags}
                                                onChange={handleInputChange} type="text" id="simpleinput" placeholder='Enter Tags' name="tags" />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column lg={2}>
                                            Category
                                        </Form.Label>
                                        <Col lg={10}>
                                            <Form.Select value={formData.category}
                                                name="category"
                                                onChange={handleInputChange}>
                                                <option>New Lead</option>
                                                <option>Following</option>
                                                <option>Ready Lead</option>
                                                <option>Converted</option>
                                                <option>Not Serious</option>
                                                <option>Silent</option>
                                                <option>Unwanted</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>

                        <div>
                            {message && <span style={{ color: 'green' }}>{message}</span>}
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={handleClose}>
                            Close
                        </Button>{' '}
                        <Button variant="primary" onClick={handleSubmit}>
                            Save changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Col>
        </Row>
    );
};

const CalendarApp = () => {

    const [data, setData] = useState<any>();

    const leadData = async () => {
        try {
            const data = await tableList()
            setData(data)
            // console.log("list", data)

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        leadData()
    }, [])

    const sizePerPageList = [
        {
            text: '5',
            value: 5,
        },
        {
            text: '10',
            value: 10,
        },
        {
            text: '25',
            value: 25,
        },
        {
            text: 'All',
            value: data?.length,
        },
    ];
    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Apps', path: '/apps/add-leads' },
                    { label: 'Add Leads', path: '/apps/add-leads', active: true },
                ]}
                title={'Add Leads'}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <IntroCard />



                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body>
                            <h4 className="header-title">Leads</h4>

                            <Table
                                columns={columns}
                                data={data ? data: []}
                                pageSize={5}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


        </>
    );
};

export default CalendarApp;
