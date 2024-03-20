import React, { useMemo, useState } from 'react'
import PageTitle from '../../../../components/PageTitle'
import { Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { createGroup, getGroups, getTags, groupDelete } from '../../../../helpers/api/api';
import toast, { Toaster } from 'react-hot-toast';
import "../GroupedLeads/style.css"
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';


interface Folder {
    id: number;
    title: string;
    lead_count: number;
}


function GroupLeads() {
    const [show, setShow] = useState<boolean>(false);
    const [selectedFilterCategory, setSelectedFilterCategory] = useState<any[]>([]);
    const [selectedFilerTags, setSelectedFilterTags] = useState<any[]>([]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [formData, setFormData] = useState({
        title: '',
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

    //groups

    const [groups, setGroups] = useState<Folder[]>([]);


    const AllGrups = async () => {

        try {
            const data = await getGroups();
            setGroups(data)
        } catch (error) {
            console.error(error);
            toast.error('Failed to load group');
        }
    }


    useMemo(() => {
        AllGrups();
    }, []);

    const handleFilterTags = async (tag: string) => {
        const isTagSelected = selectedFilerTags.includes(tag);

        const updatedTags = isTagSelected
            ? selectedFilerTags.filter((selectedTag) => selectedTag !== tag)
            : [...selectedFilerTags, tag];

        setSelectedFilterTags(updatedTags);
    };



    const handleSubmit = async () => {
        try {
            const data = await createGroup(formData.title, selectedFilterCategory, selectedFilerTags);

            toast.success(data)

            setFormData({ ...formData, title: "" });
            setSelectedFilterCategory([])
            setSelectedFilterTags([])
            setShow(false)
            AllGrups()

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
        if (selectedFolderIndex !== null && groups[selectedFolderIndex]) {
            const folderToDelete = groups[selectedFolderIndex];
            console.log('Delete action for folder:', folderToDelete.id);

            try {
                // Display a toast for confirmation
                const confirmation = await toast.promise(
                    groupDelete(folderToDelete.id),
                    {
                        loading: 'Deleting...',
                        success: `Folder "${folderToDelete.title}" deleted successfully`,
                        error: 'Failed to delete folder',
                    }
                );

                if (confirmation === 'Group deleted successfully') {
                    // Remove the folder from the state
                    setGroups((prevGroups) => prevGroups.filter((folder) => folder.id !== folderToDelete.id));
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
                    { label: 'Apps', path: '/apps/group-leads' },
                    { label: 'Group Leads', path: '/apps/group-leads', active: true },
                ]}
                title={'Group Leads'}
            />

            <Row onClick={handleClickOutside}>
                <Toaster />

                <Col>
                    <Card>
                        <Card.Body>
                            <Button variant="primary" className="mt-2 me-1" id="btn-new-event" onClick={handleShow}>
                                <i className="uil-plus-circle"></i> Group Leads
                            </Button>

                            <Modal show={show} onHide={handleClose} size='lg'>
                                <Modal.Header onHide={handleClose} closeButton>
                                    <Modal.Title as="h5">Create Lead</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="form-horizontal">
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group as={Row} className="mb-3">
                                                    <Col lg={12}>
                                                        <Form.Label column htmlFor="simpleinput">
                                                            Title
                                                        </Form.Label>
                                                        <Form.Control onChange={handleInputChange} type="text" id="simpleinput" value={formData.title}
                                                            placeholder='Enter Title' name="title"
                                                        />
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} className="mb-3">
                                                    <Col lg={12}>
                                                        <Form.Label column htmlFor="simpleinput">
                                                            Categories
                                                        </Form.Label>
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
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-3">
                                                    <Col lg={12}>
                                                        <Form.Label column htmlFor="simpleinput">
                                                            Tags
                                                        </Form.Label>
                                                        <div className="btn-group" style={{ display: "flex", flexWrap: "wrap" }}>
                                                            {tagsFromAPI.map((tag: any) => (
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

                    <h4 className="header-title" style={{ margin: "25px" }}>Grouped Leads</h4>

                    <div onClick={handleClickOutside}>

                        <Card.Body style={{ display: 'flex', flexWrap: 'wrap' }}>

                            {groups?.map((folder: Folder, index) => (
                                <Link to={`/apps/grouped-leads/${folder.id}`}>
                                    <div
                                        key={index}
                                        className="folder-card"
                                        style={{ marginRight: '20px', marginBottom: '20px' }}
                                        onContextMenu={(e) => handleRightClick(e, index)}
                                    >
                                        <div className="icon-with-badge-container">
                                            <div className="folder-icon">
                                                <FeatherIcon icon="folder" className="icon-dual icon-lg me-1" />
                                            </div>
                                            <Badge bg="secondary" className="badge-icon">{folder.lead_count}</Badge>
                                        </div>
                                        <div className="folder-title">{folder.title}</div>



                                    </div>
                                </Link>

                            ))}
                        </Card.Body>

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

export default GroupLeads
