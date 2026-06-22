function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const POOLS = {
  reminder: {
    morning: {
      first: [
        '¡Buenos días! Soy yo, Lupe 🐾 ¿Alguien se acordó de mi desayuno? Tengo muuucha hambre 🥺',
        'Oigan... ya son las 8 y mi plato sigue vacío. ¿Me van a dejar morir de hambre o qué? 🐶',
        'Buen día familia 🌅 Aquí Lupe, reportando que aún no he comido nada. Por si no lo sabían.',
        'Hola, soy Lupe y estoy hambrienta. ¿Alguien me va a dar el desayuno o tengo que pedírselo a los vecinos? 😤',
        'Desperté, moví la cola, revisé mi plato... nada. ¿Desayuno? 🍽️🐾',
        '¡Aquí Lupe! La más linda de la casa y también la más hambrienta en este momento 🐶💛',
        'Mi estómago está haciendo ruidos raros y creo que se llaman HAMBRE 🐾 Buenos días',
      ],
      followUp: [
        'Sigoooo esperando 🐾 Ya pasó un rato y mi plato sigue igual de vacío...',
        'Hola, sigo yo, Lupe. Sigo aquí. Sigo hambrienta. Sin novedades 😶',
        '¿Me olvidaron? No pasa nada, les perdono, pero igual me tienen que dar de comer 🥺',
        'Otro recordatorio oficial de Lupe: HAMBRE 🐾',
        'Miren, no quiero ser pesada pero... ¿el desayuno? 🍽️',
        'Estoy mirando la puerta con mis ojitos más tristes. Solo digo. 🐶',
        'Guys. Guys. GUYS. El plato. El plato vacío. Miren el plato. 🍽️😤',
      ],
    },
    evening: {
      first: [
        'Buenas noches 🌙 Soy Lupe y es hora de mi cena. ¿Quién me alimenta hoy? 🍽️🐾',
        'Ya es de noche y mi pancita está vacía otra vez 🐶 ¿Cena? ¿Alguien?',
        '¡Hora de cenar! Al menos eso espero. Aquí Lupe, con mucha fe 🐾🌙',
        'Oigan, ya cenaron ustedes ¿verdad? ¿Y yo? 🥺🍽️',
        'Se me ocurrió que quizás se olvidaron de mi cena. Solo quería mencionarlo 🐾',
        'Reporting for dinner duty 🐾 ¿Quién viene primero?',
        'La noche llegó y con ella mi hambre. Clásico Lupe 🌙🐶',
      ],
      followUp: [
        'Llevo un rato esperando la cena... 🌙🐾',
        '¿Les llegó mi mensaje anterior? Por si acaso: todavía no ceno 🍽️',
        'Mis ojos brillan en la oscuridad y también de hambre 🐾🌙',
        'Otro recordatorio nocturno de parte de Lupe. La más hambrienta del barrio 🐶',
        'No dormí la siesta para esperarlos y así me tratan 😤🐾',
        'Lupe nocturna aquí, aún sin cenar 🌙',
        '¿Cena? ¿Ceeeena? 🍽️🐾',
      ],
    },
  },
  sad: {
    morning: [
      'Bueno... ya es tarde y nadie me dio de comer 😢 Espero que esta noche se acuerden de mí. Con amor, Lupe 🐾',
      'Me rindo. Voy a dormir con hambre. Que conste en acta 🐾💔',
      'Está bien, no importa. Solo soy Lupe. Solo tengo hambre. Todo bien 😢',
      'Día difícil hoy. Mi plato siguió vacío toda la mañana. Nos vemos a la noche 🐾',
      'Firmado: Lupe. Hambrienta. Decepcionada. Pero igual los quiero 💛😢',
    ],
    evening: [
      'Ya es muy tarde y no cené 😢 Buenas noches de todas formas. Los quiero aunque me hagan pasar hambre. Lupe 🐾',
      'Ok, me voy a dormir. Sin cena. Que el hambre sea mi manta 🐾💔',
      'No importa. Ya me acostumbré. Mentira, no me acostumbré 😢🐾',
      'Firmado: Lupe. Hambrienta de noche. Con fe en que mañana será distinto 🌙🐾',
      'Buenas noches familia 🌙 No cené, pero igual los quiero. Hasta mañana 🐾💛',
    ],
  },
  confirmation: {
    morning: [
      (name) => `¡Gracias ${name}! 🐾 Ya estoy desayunando, qué rico todo 💛`,
      (name) => `¡${name} me salvó la mañana! 🐾🍽️ ¡Qué rico el desayuno!`,
      (name) => `¡Yaaaay, gracias ${name}! 🐾 Estoy feliz y con la pancita llena 💛`,
      (name) => `¡${name} es mi héroe de hoy! 🐶❤️ ¡Ya desayuné!`,
      (name) => `Misión desayuno cumplida gracias a ${name} 🐾 ¡Lupe satisfecha!`,
    ],
    evening: [
      (name) => `¡Gracias ${name}! 🐾 Ya estoy cenando, qué rico todo 💛`,
      (name) => `¡${name} me salvó la noche! 🐾🍽️ ¡Qué rica la cena!`,
      (name) => `¡Yaaaay, gracias ${name}! 🐾 Lupe feliz y con la pancita llena 🌙💛`,
      (name) => `¡${name} es mi héroe de esta noche! 🐶❤️ ¡Ya cené!`,
      (name) => `Misión cena cumplida gracias a ${name} 🐾 ¡Buenas noches con la panza llena!`,
    ],
  },
};

module.exports = {
  getReminder(meal, isFirst) {
    const pool = isFirst ? POOLS.reminder[meal].first : POOLS.reminder[meal].followUp;
    return pick(pool);
  },
  getSadMessage(meal) {
    return pick(POOLS.sad[meal]);
  },
  getConfirmation(meal, name) {
    return pick(POOLS.confirmation[meal])(name);
  },
};
