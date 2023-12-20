import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// components
import PageTitle from '../../../../components/PageTitle';

import TaskDetails from './TaskDetails';
import TaskItem from './Task';
import AddNewTask from './AddNewTask';

// dummy data
import { tasks, TaskTypes } from './data';

// images
import defaultAvatar from '../../../../assets/images/users/avatar-1.jpg';

interface StateType {
    freshLeads: TaskTypes[];
    following: TaskTypes[];
    readyLead: TaskTypes[];
    converted: TaskTypes[];
}

// kanban
const Kanban = () => {
    const [state, setState] = useState<StateType>({
        freshLeads: tasks.filter((t) => t.status === 'FreshLead'),
        following: tasks.filter((t) => t.status === 'Following'),
        readyLead: tasks.filter((t) => t.status === 'ReadyLead'),
        converted: tasks.filter((t) => t.status === 'Converted'),
    });
    const [totalTasks, setTotalTasks] = useState<number>(tasks.length);
    const [newTaskModal, setNewTaskModal] = useState<boolean>(false);
    const [newTaskDetails, setNewTaskDetails] = useState<any>(null);

    /*
     * Form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            title: yup.string().required(),
            priority: yup.string().required(),
        })
    );

    /*
     * Form methods
     */
    const methods = useForm({ resolver: schemaResolver });
    const {
        handleSubmit,
        register,
        control,
        reset,
        formState: { errors },
    } = methods;

    /**
     * Toggles the new task modal
     */
    const toggleNewTaskModal = () => {
        setNewTaskModal((prevstate) => !prevstate);
    };

    /**
     * Creates new empty task with given status
     * @param status
     * @param queue
     */
    const newTask = (status: string, queue: string) => {
        setNewTaskDetails({
            dueDate: new Date(),
            userAvatar: [defaultAvatar],
            status: status,
            queue: queue,
        });
        setNewTaskModal(true);
    };

    /**
     * When date changes
     * @param {} date
     */
    const handleDateChange = (date: Date) => {
        if (newTaskDetails) {
            setNewTaskDetails({ ...newTaskDetails, dueDate: date });
        }
    };

    // a little function to help us with reordering the result
    const reorder = (list: any[], startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    /**
     * Moves an item from one list to another list.
     */
    const move = (
        source: Iterable<unknown> | ArrayLike<unknown>,
        destination: Iterable<unknown> | ArrayLike<unknown>,
        droppableSource: { index: number; droppableId: string | number },
        droppableDestination: { index: number; droppableId: string | number }
    ) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);
        destClone.splice(droppableDestination.index, 0, removed);
        const result: any = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };

    /**
     * Gets the list
     */
    const getList = (id: string) => {
        const modifiedState: any = { ...state };
        const stateTasks: any = modifiedState[id] && modifiedState[id];
        return stateTasks;
    };

    /**
     * On drag end
     */
    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        console.log("on", result)

        // dropped outside the list
        if (!destination) {
            return;
        }
        if (source.droppableId === destination.droppableId) {
            const items = reorder(getList(source.droppableId), source.index, destination.index);
            let localState: any = { ...state };
            localState[source.droppableId] = items;
            setState(localState);
        } else {
            const result = move(getList(source.droppableId), getList(destination.droppableId), source, destination);
            const localState = { ...state, ...result };
            setState(localState);
        }
    };

    /**
     * Handles the new task form submission
     */
    const handleNewTask = (values: any) => {
        const formData = {
            title: values['title'],
            priority: values['priority'],
        };

        const newTask = {
            ...newTaskDetails,
            ...formData,
            id: totalTasks + 1,
            dueDate: newTaskDetails.dueDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
            totalComments: 18,
            totalSubTasks: 12,
            subTaskCompleted: 2,
        };

        let modifiedState: any = { ...state };
        let tasks = [...getList(newTaskDetails.queue), newTask];
        modifiedState[newTaskDetails.queue] = [...tasks];

        setState(modifiedState);
        setNewTaskModal(false);
        setTotalTasks(totalTasks + 1);
        reset();
    };

    return (
        <React.Fragment>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Today Leads', path: 'apps/today-leads' },
                    { label: 'Today Leads', path: 'apps/today-leads', active: true },
                ]}
                title={'Today Leads'}
            />

            <TaskDetails newTask={newTask} />

            <Row>
                <Col xs={12}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="board">
                            {/* todo */}
                            <Droppable droppableId="freshLeads">
                                {(provided, snapshot) => (
                                    <div className="tasks border" ref={provided.innerRef}>
                                        <h5 className="mt-0 task-header header-title">
                                            Fresh Leads <span className="fs-13">({state.freshLeads.length})</span>
                                        </h5>

                                        {state.freshLeads.length === 0 && (
                                            <p className="text-center text-muted pt-2 mb-0">No Tasks</p>
                                        )}

                                        {state.freshLeads.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id + ''} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                        <TaskItem task={item} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            {/* in progress */}
                            <Droppable droppableId="following">
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} className="tasks border">
                                        <h5 className="mt-0 task-header header-title">
                                            Following <span className="fs-13">({state.following.length})</span>
                                        </h5>
                                        {state.following.length === 0 && (
                                            <p className="text-center text-muted pt-2 mb-0">No Tasks</p>
                                        )}

                                        {state.following.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id + ''} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                        <TaskItem task={item} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            {/* review */}
                            <Droppable droppableId="readyLead">
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} className="tasks">
                                        <h5 className="mt-0 task-header header-title">
                                            Ready Lead ({state.readyLead.length})
                                        </h5>
                                        {state.readyLead.length === 0 && (
                                            <p className="text-center text-muted pt-2 mb-0">No Tasks</p>
                                        )}

                                        {state.readyLead.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id + ''} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                        <TaskItem task={item} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            {/* done */}
                            <Droppable droppableId="converted">
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} className="tasks">
                                        {/* <OverlayTrigger
                                            key="bottom"
                                            placement="bottom"
                                            overlay={<Tooltip>Add New Done Task</Tooltip>}>
                                            <button
                                                className="btn btn-link p-0 text-secondary float-end shadow-none px-0 py-2"
                                                id="addNewDone"
                                                onClick={() => newTask('Done', 'doneTasks')}>
                                                <i className="uil-plus"></i>
                                            </button>
                                        </OverlayTrigger> */}
                                        <h5 className="mt-0 task-header header-title">
                                            Converted ({state.converted.length})
                                        </h5>
                                        {state.converted.length === 0 && (
                                            <p className="text-center text-muted pt-2 mb-0">No Tasks</p>
                                        )}

                                        {state.converted.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id + ''} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                        <TaskItem task={item} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </DragDropContext>
                </Col>
            </Row>

            {/* add new task modal */}
            {newTaskModal && (
                <AddNewTask
                    newTaskModal={newTaskModal}
                    toggleNewTaskModal={toggleNewTaskModal}
                    handleNewTask={handleNewTask}
                    handleSubmit={handleSubmit}
                    newTaskDetails={newTaskDetails}
                    handleDateChange={handleDateChange}
                    register={register}
                    errors={errors}
                    control={control}
                />
            )}
        </React.Fragment>
    );
};

export default Kanban;
