import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import interactionPlugin from "@fullcalendar/interaction"; // for selectable
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Adjust the path as necessary
import EventCreationModal from './EventCreationModal'; // Adjust the path as necessary

const Agenda = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [patients, setPatients] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [currentSelectInfo, setCurrentSelectInfo] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
                }

            //fetch events
            try {
                const response = await fetch(`${apiUrl}/api/all_events/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                if (!response.ok) throw new Error('Error fetching events');
                const data = await response.json();
                const parsedEvents = data.map(event => {
                    const start = new Date(event.start);
                    const end = new Date(event.end);

                    // Determine if the event is an all-day event
                    const isAllDayEvent = start.getHours() === 0 && start.getMinutes() === 0 && 
                                        end.getHours() === 0 && end.getMinutes() === 0 &&
                                        (end.getDate() - start.getDate() === 1 || end.getTime() - start.getTime() === 24 * 60 * 60 * 1000);
                    
                    return {
                        ...event,
                        start,
                        end,
                        allDay: isAllDayEvent
                    };
                });

    
                setEvents(parsedEvents);
                console.log("useeffect fetching events: ", parsedEvents)

            } catch (error) {
                console.error('Error fetching events:', error);
            }
            
            // Now fetch patients
            try {
                const response = await fetch(`${apiUrl}/api/user-patients/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Error fetching patients');
                const patientData = await response.json();
                setPatients(patientData); // Assuming you have a state variable for patients
                
            } catch (error) {
                console.error('Error fetching patients:', error);
            }    
        };
       
        fetchData();
        
    }, [navigate, apiUrl]);

    const handleDateSelect = async (selectInfo) => {
        
        setCurrentSelectInfo(selectInfo);
        setIsModalOpen(true); // Open the moda
        
    };

    const handleModalSubmit = async (newEvent) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        //console.log("Submitting new event:", newEvent);  // Log the new event details

        try {
            const response = await fetch(`${apiUrl}/api/add_event/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEvent)
            });
    
            if (!response.ok) throw new Error('Event creation failed');
    
            // Extract the ID from the response
            const responseData = await response.json();
            const createdEventId = responseData.id;

            //console.log("Created event ID:", createdEventId);  // Log the ID of the created event

            // Update the events state with the new event, including the ID
            const newEventWithId = { ...newEvent, id: createdEventId };
            //console.log("New event with ID:", newEventWithId);  // Log the new event with the ID

            setEvents(prevEvents => {
                const updatedEvents = [...prevEvents, newEventWithId];
                //console.log("Updated events array:", updatedEvents);  // Log the updated events array
                return updatedEvents;
            });

        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleEventClick = async (clickInfo) => {
        setEventToDelete(clickInfo.event);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
    };

    
    //aqui falta tudo - atualmente é igual ao deleteall
    const handleDeleteSingle = async () => {
        const token = localStorage.getItem('token');
        if (!eventToDelete) {
            console.error('No event selected for deletion');
            return;
        }
    
        try {
            const response = await fetch(`${apiUrl}/api/remove/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: eventToDelete.id })
            });
    
            if (!response.ok) {
                throw new Error('Event deletion failed');
            }
    
            // Remove the event from the local state
            setEvents(prevEvents => {
                const updatedEvents = prevEvents.filter(event => {
                    //console.log("Comparing:", event.id, typeof event.id, "with", clickInfo.event.id);
                    return event.id.toString() !== eventToDelete.id;
                });
                //console.log("Updated events after deletion:", updatedEvents);
                return updatedEvents;
            });
            
            // Close the modal
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting event:', error);
            // You might want to display an error message to the user here
        }
    
        // Reset the eventToDelete state
        setEventToDelete(null);
    };

    const handleDeleteFuture = async () => {
        // Logic to modify the rrule to stop recurrence from this event onward
        // ...
    };

    const handleDeleteAll = async () => {
        
        const token = localStorage.getItem('token');
        if (!eventToDelete) {
            console.error('No event selected for deletion');
            return;
        }
    
        try {
            const response = await fetch(`${apiUrl}/api/remove/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: eventToDelete.id })
            });
    
            if (!response.ok) {
                throw new Error('Event deletion failed');
            }
    
            // Remove the event from the local state
            setEvents(prevEvents => {
                const updatedEvents = prevEvents.filter(event => {
                    //console.log("Comparing:", event.id, typeof event.id, "with", clickInfo.event.id);
                    return event.id.toString() !== eventToDelete.id;
                });
                //console.log("Updated events after deletion:", updatedEvents);
                return updatedEvents;
            });
            
            // Close the modal
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting event:', error);
            // You might want to display an error message to the user here
        }
    
        // Reset the eventToDelete state
        setEventToDelete(null);
    };

    const handleCancelByPatient = async () => {
        // Logic to mark a specific occurrence as cancelled using EventCancellation model
        // ...
    };

    
    const handleEventDrop = async (info) => {
        const token = localStorage.getItem('token');
        const eventId = info.event.id;
        const newStart = info.event.start;
        const newEnd = info.event.end || newStart; // If 'end' is null, use 'start' time
    
        try {
            const response = await fetch(`${apiUrl}/api/update/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: eventId,
                    start: newStart.toISOString(),
                    end: newEnd.toISOString()
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to update event time');
            } else {
                setEvents(prevEvents => {
                    return prevEvents.map(event => {
                        if (event.id.toString() === eventId) {
                            // Update the start and end time of the moved event
                            return {...event, start: newStart.toISOString(), end: newEnd.toISOString()};
                        }
                        return event;
                    });
                });
            }
        } catch (error) {
            console.error('Error updating event:', error);
            info.revert(); // Revert the event drag on catch
        }
    };

    return (
        <div className="agenda">
            <h2>Agenda</h2>
      

            <FullCalendar
                editable
                plugins={[rrulePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                locale="pt-br"
                events={events}
                selectable={true}
                weekends={true}
                timeZone='local'
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                height="700px"
                buttonText={{
                    today: "Hoje",
                    month: "Mês",
                    week: "Semana",
                    day: "Dia",
                    list: "Lista",
                  }}
            />

            <EventCreationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleModalSubmit} 
                patients={patients} 
                selectInfo={currentSelectInfo} 
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModal}
                eventName={eventToDelete?.title}
                hasRecurrence={eventToDelete?.rrule && eventToDelete.rrule.trim() !== ''}
                onDeleteSingle={handleDeleteSingle}
                onDeleteFuture={handleDeleteFuture}
                onDeleteAll={handleDeleteAll}
                onCancelByPatient={handleCancelByPatient}
            />
                
        </div>
    );
};

export default Agenda;

