import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { fetchLeadCount, fetchLeads } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { leadEdit, leadGeneration } from '../helpers/api/api';

function EditLeadModal(props: { ModalShow: boolean, onModalClose: any, leadData: Record<string, any> }) {
    const [show, setShow] = useState<boolean>(false);
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
    const [message, setMessage] = useState<string>();

    useEffect(() => {
        setShow(props.ModalShow);
    }, [props.ModalShow]);

    useEffect(() => {
        // Update formData when leadData prop changes
        if (props.leadData) {
          setFormData({
            comment: props.leadData.comment || '',
            name: props.leadData.name || '',
            email: props.leadData.email || '',
            phone: props.leadData.phone || '',
            platform: props.leadData.platform || 'FB',
            address: props.leadData.address || '',
            websiteDetails: props.leadData.websiteDetails || '',
            projectDetails: props.leadData.projectDetails || '',
            interestedServices: props.leadData.interestedServices || '',
            servicesTaken: props.leadData.servicesTaken || '',
            group: props.leadData.group || '',
            tags: props.leadData.tags || '',
            category: props.leadData.category || 'New Lead'
          });
        }
      }, [props.leadData]);

    const handleClose = () => {
        setShow(false);
        props.onModalClose();
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const dispatch = useDispatch()

    const handleEdit = async () => {
        try {
            const data = await leadEdit(props.leadData.id, formData);
            setMessage(data.message || 'Submission successful');

            dispatch(fetchLeadCount());
            dispatch(fetchLeads());
            props.onModalClose();

        } catch (error: any) {
            console.log(error)
            if (error) {
                setMessage(error)
            }
        }
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose} size='xl'>
                <Modal.Header onHide={handleClose} closeButton>
                    <Modal.Title as="h5">Edit Lead</Modal.Title>
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

                                {/* <Form.Group as={Row} className="mb-3">
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
                                </Form.Group> */}
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
                    <Button variant="primary" onClick={handleEdit}>
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EditLeadModal
