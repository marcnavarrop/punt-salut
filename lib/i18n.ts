// Diccionari de traduccions de l'aplicació (català / castellà)

export type Idioma = "ca" | "es";

export const IDIOMES: Idioma[] = ["ca", "es"];

interface Traduccio {
  ca: string;
  es: string;
}

export const TRADUCCIONS = {
  sidebar: {
    pacients: { ca: "Pacients", es: "Pacientes" },
    configuracio: { ca: "Configuració", es: "Configuración" },
    tancarSessio: { ca: "Tancar sessió", es: "Cerrar sesión" },
  },
  comu: {
    cancelar: { ca: "Cancel·lar", es: "Cancelar" },
    desar: { ca: "Desar", es: "Guardar" },
    desarCanvis: { ca: "Desar canvis", es: "Guardar cambios" },
    editar: { ca: "Editar", es: "Editar" },
    eliminar: { ca: "Eliminar", es: "Eliminar" },
    nom: { ca: "Nom", es: "Nombre" },
    cognoms: { ca: "Cognoms", es: "Apellidos" },
    email: { ca: "Email", es: "Email" },
    telefon: { ca: "Telèfon", es: "Teléfono" },
    dataNaixement: { ca: "Data de naixement", es: "Fecha de nacimiento" },
    anys: { ca: "anys", es: "años" },
    motiuConsulta: { ca: "Motiu de consulta", es: "Motivo de consulta" },
    dolor: { ca: "Dolor", es: "Dolor" },
    aspecteEmocional: { ca: "Aspecte emocional", es: "Aspecto emocional" },
    valoracioFuncional: {
      ca: "Valoració funcional",
      es: "Valoración funcional",
    },
    pendents: { ca: "Pendents", es: "Pendientes" },
    resumEstructurat: { ca: "Resum estructurat", es: "Resumen estructurado" },
  },
  pacients: {
    assistentClinic: { ca: "Assistent clínic", es: "Asistente clínico" },
    pacientsActius: { ca: "pacients actius", es: "pacientes activos" },
    nouPacient: { ca: "Nou pacient", es: "Nuevo paciente" },
    cercaPlaceholder: {
      ca: "Cerca per nom o diagnòstic…",
      es: "Buscar por nombre o diagnóstico…",
    },
    capResultat: {
      ca: "No s'ha trobat cap pacient amb aquest criteri.",
      es: "No se ha encontrado ningún paciente con ese criterio.",
    },
  },
  pacientDetall: {
    tornarAPacients: { ca: "Tornar a pacients", es: "Volver a pacientes" },
    pacientNoTrobat: { ca: "Pacient no trobat.", es: "Paciente no encontrado." },
    editar: { ca: "Editar", es: "Editar" },
    eliminarPacient: { ca: "Eliminar pacient", es: "Eliminar paciente" },
    novaSessio: { ca: "Nova sessió", es: "Nueva sesión" },
    kinesiofobiaDetectada: {
      ca: "Kinesiofòbia detectada",
      es: "Kinesiofobia detectada",
    },
    pacientDesDe: { ca: "Pacient des de", es: "Paciente desde" },
    dadesPersonals: { ca: "Dades personals", es: "Datos personales" },
    diagnostic: { ca: "Diagnòstic", es: "Diagnóstico" },
    resumClinic: { ca: "Resum clínic", es: "Resumen clínico" },
    evaActual: { ca: "EVA actual", es: "EVA actual" },
    ultimaSessio: { ca: "Última sessió", es: "Última sesión" },
    properaSessio: { ca: "Propera sessió", es: "Próxima sesión" },
    pendentProgramar: {
      ca: "Pendent de programar",
      es: "Pendiente de programar",
    },
    frequencia: { ca: "Freqüència", es: "Frecuencia" },
    pendentDefinir: { ca: "Pendent de definir", es: "Pendiente de definir" },
    historialSessions: {
      ca: "Historial de sessions",
      es: "Historial de sesiones",
    },
    sessions: { ca: "sessions", es: "sesiones" },
    capSessio: {
      ca: "Encara no hi ha sessions registrades per a aquest pacient.",
      es: "Todavía no hay sesiones registradas para este paciente.",
    },
    sessioNum: { ca: "Sessió", es: "Sesión" },
    inicial: { ca: "Inicial", es: "Inicial" },
    confirmarEliminarTitol: { ca: "Eliminar pacient", es: "Eliminar paciente" },
    confirmarEliminarMissatge: {
      ca: "Estàs segur que vols eliminar {nom}? Aquesta acció eliminarà també totes les seves sessions i no es pot desfer.",
      es: "¿Seguro que quieres eliminar a {nom}? Esta acción también eliminará todas sus sesiones y no se puede deshacer.",
    },
  },
  formulariPacient: {
    nouPacientTitol: { ca: "Nou pacient", es: "Nuevo paciente" },
    editarPacientTitol: { ca: "Editar pacient", es: "Editar paciente" },
    crearPacient: { ca: "Crear pacient", es: "Crear paciente" },
    faseClinica: { ca: "Fase clínica", es: "Fase clínica" },
    professionalAssignat: {
      ca: "Professional assignat",
      es: "Profesional asignado",
    },
    diagnostic: { ca: "Diagnòstic", es: "Diagnóstico" },
    frequencia: { ca: "Freqüència", es: "Frecuencia" },
    senseFrequencia: { ca: "Sense definir", es: "Sin definir" },
  },
  configuracio: {
    titol: { ca: "Configuració", es: "Configuración" },
    subtitol: {
      ca: "Gestiona les dades del centre i els professionals",
      es: "Gestiona los datos del centro y los profesionales",
    },
    dadesCentre: { ca: "Dades del centre", es: "Datos del centro" },
    nomCentre: { ca: "Nom del centre", es: "Nombre del centro" },
    logoCentre: { ca: "Logo del centre", es: "Logo del centro" },
    pujarLogo: { ca: "Pujar logo", es: "Subir logo" },
    logoMassaGran: {
      ca: "La imatge no pot superar els 2 MB.",
      es: "La imagen no puede superar los 2 MB.",
    },
    colorCentre: { ca: "Color principal", es: "Color principal" },
    horariObertura: { ca: "Horari d'obertura", es: "Horario de apertura" },
    horariPlaceholder: {
      ca: "Ex: Dilluns a Divendres, 9h-20h",
      es: "Ej: Lunes a Viernes, 9h-20h",
    },
    elMeuPerfil: { ca: "El meu perfil", es: "Mi perfil" },
    fotoPerfil: { ca: "Foto de perfil", es: "Foto de perfil" },
    pujarFoto: { ca: "Pujar foto", es: "Subir foto" },
    fotoMassaGran: {
      ca: "La imatge no pot superar els 2 MB.",
      es: "La imagen no puede superar los 2 MB.",
    },
    canvisDesats: { ca: "Canvis desats", es: "Cambios guardados" },
    canviarContrasenya: { ca: "Canviar contrasenya", es: "Cambiar contraseña" },
    confirmarContrasenya: {
      ca: "Confirma la contrasenya",
      es: "Confirma la contraseña",
    },
    contrasenyaMassaCurta: {
      ca: "La contrasenya ha de tenir com a mínim 4 caràcters.",
      es: "La contraseña debe tener al menos 4 caracteres.",
    },
    contrasenyesNoCoincideixen: {
      ca: "Les contrasenyes no coincideixen.",
      es: "Las contraseñas no coinciden.",
    },
    actualitzarContrasenya: {
      ca: "Actualitzar contrasenya",
      es: "Actualizar contraseña",
    },
    contrasenyaActualitzada: {
      ca: "Contrasenya actualitzada",
      es: "Contraseña actualizada",
    },
    configuracioClinica: { ca: "Configuració clínica", es: "Configuración clínica" },
    diagnosticsHabituals: {
      ca: "Diagnòstics habituals",
      es: "Diagnósticos habituales",
    },
    diagnosticsAjuda: {
      ca: "Apareixeran com a suggeriments en crear un pacient nou.",
      es: "Aparecerán como sugerencias al crear un paciente nuevo.",
    },
    afegirDiagnostic: { ca: "Afegir diagnòstic…", es: "Añadir diagnóstico…" },
    capDiagnostic: {
      ca: "Encara no hi ha diagnòstics habituals.",
      es: "Todavía no hay diagnósticos habituales.",
    },
    frequenciesHabituals: {
      ca: "Freqüències de seguiment habituals",
      es: "Frecuencias de seguimiento habituales",
    },
    frequenciesAjuda: {
      ca: "Apareixeran com a opcions de freqüència en la fitxa del pacient.",
      es: "Aparecerán como opciones de frecuencia en la ficha del paciente.",
    },
    afegirFrequencia: { ca: "Afegir freqüència…", es: "Añadir frecuencia…" },
    capFrequencia: {
      ca: "Encara no hi ha freqüències habituals.",
      es: "Todavía no hay frecuencias habituales.",
    },
    preferencies: { ca: "Preferències", es: "Preferencias" },
    idiomaPerDefecte: {
      ca: "Idioma per defecte del centre",
      es: "Idioma por defecto del centro",
    },
    idiomaPerDefecteAjuda: {
      ca: "S'aplica als professionals que encara no han triat idioma.",
      es: "Se aplica a los profesionales que aún no han elegido idioma.",
    },
    formatData: { ca: "Format de data", es: "Formato de fecha" },
    formatDataAjuda: {
      ca: "Com es mostren les dates a tota l'aplicació.",
      es: "Cómo se muestran las fechas en toda la aplicación.",
    },
    professionals: { ca: "Professionals", es: "Profesionales" },
    nouProfessional: { ca: "Nou professional", es: "Nuevo profesional" },
    editarProfessional: {
      ca: "Editar professional",
      es: "Editar profesional",
    },
    crearProfessional: { ca: "Crear professional", es: "Crear profesional" },
    capProfessional: {
      ca: "Encara no hi ha professionals registrats.",
      es: "Todavía no hay profesionales registrados.",
    },
    especialitat: { ca: "Especialitat", es: "Especialidad" },
    confirmarEliminarTitol: {
      ca: "Eliminar professional",
      es: "Eliminar profesional",
    },
    confirmarEliminarMissatge: {
      ca: "Estàs segur que vols eliminar {nom}? Aquesta acció no es pot desfer.",
      es: "¿Seguro que quieres eliminar a {nom}? Esta acción no se puede deshacer.",
    },
  },
  admin: {
    titol: { ca: "Administració", es: "Administración" },
    subtitol: {
      ca: "Llista de centres i professionals registrats a Voltamed",
      es: "Lista de centros y profesionales registrados en Voltamed",
    },
    iniciaSessio: {
      ca: "Accés d'administració",
      es: "Acceso de administración",
    },
    centres: { ca: "Centres", es: "Centros" },
    professionals: { ca: "Professionals", es: "Profesionales" },
    pacients: { ca: "pacients", es: "pacientes" },
    capProfessional: {
      ca: "Encara no hi ha professionals registrats.",
      es: "Todavía no hay profesionales registrados.",
    },
    nouCentre: { ca: "Nou centre", es: "Nuevo centro" },
    editarCentre: { ca: "Editar centre", es: "Editar centro" },
    crearCentre: { ca: "Crear centre", es: "Crear centro" },
    slug: { ca: "Identificador (slug)", es: "Identificador (slug)" },
    slugAjuda: {
      ca: "Només minúscules, números i guions. No es pot canviar un cop creat.",
      es: "Solo minúsculas, números y guiones. No se puede cambiar una vez creado.",
    },
    slugDuplicat: {
      ca: "Ja existeix un centre amb aquest identificador.",
      es: "Ya existe un centro con ese identificador.",
    },
    colorPrincipal: { ca: "Color principal", es: "Color principal" },
    logoUrlOpcional: {
      ca: "URL del logo (opcional)",
      es: "URL del logo (opcional)",
    },
    nouProfessionalCentre: {
      ca: "Nou professional",
      es: "Nuevo profesional",
    },
    contrasenya: { ca: "Contrasenya", es: "Contraseña" },
    contrasenyaNovaOpcional: {
      ca: "Contrasenya nova (deixa en blanc per no canviar-la)",
      es: "Contraseña nueva (déjala en blanco para no cambiarla)",
    },
    confirmarEliminarCentreTitol: {
      ca: "Eliminar centre",
      es: "Eliminar centro",
    },
    confirmarEliminarCentreMissatge: {
      ca: "Estàs segur que vols eliminar {nom}? Té {pacients} pacients i {professionals} professionals associats que quedaran sense centre. Aquesta acció no es pot desfer.",
      es: "¿Seguro que quieres eliminar {nom}? Tiene {pacients} pacientes y {professionals} profesionales asociados que quedarán sin centro. Esta acción no se puede deshacer.",
    },
    confirmarEliminarProfessionalMissatge: {
      ca: "Estàs segur que vols eliminar {nom}? També perdrà l'accés per iniciar sessió. Aquesta acció no es pot desfer.",
      es: "¿Seguro que quieres eliminar a {nom}? También perderá el acceso para iniciar sesión. Esta acción no se puede deshacer.",
    },
  },
  login: {
    assistentClinic: { ca: "Assistent clínic", es: "Asistente clínico" },
    iniciaSessio: { ca: "Inicia sessió", es: "Inicia sesión" },
    accedeix: {
      ca: "Accedeix amb el teu compte de professional.",
      es: "Accede con tu cuenta de profesional.",
    },
    contrasenya: { ca: "Contrasenya", es: "Contraseña" },
    errorCredencials: {
      ca: "Email o contrasenya incorrectes.",
      es: "Email o contraseña incorrectos.",
    },
    entrar: { ca: "Entrar", es: "Entrar" },
  },
  sessio: {
    tornarFitxa: { ca: "Tornar a la fitxa", es: "Volver a la ficha" },
    finalitzarSessio: { ca: "Finalitzar sessió", es: "Finalizar sesión" },
    gravant: { ca: "GRAVANT", es: "GRABANDO" },
    enPausa: { ca: "EN PAUSA", es: "EN PAUSA" },
    pausarGravacio: { ca: "Pausar gravació", es: "Pausar grabación" },
    iniciarGravacio: { ca: "Iniciar gravació", es: "Iniciar grabación" },
    transcripcioTempsReal: {
      ca: "Transcripció en temps real",
      es: "Transcripción en tiempo real",
    },
    transcripcioEspera: {
      ca: "La transcripció apareixerà aquí quan comenci la gravació...",
      es: "La transcripción aparecerá aquí cuando empiece la grabación...",
    },
    connectant: { ca: "Connectant…", es: "Conectando…" },
    idiomaTranscripcio: {
      ca: "Idioma de la transcripció",
      es: "Idioma de la transcripción",
    },
    avisCanviIdioma: {
      ca: "Pausa la gravació per canviar l'idioma de la transcripció.",
      es: "Pausa la grabación para cambiar el idioma de la transcripción.",
    },
    errorMicrofon: {
      ca: "No s'ha pogut accedir al micròfon. Comprova que has donat permís al navegador.",
      es: "No se ha podido acceder al micrófono. Comprueba que has dado permiso al navegador.",
    },
    errorSenseSuport: {
      ca: "Aquest navegador no permet la captura d'àudio. Prova amb Chrome o Safari actualitzat.",
      es: "Este navegador no permite la captura de audio. Prueba con Chrome o Safari actualizado.",
    },
    errorConnexioTranscripcio: {
      ca: "No s'ha pogut connectar amb el servei de transcripció. Pots continuar la sessió i tornar-ho a provar.",
      es: "No se ha podido conectar con el servicio de transcripción. Puedes continuar la sesión y volver a intentarlo.",
    },
    analisiIntelligent: {
      ca: "Anàlisi intel·ligent",
      es: "Análisis inteligente",
    },
    analisiEspera: {
      ca: "L'anàlisi es generarà automàticament als {segons} segons de gravació.",
      es: "El análisis se generará automáticamente a los {segons} segundos de grabación.",
    },
    resumEspera: {
      ca: "El resum es generarà automàticament durant la gravació.",
      es: "El resumen se generará automáticamente durante la grabación.",
    },
    preguntesSeguentSessio: {
      ca: "Preguntes per a la propera sessió",
      es: "Preguntas para la próxima sesión",
    },
    resumFinalSessio: {
      ca: "Resum final de la sessió",
      es: "Resumen final de la sesión",
    },
    durada: { ca: "Durada", es: "Duración" },
    continuarEditant: { ca: "Continuar editant", es: "Continuar editando" },
    desarSessio: { ca: "Desar sessió", es: "Guardar sesión" },
    pacientPerDefecte: { ca: "Pacient", es: "Paciente" },
  },
  sessioDetall: {
    sessioNoTrobada: { ca: "Sessió no trobada.", es: "Sesión no encontrada." },
    exportarPdf: { ca: "Exportar PDF", es: "Exportar PDF" },
    deteccionsIA: { ca: "Deteccions de la IA", es: "Detecciones de la IA" },
    transcripcioCompleta: {
      ca: "Transcripció completa",
      es: "Transcripción completa",
    },
    capTranscripcio: {
      ca: "No hi ha transcripció disponible per a aquesta sessió.",
      es: "No hay transcripción disponible para esta sesión.",
    },
  },
  etiquetes: {
    estatPacient: {
      actiu: { ca: "Actiu", es: "Activo" } as Traduccio,
      "alta temporal": { ca: "Alta temporal", es: "Alta temporal" } as Traduccio,
      "fase aguda": { ca: "Fase aguda", es: "Fase aguda" } as Traduccio,
    },
    fase: {
      agut: { ca: "Agut", es: "Agudo" } as Traduccio,
      subagut: { ca: "Subagut", es: "Subagudo" } as Traduccio,
      cronic: { ca: "Crònic", es: "Crónico" } as Traduccio,
    },
    evolucio: {
      millora: { ca: "Millora", es: "Mejora" } as Traduccio,
      estable: { ca: "Estable", es: "Estable" } as Traduccio,
      empitjora: { ca: "Empitjora", es: "Empeora" } as Traduccio,
    },
    deteccio: {
      kinesiofobia: { ca: "Kinesiofòbia", es: "Kinesiofobia" } as Traduccio,
      catastrofitzacio: {
        ca: "Catastrofització",
        es: "Catastrofización",
      } as Traduccio,
      milloraDetectada: {
        ca: "Millora detectada",
        es: "Mejora detectada",
      } as Traduccio,
      alertaClinica: { ca: "Alerta clínica", es: "Alerta clínica" } as Traduccio,
      suggeriment: { ca: "Suggeriment", es: "Sugerencia" } as Traduccio,
    },
  },
};
