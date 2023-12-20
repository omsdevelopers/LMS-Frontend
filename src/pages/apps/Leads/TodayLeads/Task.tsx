import React, { useState } from 'react';
import { Card, Dropdown, Offcanvas, Button, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import FeatherIcon from 'feather-icons-react';
import { ReactTags } from 'react-tag-autocomplete'

// dummy data
import { TaskTypes } from './data';

interface TaskItemProps {
    task: TaskTypes;
}

// task item
const TaskItem = (props: TaskItemProps) => {
    const task = props.task || {};
    const [show, setShow] = useState<boolean>(false);


    const toggle = () => {
        setShow((prevState) => !prevState);
    };

    const [tags, setTags] = useState([
        { id: 'new_lead', text: 'New Lead' },
        // Add other default tags as needed
    ]);

    const handleTagDelete = (i: any) => {
        const newTags = tags.slice();
        newTags.splice(i, 1);
        setTags(newTags);
    };

    const handleTagAddition = (tag: any) => {
        setTags([...tags, tag]);
    };


    return (
        <div className="task-list-items">
            <Card className="border mb-0">
                <Card.Body className="p-3">
                    <Dropdown className="float-end" align="end" >
                        {/* <Button onClick={toggle}> */}
                        <i className="uil-eye uil-ellipsis-v fs-14" onClick={toggle}></i>
                        {/* </Button> */}
                        <Dropdown.Toggle as="a" className="cursor-pointer text-muted arrow-none">
                            <i className="uil uil-ellipsis-v fs-14"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <i className="uil uil-edit-alt me-2"></i>Edit
                            </Dropdown.Item>
                            <Dropdown.Item className="text-warning">
                                <i className="uil uil-exit me-2"></i>Leave
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="text-danger">
                                <i className="uil uil-trash me-2"></i>Delete
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <h6 className="mt-0 mb-2 fs-15">
                        <Link to="#" className="text-body">
                            {task.Name}
                        </Link>
                    </h6>

                    <span
                        className={classNames('badge', {
                            'badge-soft-danger': task.priority === 'High',
                            'badge-soft-warning': task.priority === 'Medium',
                            'badge-soft-success': task.priority === 'Low',
                        })}>
                        {task.priority}
                    </span>

                    <p className="mb-0 mt-4">
                        {/* <img src={task.userAvatar} alt="" className="avatar-xs rounded-circle me-2" /> */}

                        <span className="text-nowrap align-middle fs-13 me-2">
                            <i className="uil uil-comments-alt text-muted me-1"></i>
                            {task.CallTime.Date} - {task.CallTime.Time}
                        </span>

                        {/* <span className="text-nowrap align-middle fs-13">
                            <i className="uil uil-check-square me-1 text-muted"></i>
                            {task.subTaskCompleted}/{task.totalSubTasks}
                        </span> */}
                        <small className="float-end text-muted">{task.Category}</small>
                    </p>
                </Card.Body>
            </Card>

            <Offcanvas show={show} onHide={toggle} placement="end" style={{ width: '40%' }}>
                <Offcanvas.Header closeButton>
                    <h5 id="offcanvasTopLabel">Client Details</h5>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Row>
                        <Col>
                            <div>
                                <strong>Name:</strong> Office
                            </div>
                            <div>
                                <strong>Phone:</strong> +911111111112
                            </div>
                            <div>
                                <strong>Email:</strong> {/* Add email here */}
                            </div>
                            <div>
                                <strong>Call Time:</strong> 07/Dec/2023 08:32 PM
                            </div>
                            <div>
                                <strong>Address:</strong> {/* Add address here */}
                            </div>
                            <div>
                                <strong>Comment:</strong> {/* Add comment here */}
                            </div>
                            <div>
                                <strong>Tag:</strong> {/* Add tag here */}
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <strong>Platform:</strong> {/* Add platform here */}
                            </div>
                            <div>
                                <strong>Website Details:</strong> {/* Add website details here */}
                            </div>
                            <div>
                                <strong>Project Details:</strong> {/* Add project details here */}
                            </div>
                            <div>
                                <strong>Interested Services:</strong> {/* Add interested services here */}
                            </div>
                            <div>
                                <strong>Services Taken:</strong> {/* Add services taken here */}
                            </div>
                            <div>
                                <strong>Lead Group:</strong> {/* Add lead group here */}
                            </div>


                        </Col>

                    </Row>

                    <Row style={{ marginTop: "10px" }}>
                        <Col>
                            <div>
                                <strong>Category:</strong>
                                <Form.Select>
                                    <option value="15">15</option>
                                    <option value="30">30</option>
                                    {/* Add other minute options as needed */}
                                </Form.Select>
                            </div>
                        </Col>

                        <Col>
                            <div>
                                <strong>Minutes:</strong>
                                <Form.Select>
                                    <option value="15">15</option>
                                    <option value="30">30</option>
                                    {/* Add other minute options as needed */}
                                </Form.Select>
                            </div>
                        </Col>

                        <Col>
                            <div>
                                <strong>Days:</strong>
                                <Form.Select>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    {/* Add other day options as needed */}
                                </Form.Select>
                            </div>
                        </Col>

                        <Col>
                            <div>
                                <strong>Hours:</strong>
                                <Form.Select>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    {/* Add other hour options as needed */}
                                </Form.Select>
                            </div>
                        </Col>

                        <Dropdown className="mt-3">
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="cursor-pointer">
                                Dropdown button <i className="uil uil-angle-down"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#">Action</Dropdown.Item>
                                <Dropdown.Item href="#">Another action</Dropdown.Item>
                                <Dropdown.Item href="#">Something else here</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Row>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default TaskItem;
