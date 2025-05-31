
export const logros = [
  {
    id: 'primerEvento',
    nombre: 'Primer Paso',
    descripcion: 'Te has suscrito a tu primer evento',
    icono: '🎉',
    condicion: (suscripciones) => suscripciones.length >= 1
  },
  {
    id: 'cincoEventos',
    nombre: 'Entusiasta',
    descripcion: 'Te has suscrito a 5 eventos',
    icono: '🌟',
    condicion: (suscripciones) => suscripciones.length >= 5
  },
  {
    id: 'diezEventos',
    nombre: 'Súper Participativo',
    descripcion: 'Te has suscrito a 10 eventos',
    icono: '🏆',
    condicion: (suscripciones) => suscripciones.length >= 10
  },
  {
    id: 'todasLasCategorias',
    nombre: 'Explorador',
    descripcion: 'Te has suscrito a eventos de todas las categorías',
    icono: '🌈',
    condicion: (suscripciones) => {
      const categorias = new Set(suscripciones.map(s => s.categoria));
      return categorias.size >= 5; // Asumiendo que hay 5 categorías
    }
  }
];