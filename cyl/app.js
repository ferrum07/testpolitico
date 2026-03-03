// cyl/app.js — Datos del test Castilla y León 2026
// stance order: [PP, PSOE, Vox, Sumar, UPL, PorAvila]

const QUIZ_DATA = {
  parties:    ['PP', 'PSOE', 'Vox', 'Sumar', 'UPL', 'PorAvila'],
  colors:     { PP: '#0056A2', PSOE: '#FF0000', Vox: '#63BE21', Sumar: '#E91E8C', UPL: '#8B0000', PorAvila: '#7B5EA7' },
  logos:      { PP: '../logos/pp.png', PSOE: '../logos/psoe.png', Vox: '../logos/vox.png', Sumar: '../logos/sumar.png', UPL: '../logos/upl.png', PorAvila: '../logos/poravila.png' },
  partyNames: { PP: 'PP', PSOE: 'PSOE', Vox: 'Vox', Sumar: 'Sumar/IU', UPL: 'UPL', PorAvila: 'Por Ávila' },
  questions: [
    { topic: 'Despoblación',      text: 'La Junta debe garantizar médico, farmacia y transporte en todos los municipios de CyL, aunque sea deficitario',             stance: [ 0,  1, -1,  1,  1,  1] },
    { topic: 'Territorio',        text: 'León y las provincias del antiguo Reino de León merecen mayor autonomía o una región propia diferenciada de Castilla',      stance: [-1, -1, -1,  0,  1,  0] },
    { topic: 'Energía',           text: 'Los parques eólicos y solares en CyL deben dejar un canon directo a los municipios donde se instalan',                     stance: [ 0,  1, -1,  1,  1,  1] },
    { topic: 'Agua',              text: 'Debe prohibirse cualquier trasvase o exportación de agua del Duero fuera de CyL',                                          stance: [ 0,  0,  1,  1,  1,  1] },
    { topic: 'Sanidad',           text: 'Las listas de espera en la sanidad pública de CyL son un fracaso de gestión que exige un plan de choque urgente',          stance: [-1,  1,  0,  1,  1,  1] },
    { topic: 'Caza',              text: 'La caza mayor debe seguir siendo una actividad económica y cultural protegida en CyL',                                     stance: [ 1,  0,  1, -1,  0,  1] },
    { topic: 'Descentralización', text: 'Las provincias de CyL deben tener más competencias propias y menos dependencia de la Junta en Valladolid',                 stance: [-1,  0, -1,  0,  1,  1] },
    { topic: 'Infraestructuras',  text: 'El AVE y el ferrocarril deben llegar a todas las capitales de provincia de CyL con inversión del Gobierno central',        stance: [ 1,  1,  0,  1,  1,  1] },
    { topic: 'Agricultura',       text: 'Los agricultores y ganaderos de CyL deben recibir precios mínimos garantizados por sus productos',                         stance: [ 0,  1,  1,  1,  1,  1] },
    { topic: 'Juventud',          text: 'CyL debe crear ayudas directas para que los jóvenes no emigren: deducciones, becas y vivienda asequible',                  stance: [ 0,  1,  0,  1,  1,  1] },
    { topic: 'Educación',         text: 'Deben mantenerse abiertas las escuelas rurales aunque tengan pocos alumnos, como servicio esencial del territorio',        stance: [ 0,  1,  0,  1,  1,  1] },
    { topic: 'Industria',         text: 'CyL necesita una política industrial activa con inversión pública para crear empleo fuera del sector agrario',              stance: [ 0,  1,  0,  1,  1,  1] },
    { topic: 'Patrimonio',        text: 'La Junta debe invertir más en patrimonio histórico y cultural como motor de turismo y desarrollo rural',                    stance: [ 1,  1,  0,  1,  1,  1] },
    { topic: 'Vivienda',          text: 'La Junta debe habilitar vivienda asequible en pueblos para atraer nuevos vecinos de otras comunidades o países',            stance: [ 0,  1, -1,  1,  1,  1] },
    { topic: 'Transparencia',     text: 'Debe crearse una comisión independiente que audite contratos y subvenciones de la Junta de CyL',                           stance: [-1,  1,  0,  1,  1,  1] },
  ]
};
