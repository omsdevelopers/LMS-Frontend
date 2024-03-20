import React, { useMemo, useState } from 'react'
import PageTitle from '../../../../components/PageTitle'
import { Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { createGroup, getGroups, getTags, groupDelete, saveTags, tagDelete } from '../../../../helpers/api/api';
import toast, { Toaster } from 'react-hot-toast';
import "../GroupedLeads/style.css"
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';


interface Folder {
    id: number;
    title: string;
    lead_count: number;
}


function Tags() {
    const [show, setShow] = useState<boolean>(false);
    const [selectedFilterCategory, setSelectedFilterCategory] = useState<any[]>([]);
    const [selectedFilerTags, setSelectedFilterTags] = useState<any[]>([]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [formData, setFormData] = useState({
        tags: '',
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    //Category

    const categories = ['New Lead', 'Following', 'Important', 'Ready Lead', 'Converted', 'Not Serious', 'Silent', 'Unwanted', 'For Job', 'Not Sale'];

    const handleFilterCategory = async (category: string) => {
        const isCategorySelected = selectedFilterCategory.includes(category);

        const updatedCategories = isCategorySelected
            ? selectedFilterCategory.filter((selectedCategory) => selectedCategory !== category)
            : [...selectedFilterCategory, category];

        setSelectedFilterCategory(updatedCategories);
    };


    //Tags

    const [tagsFromAPI, setTagsFromAPI] = useState([]);

    const AllTags = async () => {
        try {
            const tags = await getTags();
            setTagsFromAPI(tags.tags)
        } catch (error) {
            console.error(error);
            toast.error('Failed to load tag');
        }
    }

    useMemo(() => {
        AllTags();
    }, []);

    //groups

    const [groups, setGroups] = useState<Folder[]>([]);


    const handleSubmit = async () => {
        try {
            const data = await saveTags(formData.tags);

            toast.success(data)

            setFormData({ ...formData, tags: "" });
            AllTags();
            setShow(false)

        } catch (error: any) {
            console.log(error)
            toast.error(error)
        }
    }


    //events

    const [contextMenuPosition, setContextMenuPosition] = useState<{ left: number; top: number } | null>(null);
    const [selectedFolderIndex, setSelectedFolderIndex] = useState<number | null>(null);


    const handleRightClick = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
        event.preventDefault();
        setContextMenuPosition({
            left: event.clientX,
            top: event.clientY,
        });
        setSelectedFolderIndex(index); // Store the index of the clicked folder
    };

    const handleClickOutside = () => {
        setContextMenuPosition(null);
        setSelectedFolderIndex(null);
    };

    const handleRename = () => {
        console.log('Rename action');
        setContextMenuPosition(null);
    };


    const handleDelete = async () => {
        if (selectedFolderIndex ) {

            console.log('Delete action for folder:', selectedFolderIndex);

            try {
                // Display a toast for confirmation
                  const data = await tagDelete(selectedFolderIndex);
                

                if (data === 'Tag deleted successfully') {
                    toast.success(data);
                    AllTags();
                }
            } catch (error) {
                toast.error('Failed to delete folder');
            }
        }
        setContextMenuPosition(null);
        setSelectedFolderIndex(null);
    };

    return (
        <div onClick={handleClickOutside}>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Apps', path: '/apps/create-tags' },
                    { label: 'Create Tags', path: '/apps/create-tags', active: true },
                ]}
                title={'Create Tags'}
            />

            <Row onClick={handleClickOutside}>
                <Toaster />

                <Col>
                    <Card>
                        <Card.Body>
                            <Button variant="primary" className="mt-2 me-1" id="btn-new-event" onClick={handleShow}>
                                <i className="uil-plus-circle"></i> Tags
                            </Button>

                            <Modal show={show} onHide={handleClose} size='lg'>
                                <Modal.Header onHide={handleClose} closeButton>
                                    <Modal.Title as="h5">Create Tags</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="form-horizontal">
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group as={Row} className="mb-3">
                                                    <Col lg={12}>
                                                        <Form.Label column htmlFor="simpleinput">
                                                            Tags
                                                        </Form.Label>
                                                        <Form.Control onChange={handleInputChange} type="text" id="simpleinput" value={formData.tags}
                                                            placeholder='Enter Title' name="tags"
                                                        />
                                                    </Col>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Form>

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

                        </Card.Body>
                    </Card>


                    <div onClick={handleClickOutside}>

                    <h4 className="header-title" >Tags</h4>

                        <div className="btn-group" style={{ display: "flex", flexWrap: "wrap" }}>
                            
                            {tagsFromAPI.map((tag: any, index) => (
                                <button
                                    key={tag}
                                    type="button"
                                    className={`'btn-success' : 'btn-primary'} btn-sm`}
                                    style={{ margin: '5px' }}
                                    onContextMenu={(e:any) => handleRightClick(e, tag.id)}
                                >
                                    {tag.tags}
                                </button>
                            ))}
                        </div>



                        {contextMenuPosition && (
                            <div className="context-menu" style={{ left: contextMenuPosition.left, top: contextMenuPosition.top }}>
                                <ul>
                                    {/* <li onClick={handleRename}>
                                        <FeatherIcon icon="edit" className="icon-dual icon-xs me-1" />
                                        Rename
                                    </li> */}
                                    <li onClick={handleDelete}>
                                        <FeatherIcon icon="trash-2" className="icon-dual icon-xs me-1" />
                                        Delete
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Tags
