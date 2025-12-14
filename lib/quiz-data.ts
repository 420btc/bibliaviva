export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "¿Quién construyó el arca?",
    options: ["Moisés", "Noé", "Abraham", "David"],
    correctAnswer: 1,
    explanation: "Noé construyó el arca siguiendo las instrucciones de Dios para salvar a su familia y a los animales del diluvio (Génesis 6)."
  },
  {
    id: "q2",
    question: "¿Cuál es el primer libro de la Biblia?",
    options: ["Éxodo", "Levítico", "Génesis", "Mateo"],
    correctAnswer: 2,
    explanation: "Génesis es el primer libro de la Biblia y narra los orígenes del mundo y del pueblo de Israel."
  },
  {
    id: "q3",
    question: "¿Quién derrotó al gigante Goliat?",
    options: ["Saúl", "Salomón", "David", "Samuel"],
    correctAnswer: 2,
    explanation: "David, siendo un joven pastor, derrotó al gigante filisteo Goliat con una honda y una piedra (1 Samuel 17)."
  },
  {
    id: "q4",
    question: "¿Dónde nació Jesús?",
    options: ["Nazaret", "Jerusalén", "Belén", "Galilea"],
    correctAnswer: 2,
    explanation: "Jesús nació en Belén de Judea, cumpliendo la profecía de Miqueas 5:2."
  },
  {
    id: "q5",
    question: "¿Cuántos mandamientos entregó Dios a Moisés?",
    options: ["5", "10", "12", "7"],
    correctAnswer: 1,
    explanation: "Dios entregó 10 mandamientos a Moisés en el Monte Sinaí (Éxodo 20)."
  },
  {
    id: "q6",
    question: "¿Quién fue tragado por un gran pez?",
    options: ["Jonás", "Pedro", "Pablo", "Elías"],
    correctAnswer: 0,
    explanation: "Jonás fue tragado por un gran pez cuando intentaba huir de la presencia de Dios (Jonás 1)."
  },
  {
    id: "q7",
    question: "¿Cuál es el libro más largo de la Biblia?",
    options: ["Isaías", "Jeremías", "Salmos", "Génesis"],
    correctAnswer: 2,
    explanation: "El libro de los Salmos es el más largo de la Biblia, con 150 capítulos."
  },
  {
    id: "q8",
    question: "¿Quién negó a Jesús tres veces?",
    options: ["Judas", "Juan", "Pedro", "Tomás"],
    correctAnswer: 2,
    explanation: "Pedro negó conocer a Jesús tres veces antes de que cantara el gallo, tal como Jesús lo había predicho (Mateo 26)."
  },
  {
    id: "q9",
    question: "¿Qué mar abrió Moisés?",
    options: ["Mar Muerto", "Mar Rojo", "Mar de Galilea", "Mar Mediterráneo"],
    correctAnswer: 1,
    explanation: "Moisés, por el poder de Dios, dividió las aguas del Mar Rojo para que los israelitas pudieran cruzar (Éxodo 14)."
  },
  {
    id: "q10",
    question: "¿Quién fue el hombre más fuerte de la Biblia?",
    options: ["Goliat", "Sansón", "David", "Hércules"],
    correctAnswer: 1,
    explanation: "Sansón poseía una fuerza sobrenatural dada por Dios, siempre que no se cortara el cabello (Jueces 13-16)."
  },
  {
    id: "q11",
    question: "¿Quién fue arrojado al foso de los leones?",
    options: ["Daniel", "José", "David", "Esteban"],
    correctAnswer: 0,
    explanation: "Daniel fue arrojado al foso de los leones por orar a Dios desafiando el decreto del rey, pero Dios envió un ángel para protegerlo (Daniel 6)."
  },
  {
    id: "q12",
    question: "¿Quién fue vendido por sus hermanos?",
    options: ["Benjamín", "José", "Rubén", "Judá"],
    correctAnswer: 1,
    explanation: "José fue vendido por sus hermanos a unos mercaderes ismaelitas por celos (Génesis 37)."
  },
  {
    id: "q13",
    question: "¿Quién escribió la mayoría de las cartas del Nuevo Testamento?",
    options: ["Pedro", "Juan", "Pablo", "Santiago"],
    correctAnswer: 2,
    explanation: "El apóstol Pablo escribió 13 de los 27 libros del Nuevo Testamento."
  },
  {
    id: "q14",
    question: "¿Cuál fue la primera plaga de Egipto?",
    options: ["Ranas", "Langostas", "Sangre", "Tinieblas"],
    correctAnswer: 2,
    explanation: "La primera plaga convirtió el agua del Nilo en sangre (Éxodo 7)."
  },
  {
    id: "q15",
    question: "¿Quién es conocido como el 'Padre de la Fe'?",
    options: ["Moisés", "Abraham", "Isaac", "Jacob"],
    correctAnswer: 1,
    explanation: "Abraham es llamado el padre de la fe por creer en la promesa de Dios (Romanos 4:11)."
  },
  {
    id: "q16",
    question: "¿Qué contenía el Arca del Pacto?",
    options: ["Solo los Diez Mandamientos", "Mandamientos, maná y vara de Aarón", "Los escritos de Moisés", "Oro y joyas"],
    correctAnswer: 1,
    explanation: "El Arca contenía las tablas de la ley, una vasija con maná y la vara de Aarón que reverdeció (Hebreos 9:4)."
  },
  {
    id: "q17",
    question: "¿Cómo se llamaba la esposa de Abraham?",
    options: ["Rebeca", "Raquel", "Sara", "Lea"],
    correctAnswer: 2,
    explanation: "Sara fue la esposa de Abraham y madre de Isaac, siendo estéril hasta su vejez (Génesis 17:15)."
  },
  {
    id: "q18",
    question: "¿Quién fue el hijo de la promesa?",
    options: ["Ismael", "Isaac", "Esaú", "Jacob"],
    correctAnswer: 1,
    explanation: "Isaac fue el hijo prometido por Dios a Abraham y Sara en su vejez (Génesis 21)."
  },
  {
    id: "q19",
    question: "¿Quién era el hermano de Moisés?",
    options: ["Aarón", "Josué", "Caleb", "Miriam"],
    correctAnswer: 0,
    explanation: "Aarón era el hermano mayor de Moisés y fue designado como el primer sumo sacerdote (Éxodo 4:14)."
  },
  {
    id: "q20",
    question: "¿Quién sucedió a Moisés como líder de Israel?",
    options: ["Caleb", "Aarón", "Josué", "Gedeón"],
    correctAnswer: 2,
    explanation: "Josué fue escogido por Dios para suceder a Moisés y guiar al pueblo a la Tierra Prometida (Josué 1)."
  },
  {
    id: "q21",
    question: "¿Qué reina salvó a su pueblo de la destrucción?",
    options: ["Rut", "Ester", "Noemí", "Betsabé"],
    correctAnswer: 1,
    explanation: "La reina Ester intercedió ante el rey Asuero para salvar a los judíos de un complot de exterminio (Libro de Ester)."
  },
  {
    id: "q22",
    question: "¿Qué profeta subió al cielo en un carro de fuego?",
    options: ["Eliseo", "Isaías", "Elías", "Jeremías"],
    correctAnswer: 2,
    explanation: "Elías fue llevado al cielo en un torbellino con carros y caballos de fuego, sin ver muerte (2 Reyes 2)."
  },
  {
    id: "q23",
    question: "¿En qué lugar fue crucificado Jesús?",
    options: ["Monte de los Olivos", "Getsemaní", "Gólgota", "Sion"],
    correctAnswer: 2,
    explanation: "Jesús fue crucificado en el lugar llamado Gólgota, que significa 'Lugar de la Calavera' (Mateo 27:33)."
  },
  {
    id: "q24",
    question: "¿Quién bautizó a Jesús?",
    options: ["Pedro", "Juan el Bautista", "Juan el Apóstol", "Santiago"],
    correctAnswer: 1,
    explanation: "Juan el Bautista bautizó a Jesús en el río Jordán (Mateo 3)."
  },
  {
    id: "q25",
    question: "¿Quién fue el primer mártir cristiano?",
    options: ["Santiago", "Pedro", "Esteban", "Pablo"],
    correctAnswer: 2,
    explanation: "Esteban fue el primer mártir de la iglesia, apedreado por su fe en Jesús (Hechos 7)."
  },
  {
    id: "q26",
    question: "¿Los muros de qué ciudad cayeron tras dar vueltas?",
    options: ["Jerusalén", "Jericó", "Babilonia", "Nínive"],
    correctAnswer: 1,
    explanation: "Los muros de Jericó cayeron después de que los israelitas marcharan alrededor de ellos por siete días (Josué 6)."
  },
  {
    id: "q27",
    question: "¿Quién fue la esposa de Isaac?",
    options: ["Raquel", "Lea", "Rebeca", "Sara"],
    correctAnswer: 2,
    explanation: "Rebeca fue elegida por Dios para ser la esposa de Isaac (Génesis 24)."
  },
  {
    id: "q28",
    question: "¿Quién vendió su primogenitura por un plato de lentejas?",
    options: ["Jacob", "Esaú", "José", "David"],
    correctAnswer: 1,
    explanation: "Esaú vendió sus derechos de primogenitura a su hermano Jacob por un guiso rojo (Génesis 25)."
  },
  {
    id: "q29",
    question: "¿Qué rey pidió sabiduría a Dios?",
    options: ["David", "Saúl", "Salomón", "Ezequías"],
    correctAnswer: 2,
    explanation: "Salomón pidió sabiduría para gobernar al pueblo en lugar de riquezas o larga vida (1 Reyes 3)."
  },
  {
    id: "q30",
    question: "¿Cuál es el último libro de la Biblia?",
    options: ["Hechos", "Judas", "Apocalipsis", "Malaquías"],
    correctAnswer: 2,
    explanation: "Apocalipsis es el último libro de la Biblia, escrito por el apóstol Juan en la isla de Patmos."
  },
  {
    id: "q31",
    question: "¿A qué discípulo amaba Jesús especialmente?",
    options: ["Pedro", "Santiago", "Juan", "Andrés"],
    correctAnswer: 2,
    explanation: "Juan se refiere a sí mismo en su evangelio como 'el discípulo a quien Jesús amaba' (Juan 13:23)."
  },
  {
    id: "q32",
    question: "¿Quién era el recaudador de impuestos de baja estatura?",
    options: ["Mateo", "Zaqueo", "Nicodemo", "Lázaro"],
    correctAnswer: 1,
    explanation: "Zaqueo era un jefe de publicanos rico y de baja estatura que subió a un árbol para ver a Jesús (Lucas 19)."
  },
  {
    id: "q33",
    question: "¿A quién resucitó Jesús después de cuatro días?",
    options: ["La hija de Jairo", "El hijo de la viuda", "Lázaro", "Tabita"],
    correctAnswer: 2,
    explanation: "Jesús resucitó a Lázaro de Betania después de que llevara cuatro días en el sepulcro (Juan 11)."
  }
];

export function getDailyQuizQuestions(): QuizQuestion[] {
  // Usar la fecha actual para generar una semilla determinista
  const today = new Date();
  // Resetear la hora para que sea consistente durante todo el día
  today.setHours(0, 0, 0, 0);
  
  // Generar un número pseudo-aleatorio basado en la fecha
  const seed = today.getTime();
  
  // Función simple de hash para obtener índices aleatorios pero consistentes para el día
  const getRandomIndex = (seed: number, max: number, iteration: number) => {
    const x = Math.sin(seed + iteration) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  // Seleccionar 5 preguntas para el quiz del día
  const dailyQuestions: QuizQuestion[] = [];
  const totalQuestions = quizQuestions.length;
  const questionsPerQuiz = 5;
  
  // Usamos un Set para evitar duplicados
  const selectedIndices = new Set<number>();
  
  let i = 0;
  while (selectedIndices.size < Math.min(questionsPerQuiz, totalQuestions)) {
    const index = getRandomIndex(seed, totalQuestions, i);
    if (!selectedIndices.has(index)) {
      selectedIndices.add(index);
      dailyQuestions.push(quizQuestions[index]);
    }
    i++;
  }
  
  return dailyQuestions;
}
