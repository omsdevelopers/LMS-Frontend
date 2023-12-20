import React from 'react';
import { Card, Col, Dropdown, Row, Button } from 'react-bootstrap';
import FeatherIcons from 'feather-icons-react';
import { Link } from 'react-router-dom';

interface TaskDetailsProps {
    newTask: (status: string, queue: string) => void;
}

const TaskDetails = ({ newTask }: TaskDetailsProps) => {
    
    return (
        <Row>
            <Col xs={12}>
                <Card>
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col sm={'auto'}>
                                <label className="fw-bold d-inline-flex me-2">
                                    <FeatherIcons icon="hard-drive" className="icon-dual icon-xs me-2" />
                                    Project :
                                </label>

                                <Dropdown className="d-inline-flex">
                                    <Dropdown.Toggle as="a" href="#" className="cursor-pointer fw-bold">
                                        Orange Mega Softwares
                                    </Dropdown.Toggle>
                                </Dropdown>
                            </Col>
                            <Col className="text-sm-end mt-sm-0 mt-2">
                                <Link to={'/apps/split-pane'}>
                                    <Button>
                                        <i className="uil-eye me-1"></i>Leads
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default TaskDetails;
