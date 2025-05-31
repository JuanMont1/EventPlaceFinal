import React from 'react';
import '../../styles/CalendarSection.css';
import { FaCalendar, FaGraduationCap, FaMusic, FaFootballBall, FaPalette, FaCode } from 'react-icons/fa';

const UpcomingEvents = () => {
  const events = [
    {
      id: 1,
      title: 'Concierto Sinfónico',
      date: '2025-04-15',
      category: 'Cultural'
    },
    {
      id: 2,
      title: 'Feria de Emprendimiento',
      date: '2025-05-01',
      category: 'Académico'
    },
    {
      id: 3,
      title: 'Taller de Programación',
      date: '2025-06-10',
      category: 'Tecnología'
    },
    {
      id: 4,
      title: 'Exposición de Arte Moderno',
      date: '2025-07-20',
      category: 'Artístico'
    },
    {
      id: 5,
      title: 'Torneo de Fútbol Interfacultades',
      date: '2025-08-05',
      category: 'Deportivo'
    },
    {
      id: 6,
      title: 'Conferencia de Inteligencia Artificial',
      date: '2025-09-15',
      category: 'Tecnología'
    },
  ];

  const categoryIcons = {
    'Académico': <FaGraduationCap />,
    'Cultural': <FaMusic />,
    'Deportivo': <FaFootballBall />,
    'Artístico': <FaPalette />,
    'Tecnología': <FaCode />
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="upcoming-events-section">
      <h2>Próximos Eventos</h2>
      <div className="upcoming-events-list">
        {upcomingEvents.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-icon">{categoryIcons[event.category]}</div>
            <div className="event-info">
              <h3>{event.title}</h3>
              <p><FaCalendar /> {event.date}</p>
              <span className="category-label">{event.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
