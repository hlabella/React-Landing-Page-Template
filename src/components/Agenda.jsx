import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction"; // for selectable

function EventCreationModal({ isOpen, onClose, onSubmit, patients, selectInfo }) {
    const [selectedPatient, setSelectedPatient] = useState('');

    // Update selectedPatient when the modal opens
    useEffect(() => {
        if (isOpen && patients.length > 0) {
            setSelectedPatient(patients[0].nome_paciente);
        }
    }, [isOpen, patients]);

    const handleSubmit = () => {
        onSubmit({
            title: selectedPatient,
            start: selectInfo.startStr,
            end: selectInfo.endStr
        });
        onClose();
    };

    return (
        isOpen && (
            <div className="modal">
                <div className="addpatientmodal">
                    <select value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
                        {patients.map(patient => (
                            <option key={patient.id} value={patient.nome_paciente}>
                                {patient.nome_paciente}
                            </option>
                        ))}
                    </select>
                    
                    <button onClick={handleSubmit}>Criar Evento</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        )
    );
}



const Agenda = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [patients, setPatients] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                const parsedEvents = data.map(event => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end)
                }));
    
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
        console.log("Submitting new event:", newEvent);  // Log the new event details

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

            console.log("Created event ID:", createdEventId);  // Log the ID of the created event

            // Update the events state with the new event, including the ID
            const newEventWithId = { ...newEvent, id: createdEventId };
            console.log("New event with ID:", newEventWithId);  // Log the new event with the ID

            setEvents(prevEvents => {
                const updatedEvents = [...prevEvents, newEventWithId];
                console.log("Updated events array:", updatedEvents);  // Log the updated events array
                return updatedEvents;
            });

        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleEventClick = async (clickInfo) => {
        console.log("Attempting to delete event:", clickInfo.event.title, "with ID:", clickInfo.event.id);
    
        const token = localStorage.getItem('token');
        
        // Confirm before deleting the event
        if (window.confirm(`Quer deletar o evento: '${clickInfo.event.title}'?`)) {
            // Call API to delete the event
            try {
                const response = await fetch(`${apiUrl}/api/remove/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: clickInfo.event.id })
                });
    
                if (!response.ok) throw new Error('Event deletion failed');
    
                // Log response status
                console.log("Event deletion response:", response.status);
    
                // Remove event from calendar
                clickInfo.event.remove(); 
    
                // Update the local state to reflect the deletion
                setEvents(prevEvents => {
                    const updatedEvents = prevEvents.filter(event => {
                        console.log("Comparing:", event.id, typeof event.id, "with", clickInfo.event.id);
                        return event.id.toString() !== clickInfo.event.id;
                    });
                    console.log("Updated events after deletion:", updatedEvents);
                    return updatedEvents;
                });
                
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
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
            }
    
            // Optionally, you can fetch and refresh events here if needed
        } catch (error) {
            console.error('Error updating event:', error);
            // Optionally, revert the event drag if the update fails
            info.revert();
        }
    };

    return (
        <div className="agenda">
            <h2>Agenda</h2>
      

            <FullCalendar
                editable
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                selectable={true}
                weekends={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
            />

            <EventCreationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleModalSubmit} 
                patients={patients} 
                selectInfo={currentSelectInfo} 
            />
            
        </div>
    );
};

export default Agenda;

