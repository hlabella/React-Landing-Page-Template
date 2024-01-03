import React, { useState, useEffect } from 'react';
import { RRule } from 'rrule'

const EventCreationModal = ({ isOpen, onClose, onSubmit, patients, selectInfo }) => {
    const [selectedPatient, setSelectedPatient] = useState('');
    const [recurrence, setRecurrence] = useState({
        frequency: 'NONE', // Default to no recurrence
        end: 'NEVER',
        untilDate: '', // For specifying an end date
        count: '', // For specifying a number of occurrences
    });
    const daysOfWeek = {
        MO: 'SEG',
        TU: 'TER',
        WE: 'QUA',
        TH: 'QUI',
        FR: 'SEX',
        SA: 'SAB',
        SU: 'DOM'
    };
    const [selectedDays, setSelectedDays] = useState({
        MO: false,
        TU: false,
        WE: false,
        TH: false,
        FR: false,
        SA: false,
        SU: false,
    });
    
    // Update selectedPatient when the modal opens
    useEffect(() => {
        if (isOpen && patients.length > 0) {
            setSelectedPatient(patients[0].nome_paciente);
        }
    }, [isOpen, patients]);

    const handleSubmit = () => {

        let start, end;
    
        if (selectInfo.allDay) {
            // Parse date as local date at midnight
            const startDate = new Date(selectInfo.startStr + 'T00:00:00');
            const endDate = new Date(selectInfo.endStr + 'T00:00:00');
    
            start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
            end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0);
        } else {
            // Parse normally for events with specific times
            start = new Date(selectInfo.startStr);
            end = new Date(selectInfo.endStr);
        }
    
        onSubmit({
            title: selectedPatient,
            start: start.toISOString(),
            end: end.toISOString(),
            rrule: buildRRuleString() || null,
            allDay: selectInfo.allDay
        });
        onClose();
    };

    const buildRRuleString = () => {
        if (recurrence.frequency === 'NONE') {
            return ''; // No recurrence
        }

        let start, end;
    
        if (selectInfo.allDay) {
            // Parse date as local date at midnight
            const startDate = new Date(selectInfo.startStr + 'T00:00:00');
            const endDate = new Date(selectInfo.endStr + 'T00:00:00');
    
            start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
            end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0);
        } else {
            // Parse normally for events with specific times
            start = new Date(selectInfo.startStr);
            end = new Date(selectInfo.endStr);
        }

        const rruleOptions = {
            freq: RRule[recurrence.frequency],
            dtstart: start,
            interval: 1, // Default interval is 1
        };

        if (recurrence.end === 'UNTIL' && recurrence.untilDate) {
            rruleOptions.until = new Date(recurrence.untilDate);
        } else if (recurrence.end === 'COUNT' && recurrence.count) {
            rruleOptions.count = parseInt(recurrence.count, 10);
        }

        if (recurrence.frequency === 'WEEKLY' && selectedDays) {
            rruleOptions.byweekday = Object.entries(selectedDays)
                .filter(([_, isSelected]) => isSelected)
                .map(([day]) => RRule[day]);
        }

        const rrule = new RRule(rruleOptions);
        console.log(rrule.toString());
        return rrule.toString();
    };

    return (
        isOpen && (
            <div className="modal">
                <div className="addpatientmodal">
                    
                    {/* Patient Selection */}
                    <label>
                        <strong>Paciente:</strong>
                        <select value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
                            {patients.map(patient => (
                                <option key={patient.id} value={patient.nome_paciente}>
                                    {patient.nome_paciente}
                                </option>
                            ))}
                        </select>
                    </label>
    
                    {/* Recurrence Frequency */}
                    <label>
                        <strong>Frequência de Recorrência:</strong>
                        <select value={recurrence.frequency} onChange={e => setRecurrence({...recurrence, frequency: e.target.value})}>
                            <option value="NONE">Não se repete</option>
                            <option value="DAILY">Diário</option>
                            <option value="WEEKLY">Semanal</option>
                            <option value="MONTHLY">Mensal</option>
                            <option value="YEARLY">Anual</option>
                        </select>
                    </label>
    
                    {recurrence.frequency !== 'NONE' && (
                        <>
                            {/* Interval 
                            <label>
                                <strong>Intervalo:</strong>
                                <input
                                    type="number"   
                                    min="1"
                                    value={recurrence.interval}
                                    onChange={e => setRecurrence({...recurrence, interval: e.target.value})}
                                    placeholder="Intervalo entre as recorrências"
                                />
                            </label>
                            */}

                            {/* End Criteria */}
                            <label>
                                <strong>Critério de Término:</strong>
                                <select value={recurrence.end} onChange={e => setRecurrence({...recurrence, end: e.target.value})}>
                                    <option value="NEVER">Nunca</option>
                                    <option value="UNTIL">Até uma data específica</option>
                                    <option value="COUNT">Após um número de ocorrências</option>
                                </select>
                            </label>
    
                            {/* Until Date */}
                            {recurrence.end === 'UNTIL' && (
                                <label>
                                    <strong>Data de Término:</strong>
                                    <input
                                        type="date"
                                        value={recurrence.untilDate}
                                        onChange={e => setRecurrence({...recurrence, untilDate: e.target.value})}
                                    />
                                </label>
                            )}
    
                            {/* Number of Occurrences */}
                            {recurrence.end === 'COUNT' && (
                                <label>
                                    <strong>Número de Ocorrências:</strong>
                                    <input
                                        type="number"
                                        min="1"
                                        value={recurrence.count}
                                        onChange={e => setRecurrence({...recurrence, count: e.target.value})}
                                        placeholder="Número de vezes que o evento ocorrerá"
                                    />
                                </label>
                            )}
                        </>
                    )}
    
                    {recurrence.frequency === 'WEEKLY' && (
                        <div className="day-selection">
                            <strong>Dias da Semana:</strong>
                            <div className="days-container">
                                {Object.keys(selectedDays).map(day => (
                                    <label key={day} className="day-label">
                                        <div className="day-name">{daysOfWeek[day]}</div>
                                        <input
                                            type="checkbox"
                                            checked={selectedDays[day]}
                                            onChange={() => setSelectedDays({ ...selectedDays, [day]: !selectedDays[day] })}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
    
                    {/* Submit and Cancel Buttons */}
                    <button onClick={handleSubmit}>Criar Evento</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        )
    );    
}

export default EventCreationModal;