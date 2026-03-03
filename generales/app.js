// ============================================
// indecisos.es — Test General Nacional
// 30 preguntas · 4 partidos (PSOE, Sumar, PP, Vox)
// ============================================

const QUIZ_DATA = {
    // Identificadores internos de los partidos
    parties: ['psoe', 'sumar', 'pp', 'vox'],
    
    // Colores oficiales de cada partido
    colors: {
        psoe: '#FF0000',
        sumar: '#E91E8C',
        pp: '#0056A2',
        vox: '#63BE21'
    },
    
    // Nombres para mostrar en resultados
    partyNames: {
        psoe: 'PSOE',
        sumar: 'Sumar',
        pp: 'PP',
        vox: 'Vox'
    },
    
    // Logos (dejar vacío usa la inicial del partido)
    logos: {
        psoe: '../logos/psoe.png', sumar: '../logos/sumar.png', pp: '../logos/pp.png', vox: '../logos/vox.png'
    },
    
    // ============================================
    // 30 PREGUNTAS DEL TEST GENERAL
    // stance: [psoe, sumar, pp, vox]
    //  1 = A favor | -1 = En contra | 0 = Neutral
    // ============================================
    questions: [
        { topic: 'Sanidad', text: 'El Estado debe reforzar la sanidad pública y reducir la gestión privada concertada', stance: [1, 1, 0, -1] },
        { topic: 'Derechos', text: 'La ley del aborto vigente debe mantenerse sin restricciones adicionales', stance: [1, 1, -1, -1] },
        { topic: 'Economía', text: 'Los planes de pensiones privados deben complementar el sistema público de pensiones', stance: [0, -1, 1, 1] },
        { topic: 'Vivienda', text: 'El Estado debe intervenir activamente y topar el precio de los alquileres', stance: [1, 1, -1, -1] },
        { topic: 'Igualdad', text: 'La ley del consentimiento sexual (Solo sí es sí) es necesaria para proteger a las víctimas', stance: [1, 1, -1, -1] },
        { topic: 'Educación', text: 'La ley educativa vigente (LOMLOE) debe mantenerse en el sistema educativo', stance: [1, 1, -1, -1] },
        { topic: 'Defensa', text: 'España debe aumentar el gasto en defensa hasta alcanzar el 2% del PIB', stance: [0, -1, 1, 1] },
        { topic: 'Inmigración', text: 'España debe flexibilizar la acogida de refugiados y solicitantes de asilo', stance: [1, 1, 0, -1] },
        { topic: 'Pensiones', text: 'La edad de jubilación debe retrasarse para garantizar la sostenibilidad del sistema', stance: [0, -1, 1, 1] },
        { topic: 'Justicia', text: 'El Consejo General del Poder Judicial debe ser elegido directamente por los jueces', stance: [-1, -1, 1, 1] },
        { topic: 'Medio Ambiente', text: 'Se debe prohibir la venta de coches de combustión (gasolina/diésel) en 2035', stance: [1, 1, -1, -1] },
        { topic: 'Fiscalidad', text: 'Se debe mantener un impuesto extraordinario a las grandes fortunas y bancas', stance: [1, 1, -1, -1] },
        { topic: 'Laboral', text: 'El Salario Mínimo Interprofesional debe seguir subiendo por encima de la inflación', stance: [1, 1, -1, 0] },
        { topic: 'Estado', text: 'Se deben recentralizar competencias como Sanidad y Educación al Estado Central', stance: [-1, -1, 0, 1] },
        { topic: 'Memoria', text: 'Se debe aplicar y dotar de presupuesto la Ley de Memoria Democrática', stance: [1, 1, -1, -1] },
        { topic: 'Energía', text: 'España debe prolongar la vida útil de las centrales nucleares existentes', stance: [-1, -1, 1, 1] },
        { topic: 'Familia', text: 'Se deben crear ayudas directas universales por hijo a cargo para fomentar la natalidad', stance: [0, 1, 1, 1] },
        { topic: 'Territorio', text: 'Se deben prohibir los indultos para delitos de sedición o rebelión', stance: [-1, -1, 1, 1] },
        { topic: 'Animales', text: 'La tauromaquia debe dejar de recibir subvenciones públicas', stance: [0, 1, -1, -1] },
        { topic: 'Empleo', text: 'Se debe reducir la jornada laboral a 37,5 horas semanales sin reducción de sueldo', stance: [1, 1, -1, -1] },
        { topic: 'Transporte', text: 'Se debe fomentar el transporte público haciéndolo gratuito para rentas bajas', stance: [1, 1, 0, 0] },
        { topic: 'Cultura', text: 'El Estado debe ofrecer bonos culturales a los jóvenes al cumplir la mayoría de edad', stance: [1, 1, -1, -1] },
        { topic: 'Rural', text: 'Se deben dar ventajas fiscales agresivas a empresas que se instalen en la España vaciada', stance: [1, 1, 1, 1] },
        { topic: 'Política', text: 'Se debe reducir drásticamente el número de diputados y el gasto político', stance: [-1, -1, 0, 1] },
        { topic: 'Exterior', text: 'España debe reconocer unilateralmente a Palestina como Estado', stance: [1, 1, -1, -1] },
        { topic: 'Agua', text: 'Se debe impulsar un Plan Hidrológico Nacional que incluya trasvases entre cuencas', stance: [0, -1, 1, 1] },
        { topic: 'Seguridad', text: 'Se debe endurecer el Código Penal para los casos de multirreincidencia', stance: [0, -1, 1, 1] },
        { topic: 'Impuestos', text: 'Se debe bonificar al 100% el Impuesto de Sucesiones y Donaciones en toda España', stance: [-1, -1, 1, 1] },
        { topic: 'Vivienda', text: 'Se debe agilizar el desalojo de okupas a un plazo máximo de 48 horas', stance: [0, -1, 1, 1] },
        { topic: 'Europa', text: 'Las decisiones de la Unión Europea deben primar siempre sobre la legislación nacional', stance: [1, 1, 1, -1] }
    ]
};