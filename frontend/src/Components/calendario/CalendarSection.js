  import React, { useState, useEffect } from "react";
  import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
  import "../../styles/CalendarSection.css";

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", 
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const years = [2023, 2024, 2025];

  const CalendarSection = () => {
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedMonth, setSelectedMonth] = useState("Enero");
    const [events, setEvents] = useState([]);

    const fetchEventsFromApi = async (year, monthNumber) => {
    try {
      const response = await fetch('http://localhost:3000/api/user/calendarevents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month: monthNumber }),        
      });

      if (!response.ok) throw new Error('Error al obtener los eventos');
      const { data } = await response.json();
      console.log(data);
      setEvents(data);

      } catch (error) {
        console.error(error);
        setEvents([]);
      }
    };


    // Carga los eventos cada vez que cambia año o mes
    useEffect(() => {
      const monthNumber = months.indexOf(selectedMonth) + 1;
      fetchEventsFromApi(selectedYear, monthNumber);
    }, [selectedYear, selectedMonth]);

    const changeMonth = (direction) => {
      const currentIndex = months.indexOf(selectedMonth);
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % 12;
      } else {
        newIndex = (currentIndex - 1 + 12) % 12;
      }
      setSelectedMonth(months[newIndex]);
    };

    return (
    <div className="calendar-section">
      <div className="calendar-header">
        <h2>Calendario</h2>

        <div className="year-selector">
          <select
            className="year-dropdown"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="quote">
          "Los eventos son momentos que nos permiten conectar con el presente, crear recuerdos y construir historias que compartimos con los demás."
        </div>
      </div>

      <div className="month-navigator">
        <button onClick={() => changeMonth('prev')} className="nav-button">
          <FaChevronLeft />
        </button>
        <h3>{selectedMonth}</h3>
        <button onClick={() => changeMonth('next')} className="nav-button">
          <FaChevronRight />
        </button>
      </div>

      <div className="months-container">
        {months.map((month) => (
          <div
            key={month}
            className={`month ${month === selectedMonth ? 'active' : ''}`}
            onClick={() => setSelectedMonth(month)}
          >
            <FaCalendarAlt className="calendar-icon" />
            <span>{month.substring(0, 3)}</span>
          </div>
        ))}
      </div>

      <div className="events-section">
        {events.length > 0 ? (
          <>
            <h3>Eventos de {selectedMonth} {selectedYear}</h3>
            <div className="events-container">
              {events.map((event, index) => (
                <div className="event-card" key={index}>
                  <div className="event-header">
                    <h4>{event.name}</h4>
                    <span className="event-date">{event.date}</span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-footer">
                    <span className="event-location">{event.place}</span>
                    <button className="event-details-btn">Ver detalles</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="no-events">No hay eventos para este mes.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarSection;
