import { TuringMachineConfig, TransitionRule, Direction } from '../types';

let ruleCounter = 0;
function cr(fromState: string, readSymbol: string, writeSymbol: string, direction: Direction, toState: string): TransitionRule {
  ruleCounter++;
  return {
    id: `rule-${ruleCounter}`,
    fromState,
    readSymbol,
    writeSymbol,
    direction,
    toState,
  };
}

export const EXERCISES: TuringMachineConfig[] = [
  {
    id: 'repeat01',
    name: 'Repetidor 01 (Iterativo)',
    description: 'Escribe alternando el patrón "0" y "1" infinitamente en la cinta.',
    educationalExplanation: 'Este ejercicio implementa un bucle infinito que escribe alternadamente 0 y 1. Es útil para comprender cómo una máquina de Turing puede operar como un productor de flujos continuos de datos y no solo como un decisor.',
    initialState: 'q0',
    acceptStates: ['q_halt'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '______',
    defaultAlphabet: ['0', '1', '_'],
    rules: [
      cr('q0', '_', '0', 'R', 'q1'),
      cr('q0', '0', '0', 'R', 'q1'),
      cr('q0', '1', '1', 'R', 'q1'),
      cr('q1', '_', '1', 'R', 'q0'),
      cr('q1', '0', '0', 'R', 'q0'),
      cr('q1', '1', '1', 'R', 'q0')
    ]
  },
  {
    id: 'binaryIncrement',
    name: 'Incremento Binario',
    description: 'Suma 1 a un número binario representado en la cinta.',
    educationalExplanation: 'La máquina recorre el número binario de izquierda a derecha. Al llegar al final, retrocede de derecha a izquierda sumando el acarreo: si lee "1" lo cambia a "0" y sigue a la izquierda (lleva acarreo); si lee "0" o espacio vacío "_", escribe "1" y se detiene en estado de aceptación (sin acarreo).',
    initialState: 'q_scan_r',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '1011', // 11 -> expected 1100 (12)
    defaultAlphabet: ['0', '1', '_'],
    rules: [
      // Ir al final del número binario
      cr('q_scan_r', '0', '0', 'R', 'q_scan_r'),
      cr('q_scan_r', '1', '1', 'R', 'q_scan_r'),
      cr('q_scan_r', '_', '_', 'L', 'q_add'),

      // Realizar la suma
      cr('q_add', '1', '0', 'L', 'q_add'), // Acarreo continúa
      cr('q_add', '0', '1', 'N', 'q_accept'), // Listo, termina
      cr('q_add', '_', '1', 'N', 'q_accept')  // Listo, añade bit más significativo
    ]
  },
  {
    id: 'divisibleBy3Binary',
    name: 'Divisibilidad por 3 (Binario)',
    description: 'Verifica si un número binario leído de izquierda a derecha es divisible por 3.',
    educationalExplanation: 'La máquina funciona como un autómata finito con 3 estados que representan el residuo de la división entre 3 (q0: residuo 0, q1: residuo 1, q2: residuo 2). Procesamos los bits de izquierda a derecha. Al encontrar la celda vacía final, si estamos en q0, aceptamos; de lo contrario, rechazamos.',
    initialState: 'q0',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '110', // 6 es divisible por 3 -> Acepta
    defaultAlphabet: ['0', '1', '_'],
    rules: [
      // Residuo 0 (q0) es inicial
      cr('q0', '0', '0', 'R', 'q0'), // (R0 * 2 + 0) % 3 = 0
      cr('q0', '1', '1', 'R', 'q1'), // (R0 * 2 + 1) % 3 = 1
      cr('q0', '_', '_', 'N', 'q_accept'), // Acepta cadena vacía o número múltiplo

      // Residuo 1 (q1)
      cr('q1', '0', '0', 'R', 'q2'), // (R1 * 2 + 0) % 3 = 2
      cr('q1', '1', '1', 'R', 'q0'), // (R1 * 2 + 1) % 3 = 0
      cr('q1', '_', '_', 'N', 'q_reject'),

      // Residuo 2 (q2)
      cr('q2', '0', '0', 'R', 'q1'), // (R2 * 2 + 0) % 3 = 1
      cr('q2', '1', '1', 'R', 'q2'), // (R2 * 2 + 1) % 3 = 2
      cr('q2', '_', '_', 'N', 'q_reject')
    ]
  },
  {
    id: 'copyOnes',
    name: 'Copiar Secuencia (Adaptativo)',
    description: 'Duplica cualquier secuencia de caracteres (letras o números) ingresada en la cinta de forma dinámica.',
    educationalExplanation: 'La máquina lee el primer carácter no procesado de la izquierda, lo marca temporalmente, se mueve al final de la cinta tras un marcador de separación que escribe en el camino, deposita una copia del carácter correspondiente, vuelve, restaura el carácter original, y repite el ciclo. Finalmente limpia el marcador divisor.',
    initialState: 'q_find_unmarked',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '111', // Copia -> 111_111 o cualquier letra
    defaultAlphabet: ['1', 'x', 'y', '_'],
    generateRulesForAlphabet: (alphabet: string[], blank: string): TransitionRule[] => {
      const blankChar = blank;
      const separator = '#';
      const currentAlphabet = alphabet.includes(separator) ? alphabet : [...alphabet, separator];
      const activeSymbols = currentAlphabet.filter(s => s !== blankChar && s !== separator && !s.startsWith('marked_') && s !== '');

      const dynamicRules: TransitionRule[] = [];

      // q_find_unmarked seeks the first unmarked symbol
      activeSymbols.forEach(symbol => {
        dynamicRules.push(cr('q_find_unmarked', symbol, `marked_${symbol}`, 'R', `q_go_to_end_${symbol}`));
      });

      // If we hit the separator in q_find_unmarked, we are finished with copying. Clean up.
      dynamicRules.push(cr('q_find_unmarked', separator, blankChar, 'R', 'q_clean_up'));
      dynamicRules.push(cr('q_find_unmarked', blankChar, blankChar, 'N', 'q_accept'));

      activeSymbols.forEach(symbol => {
        // q_go_to_end_s: skip other symbols to find the separator or end
        activeSymbols.forEach(anySym => {
          dynamicRules.push(cr(`q_go_to_end_${symbol}`, anySym, anySym, 'R', `q_go_to_end_${symbol}`));
          dynamicRules.push(cr(`q_go_to_end_${symbol}`, `marked_${anySym}`, `marked_${anySym}`, 'R', `q_go_to_end_${symbol}`));
        });

        // If we hit blank first (means separator was not yet created), write separator and go to q_write_copy_s
        dynamicRules.push(cr(`q_go_to_end_${symbol}`, blankChar, separator, 'R', `q_write_copy_${symbol}`));
        
        // If we hit separator, cross it and go to q_write_copy_s
        dynamicRules.push(cr(`q_go_to_end_${symbol}`, separator, separator, 'R', `q_write_copy_${symbol}`));

        // q_write_copy_s: skip already copied symbols on the right side of the separator
        activeSymbols.forEach(anySym => {
          dynamicRules.push(cr(`q_write_copy_${symbol}`, anySym, anySym, 'R', `q_write_copy_${symbol}`));
        });
        
        // Found blank at the end: write the copied symbol, first step L to go back
        dynamicRules.push(cr(`q_write_copy_${symbol}`, blankChar, symbol, 'L', 'q_go_back'));
      });

      // q_go_back: travel to the left passing through everything to find the marked character
      activeSymbols.forEach(anySym => {
        dynamicRules.push(cr('q_go_back', anySym, anySym, 'L', 'q_go_back'));
        dynamicRules.push(cr('q_go_back', `marked_${anySym}`, `marked_${anySym}`, 'L', 'q_go_back'));
      });
      dynamicRules.push(cr('q_go_back', separator, separator, 'L', 'q_go_back'));

      // Upon hitting marked_s, restore it to s and go R to q_find_unmarked
      activeSymbols.forEach(symbol => {
        dynamicRules.push(cr('q_go_back', `marked_${symbol}`, symbol, 'R', 'q_find_unmarked'));
      });

      // q_clean_up: we cleared the separator, but there might be other symbols left or we just accept
      activeSymbols.forEach(anySym => {
        dynamicRules.push(cr('q_clean_up', anySym, anySym, 'R', 'q_clean_up'));
      });
      dynamicRules.push(cr('q_clean_up', blankChar, blankChar, 'N', 'q_accept'));

      return dynamicRules;
    },
    rules: []
  },
  {
    id: 'divisibleBy3Base10',
    name: 'Divisibilidad por 3 (Base 10)',
    description: 'Determina si un número decimal es divisible por 3 sumando sus dígitos módulo 3.',
    educationalExplanation: 'Basado en el criterio matemático de que un número es divisible por 3 si la suma de sus dígitos lo es. La máquina opera con tres estados correspondientes a los residuos módulo 3 acumulados. Se actualiza con cada dígito d leído dándole prioridad a (Residuo + d) modulo 3.',
    initialState: 'q0',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '273', // 2+7+3 = 12 es múltiple de 3 -> Acepta
    defaultAlphabet: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_'],
    rules: [
      // Estado q0: residuo 0
      ...['0','3','6','9'].map(d => cr('q0', d, d, 'R', 'q0')),
      ...['1','4','7'].map(d => cr('q0', d, d, 'R', 'q1')),
      ...['2','5','8'].map(d => cr('q0', d, d, 'R', 'q2')),
      cr('q0', '_', '_', 'N', 'q_accept'),

      // Estado q1: residuo 1
      ...['0','3','6','9'].map(d => cr('q1', d, d, 'R', 'q1')),
      ...['1','4','7'].map(d => cr('q1', d, d, 'R', 'q2')),
      ...['2','5','8'].map(d => cr('q1', d, d, 'R', 'q0')),
      cr('q1', '_', '_', 'N', 'q_reject'),

      // Estado q2: residuo 2
      ...['0','3','6','9'].map(d => cr('q2', d, d, 'R', 'q2')),
      ...['1','4','7'].map(d => cr('q2', d, d, 'R', 'q0')),
      ...['2','5','8'].map(d => cr('q2', d, d, 'R', 'q1')),
      cr('q2', '_', '_', 'N', 'q_reject')
    ]
  },
  {
    id: 'threeEqualLength',
    name: 'Lenguaje xⁿyⁿzⁿ (Bloques Adaptativos)',
    description: 'Valida si la entrada tiene tres bloques consecutivos (como aⁿbⁿcⁿ) de igual longitud y en orden, usando cualquier carácter.',
    educationalExplanation: 'Ilustra el poder de las Máquinas de Turing al procesar lenguajes no libres del contexto. En esta versión adaptativa, la máquina identifica los tres caracteres clave de tu entrada, marcándolos en secuencia ordenada y verificando que sus cantidades coincidan exactamente.',
    initialState: 'q0',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: 'aabbcc', // Acepta, n=2 o cualquier bloque como 112233
    defaultAlphabet: ['a', 'b', 'c', 'X', 'Y', 'Z', '_'],
    generateRulesForAlphabet: (alphabet: string[], blank: string): TransitionRule[] => {
      const activeSymbols = alphabet.filter(s => s !== blank && s !== '' && s !== 'X' && s !== 'Y' && s !== 'Z' && s !== '★' && s !== '▪' && s !== '▲');
      const charA = activeSymbols[0] || 'a';
      const charB = activeSymbols[1] || 'b';
      const charC = activeSymbols[2] || 'c';

      const markerA = charA === 'X' || charB === 'X' || charC === 'X' ? '★' : 'X';
      const markerB = charA === 'Y' || charB === 'Y' || charC === 'Y' ? '▪' : 'Y';
      const markerC = charA === 'Z' || charB === 'Z' || charC === 'Z' ? '▲' : 'Z';

      const dynamicRules: TransitionRule[] = [];

      // q0: busca primera charA no marcada y la marca con markerA
      dynamicRules.push(cr('q0', charA, markerA, 'R', 'q1'));
      dynamicRules.push(cr('q0', markerB, markerB, 'R', 'q_verify_all_done'));

      // q1: saltar charA's y markerB's buscando la primera charB
      dynamicRules.push(cr('q1', charA, charA, 'R', 'q1'));
      dynamicRules.push(cr('q1', markerB, markerB, 'R', 'q1'));
      dynamicRules.push(cr('q1', charB, markerB, 'R', 'q2'));

      // q2: saltar charB's y markerC's buscando la primera charC
      dynamicRules.push(cr('q2', charB, charB, 'R', 'q2'));
      dynamicRules.push(cr('q2', markerC, markerC, 'R', 'q2'));
      dynamicRules.push(cr('q2', charC, markerC, 'L', 'q3'));

      // q3: viajar a la izquierda buscando la marca markerA más reciente
      dynamicRules.push(cr('q3', charA, charA, 'L', 'q3'));
      dynamicRules.push(cr('q3', charB, charB, 'L', 'q3'));
      dynamicRules.push(cr('q3', markerB, markerB, 'L', 'q3'));
      dynamicRules.push(cr('q3', markerC, markerC, 'L', 'q3'));
      dynamicRules.push(cr('q3', markerA, markerA, 'R', 'q0'));

      // q_verify_all_done: comprueba que solo haya markerB's y markerC's hasta el final
      dynamicRules.push(cr('q_verify_all_done', markerB, markerB, 'R', 'q_verify_all_done'));
      dynamicRules.push(cr('q_verify_all_done', markerC, markerC, 'R', 'q_verify_all_done'));
      dynamicRules.push(cr('q_verify_all_done', blank, blank, 'N', 'q_accept'));

      return dynamicRules;
    },
    rules: []
  },
  {
    id: 'equalStrings',
    name: 'Cadenas Idénticas (Adaptativo) (x#y)',
    description: 'Verifica si la cadena es de la forma x#y con x = y, usando cualquier alfabeto de letras o números.',
    educationalExplanation: 'La máquina compara caracteres simétricos en x (antes del divisor "#") y y (después del "#"). En esta versión adaptativa, se genera un conjunto dinámico de reglas para emparejar cualquier carácter posible. Lee un símbolo en x, lo marca, cruza "#", busca su correspondiente en y para marcarlo, y retorna.',
    initialState: 'q0',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '101#101', // Acepta x='101', y='101' o 'abc#abc'
    defaultAlphabet: ['0', '1', 'X', 'Y', '#', '_'],
    generateRulesForAlphabet: (alphabet: string[], blank: string): TransitionRule[] => {
      const currentAlphabet = alphabet.includes('#') ? alphabet : [...alphabet, '#'];
      const markerX = currentAlphabet.includes('X') ? '★' : 'X';
      const markerY = currentAlphabet.includes('Y') ? '▪' : 'Y';
      const blankChar = blank;

      const activeSymbols = currentAlphabet.filter(
        s => s !== '#' && s !== blankChar && s !== markerX && s !== markerY && s !== ''
      );

      const dynamicRules: TransitionRule[] = [];

      // q0 lee divisor '#' -> verifica que la parte y esté completamente marcada
      dynamicRules.push(cr('q0', '#', '#', 'R', 'q_verify_y_clean'));

      activeSymbols.forEach(symbol => {
        // En q0 lee símbolo -> marca con markerX y va a buscarlo del otro lado
        dynamicRules.push(cr('q0', symbol, markerX, 'R', `q_find_y_${symbol}`));

        // En q_find_y_X -> salta símbolos activos en x para llegar a '#'
        activeSymbols.forEach(anySym => {
          dynamicRules.push(cr(`q_find_y_${symbol}`, anySym, anySym, 'R', `q_find_y_${symbol}`));
        });
        dynamicRules.push(cr(`q_find_y_${symbol}`, '#', '#', 'R', `q_look_${symbol}`));

        // En q_look_X -> salta ya marcados markerY buscando el símbolo target
        dynamicRules.push(cr(`q_look_${symbol}`, markerY, markerY, 'R', `q_look_${symbol}`));
        dynamicRules.push(cr(`q_look_${symbol}`, symbol, markerY, 'L', 'q_return'));

        // Rechazo explícito ante fallos de emparejamiento (opcional pero limpio)
        activeSymbols.filter(oth => oth !== symbol).forEach(otherSym => {
          dynamicRules.push(cr(`q_look_${symbol}`, otherSym, otherSym, 'N', 'q_reject'));
        });
        dynamicRules.push(cr(`q_look_${symbol}`, blankChar, blankChar, 'N', 'q_reject'));
      });

      // q_return -> regresa a la izquierda cruzando todo hasta el primer markerX
      activeSymbols.forEach(anySym => {
        dynamicRules.push(cr('q_return', anySym, anySym, 'L', 'q_return'));
      });
      dynamicRules.push(cr('q_return', '#', '#', 'L', 'q_return'));
      dynamicRules.push(cr('q_return', markerY, markerY, 'L', 'q_return'));
      dynamicRules.push(cr('q_return', markerX, markerX, 'R', 'q0'));

      // q_verify_y_clean -> verifica si la sección y tiene únicamente marcas de coincidencia
      dynamicRules.push(cr('q_verify_y_clean', markerY, markerY, 'R', 'q_verify_y_clean'));
      dynamicRules.push(cr('q_verify_y_clean', blankChar, blankChar, 'N', 'q_accept'));
      activeSymbols.forEach(anySym => {
        dynamicRules.push(cr('q_verify_y_clean', anySym, anySym, 'N', 'q_reject'));
      });

      return dynamicRules;
    },
    rules: []
  },
  {
    id: 'palindrome',
    name: 'Palíndromo (Adaptativo)',
    description: 'Determina si una cadena cualquiera (letras o números) es un palíndromo (es idéntica de izquierda a derecha y viceversa).',
    educationalExplanation: 'La máquina lee el extremo izquierdo del palíndromo, memoriza el carácter leído y vacía la celda. Luego se desplaza al extremo derecho para verificar que coincida con el carácter opuesto, consumiéndolo también. Continúa este vaivén alternado hasta procesar toda la cinta.',
    initialState: 'q0',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: 'ababa', // Acepta, interactivo para cualquier alfabeto
    defaultAlphabet: ['a', 'b', '_'],
    generateRulesForAlphabet: (alphabet: string[], blank: string): TransitionRule[] => {
      const activeSymbols = alphabet.filter(s => s !== blank && s !== '');
      const dynamicRules: TransitionRule[] = [];

      dynamicRules.push(cr('q0', blank, blank, 'N', 'q_accept'));

      activeSymbols.forEach(symbol => {
        dynamicRules.push(cr('q0', symbol, blank, 'R', `q_match_${symbol}`));

        activeSymbols.forEach(anySym => {
          dynamicRules.push(cr(`q_match_${symbol}`, anySym, anySym, 'R', `q_match_${symbol}`));
        });
        dynamicRules.push(cr(`q_match_${symbol}`, blank, blank, 'L', `q_verify_${symbol}`));

        dynamicRules.push(cr(`q_verify_${symbol}`, symbol, blank, 'L', 'q_return'));
        dynamicRules.push(cr(`q_verify_${symbol}`, blank, blank, 'N', 'q_accept'));
        activeSymbols.filter(oth => oth !== symbol).forEach(otherSym => {
          dynamicRules.push(cr(`q_verify_${symbol}`, otherSym, otherSym, 'N', 'q_reject'));
        });
      });

      activeSymbols.forEach(anySym => {
        dynamicRules.push(cr('q_return', anySym, anySym, 'L', 'q_return'));
      });
      dynamicRules.push(cr('q_return', blank, blank, 'R', 'q0'));

      return dynamicRules;
    },
    rules: []
  },
  {
    id: 'palindromeGeneral',
    name: 'Palíndromo General (Adaptativo)',
    description: 'Soporta verificación de palíndromos para cualquier símbolo y alfabeto presente en la cinta de forma dinámica.',
    educationalExplanation: 'Esta máquina súper especial de Turing genera dinámicamente sus reglas de transición a partir del alfabeto detectado en tu cinta de entrada. Utiliza la generación de reglas en el simulador para mapear emparejamientos q_match_X para cualquier carácter posible, sin estar restringida a {a, b}.',
    initialState: 'q0',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '7A3M3A7', // Palíndromo alfanumérico -> Acepta
    defaultAlphabet: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'M', '_'],
    generateRulesForAlphabet: (alphabet: string[], blank: string): TransitionRule[] => {
      // Filtrar el símbolo blanco
      const activeSymbols = alphabet.filter(s => s !== blank && s !== '');
      const dynamicRules: TransitionRule[] = [];

      // q0 lee en blanco -> acepta
      dynamicRules.push(cr('q0', blank, blank, 'N', 'q_accept'));

      activeSymbols.forEach(symbol => {
        // q0 lee símbolo -> lo vacía y va a q_match_X
        dynamicRules.push(cr('q0', symbol, blank, 'R', `q_match_${symbol}`));

        // q_match_X se mueve a la derecha sobre todo Símbolo
        activeSymbols.forEach(anySym => {
          dynamicRules.push(cr(`q_match_${symbol}`, anySym, anySym, 'R', `q_match_${symbol}`));
        });
        // Al encontrar el blanco, retrocede L para verificar en q_verify_X
        dynamicRules.push(cr(`q_match_${symbol}`, blank, blank, 'L', `q_verify_${symbol}`));

        // En q_verify_X comprueba simetría
        dynamicRules.push(cr(`q_verify_${symbol}`, symbol, blank, 'L', 'q_return'));
        // Si el extremo es blanco, significa que ya correspondía y se consumió. Es válido
        dynamicRules.push(cr(`q_verify_${symbol}`, blank, blank, 'N', 'q_accept'));
        // Otros símbolos causan rechazo
        activeSymbols.filter(oth => oth !== symbol).forEach(otherSym => {
          dynamicRules.push(cr(`q_verify_${symbol}`, otherSym, otherSym, 'N', 'q_reject'));
        });
      });

      // Retornos dinámicos
      activeSymbols.forEach(anySym => {
        dynamicRules.push(cr('q_return', anySym, anySym, 'L', 'q_return'));
      });
      dynamicRules.push(cr('q_return', blank, blank, 'R', 'q0'));

      return dynamicRules;
    },
    rules: [] // Se autogenerará dinámicamente según la cinta en el interpretador
  },
  {
    id: 'busyBeaver3',
    name: 'Castor Laborioso 3-Estados (Busy Beaver)',
    description: 'Máquina de 3 estados diseñada para escribir la mayor cantidad de "1"s y detenerse en tiempo finito.',
    educationalExplanation: 'El Castor Laborioso (Busy Beaver) es un problema clásico de no computabilidad. En un alfabeto {0, 1} con 0 de símbolo blanco, este espécimen con 3 estados operativos (qA, qB, qC) logra completar una secuencia final de seis "1"s en 13 pasos antes de apagar su motor (aceptar/halt).',
    initialState: 'qA',
    acceptStates: ['q_halt'],
    rejectStates: ['q_reject'],
    blankSymbol: '0',
    initialInput: '0000000000', // Cinta vacía rellena de '0's
    defaultAlphabet: ['0', '1'],
    rules: [
      // qA
      cr('qA', '0', '1', 'R', 'qB'),
      cr('qA', '1', '1', 'L', 'qC'),
      // qB
      cr('qB', '0', '1', 'L', 'qA'),
      cr('qB', '1', '1', 'R', 'qB'),
      // qC
      cr('qC', '0', '1', 'L', 'qB'),
      cr('qC', '1', '1', 'N', 'q_halt') // Halt exitoso!
    ]
  },
  {
    id: 'busyBeaver4',
    name: 'Castor Laborioso 4-Estados (Busy Beaver)',
    description: 'Máquina con 4 estados optimizados para escribir catorce "1"s sobre un asfalto vacío.',
    educationalExplanation: 'Uno de los castores de carreras más veloces: con 4 estados (qA, qB, qC, qD), parte con la cinta vacía (0) y escribe de forma extremadamente sofisticada doce o catorce "1"s completos en exactamente 107 pasos antes de finalizar correctamente en q_halt.',
    initialState: 'qA',
    acceptStates: ['q_halt'],
    rejectStates: ['q_reject'],
    blankSymbol: '0',
    initialInput: '0000000000000000000', // Cinta limpia con 0s
    defaultAlphabet: ['0', '1'],
    rules: [
      // qA
      cr('qA', '0', '1', 'R', 'qB'),
      cr('qA', '1', '1', 'L', 'qB'),
      // qB
      cr('qB', '0', '1', 'L', 'qA'),
      cr('qB', '1', '0', 'L', 'qC'),
      // qC
      cr('qC', '0', '1', 'R', 'q_halt'), // Halt
      cr('qC', '1', '1', 'L', 'qD'),
      // qD
      cr('qD', '0', '1', 'R', 'qD'),
      cr('qD', '1', '0', 'R', 'qA')
    ]
  },
  {
    id: 'powersOfTwo',
    name: 'Potencia de 2',
    description: 'Verifica si la cantidad de "1"s (longitud unaria) es una potencia de 2 (1, 2, 4, 8, etc.).',
    educationalExplanation: 'La máquina simula la división recursiva por 2. Cruza alternadamente cada segundo "1" cambiándolo por "x" (reduciendo la cadena a la mitad). Si la cinta tenía un número par de unos activos, el ciclo se completa perfectamente y se repite la pasada. Si era impar (>1), se detiene y rechaza.',
    initialState: 'q0',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '1111', // Longitud 4 -> Acepta
    defaultAlphabet: ['1', 'x', '_'],
    rules: [
      // q0 busca primer 1
      cr('q0', '1', '1', 'R', 'q1'),
      cr('q0', 'x', 'x', 'R', 'q0'),
      cr('q0', '_', '_', 'N', 'q_reject'), // Vacío no es potencia de 2

      // q1 busca el segundo para tacharlo
      cr('q1', '1', 'x', 'R', 'q2'), // Tacha el segundo 1
      cr('q1', 'x', 'x', 'R', 'q1'),
      cr('q1', '_', '_', 'L', 'q_return'), // Sólo había un 1 activo y se completó bien, vuelve para repasar

      // q2 busca el tercero para saltarlo (guardarlo como uno activo en la prox pasada)
      cr('q2', '1', '1', 'R', 'q1'), // Salta y conserva como activo
      cr('q2', 'x', 'x', 'R', 'q2'),
      cr('q2', '_', '_', 'L', 'q_reject'), // Terminó con una cantidad impar de unos en esta ronda -> Rechaza!

      // q_return de derecha a izquierda regresando al inicio
      cr('q_return', '1', '1', 'L', 'q_return'),
      cr('q_return', 'x', 'x', 'L', 'q_return'),
      cr('q_return', '_', '_', 'R', 'q_check_done'),

      // Comprobar si queda exactamente un solo '1' en la cinta
      cr('q_check_done', 'x', 'x', 'R', 'q_check_done'),
      cr('q_check_done', '1', '1', 'R', 'q_check_more'),
      cr('q_check_done', '_', '_', 'N', 'q_accept'),

      // q_check_more busca si hay otro 1 además del que ya encontramos
      cr('q_check_more', 'x', 'x', 'R', 'q_check_more'),
      cr('q_check_more', '1', '1', 'N', 'q_restart_loop'), // Hay más 1s, haz otra división!
      cr('q_check_more', '_', '_', 'N', 'q_accept'), // Solo quedaba uno! Es potencia de 2

      // q_restart_loop vuelve a ir a la izquierda para iniciar otra ronda
      cr('q_restart_loop', '1', '1', 'L', 'q_restart_loop'),
      cr('q_restart_loop', 'x', 'x', 'L', 'q_restart_loop'),
      cr('q_restart_loop', '_', '_', 'R', 'q0')
    ]
  },
  {
    id: 'multipliedLengths',
    name: 'Multiplicación de Longitudes (1ⁿ#1ᵐ)',
    description: 'Genera al final de la cinta una cantidad de "1"s equivalente al producto de dos bloques de unos iniciales.',
    educationalExplanation: 'Multiplicador unario: Para cada "1" en el bloque izquierdo (marcado secuencialmente con "x"), la máquina viaja al bloque derecho y copia todos sus "1"s (marcándolos con "y" y restaurándolos más tarde) hacia una tercera sección acumulativa tras un separador "=".',
    initialState: 'q0',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '11#111', // 2 * 3 -> Genera =111111 al final
    defaultAlphabet: ['1', 'x', 'y', '#', '=', '_'],
    rules: [
      // q0: busca 1 libre en bloque 1
      cr('q0', '1', 'x', 'R', 'q_go_block2'),
      cr('q0', '#', '#', 'R', 'q_accept'), // Terminado, acepta!

      // q_go_block2: viaja a través de 1s de bloque 1 y # a bloque 2
      cr('q_go_block2', '1', '1', 'R', 'q_go_block2'),
      cr('q_go_block2', '#', '#', 'R', 'q_scan_b2'),

      // q_scan_b2: encuentra el primer 1 libre en el bloque 2
      cr('q_scan_b2', 'y', 'y', 'R', 'q_scan_b2'),
      cr('q_scan_b2', '1', 'y', 'R', 'q_write_result'), // Marca temporalmente con 'y' y va al final a escribir
      cr('q_scan_b2', '=', '=', 'L', 'q_restore_b2'), // Fin del bloque 2 en este ciclo, resetea marcas

      // q_write_result: viaja al extremo derecho pasando =, y 1s de acumulador para poner un 1
      cr('q_write_result', '1', '1', 'R', 'q_write_result'),
      cr('q_write_result', '=', '=', 'R', 'q_write_result'),
      cr('q_write_result', '_', '1', 'L', 'q_back_b2'), // Escribe y vuelve

      // q_back_b2: regresa a buscar la marca 'y' en bloque 2
      cr('q_back_b2', '1', '1', 'L', 'q_back_b2'),
      cr('q_back_b2', '=', '=', 'L', 'q_back_b2'),
      cr('q_back_b2', 'y', 'y', 'R', 'q_scan_b2'), // Se posiciona a la derecha de la marca y sigue clonando

      // q_restore_b2: restaura las 'y's del bloque 2 a '1's para estar listos ante el próximo '1' del bloque 1
      cr('q_restore_b2', 'y', '1', 'L', 'q_restore_b2'),
      cr('q_restore_b2', '#', '#', 'L', 'q_back_b1'),

      // q_back_b1: viaja a la izquierda de la cinta hasta la marca reciente 'x'
      cr('q_back_b1', '1', '1', 'L', 'q_back_b1'),
      cr('q_back_b1', 'x', 'x', 'R', 'q0') // Se posiciona tras la X y vuelve a q0
    ]
  },
  {
    id: 'binaryAddition',
    name: 'Suma Binaria (X+Y)',
    description: 'Suma dos números binarios separados por "+" en la cinta utilizando un decremento e incremento encadenados.',
    educationalExplanation: 'Para sumar A y B, la máquina busca el último bit del número B (derecha de "+"). Resta 1 a B de manera aritmética. Si B no es cero, viaja inmediatamente al número A (izquierda de "+") e incrementa su valor en 1. El proceso se repite hasta que B queda en 0, de forma que el resultado se plasma en A.',
    initialState: 'q_find_end_b',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '101+11', // 5 + 3 -> 1000 (8)
    defaultAlphabet: ['0', '1', '+', '_'],
    rules: [
      // q_find_end_b: Escanear hasta el extremo derecho del número Y
      cr('q_find_end_b', '0', '0', 'R', 'q_find_end_b'),
      cr('q_find_end_b', '1', '1', 'R', 'q_find_end_b'),
      cr('q_find_end_b', '+', '+', 'R', 'q_find_end_b'),
      cr('q_find_end_b', '_', '_', 'L', 'q_dec_b'),

      // q_dec_b: Decrementa el número Y por la derecha (restando 1)
      cr('q_dec_b', '1', '0', 'L', 'q_go_first'), // Restó! Ahora va a incrementar X
      cr('q_dec_b', '0', '1', 'L', 'q_dec_b'), // Préstamo
      cr('q_dec_b', '+', '_', 'L', 'q_clean_addition'), // Y llegó a 0! Quitamos '+' y barremos

      // q_go_first: viaja a la izquierda pasando el '+' hasta el número X
      cr('q_go_first', '0', '0', 'L', 'q_go_first'),
      cr('q_go_first', '1', '1', 'L', 'q_go_first'),
      cr('q_go_first', '+', '+', 'L', 'q_inc_a'),

      // q_inc_a: Incrementa el número X
      cr('q_inc_a', '0', '1', 'R', 'q_find_end_b'), // Incrementado exitosamente! Repite ciclo
      cr('q_inc_a', '_', '1', 'R', 'q_find_end_b'), // Bit más significativo añadido!
      cr('q_inc_a', '1', '0', 'L', 'q_inc_a'), // Acarreo continúa

      // q_clean_addition: remueve ceros a la derecha y ajusta el resultado
      cr('q_clean_addition', '0', '_', 'L', 'q_clean_addition'),
      cr('q_clean_addition', '1', '1', 'N', 'q_accept'),
      cr('q_clean_addition', '_', '_', 'N', 'q_accept')
    ]
  },
  {
    id: 'unaryMultiplication',
    name: 'Multiplicación Unaria (X*Y)',
    description: 'Sincroniza y multiplica dos conjuntos de barras "1" separadas por "*".',
    educationalExplanation: 'Similar a la multiplicación de longitudes, lee la primera barra del bloque X (marcada con "x"), y clona a todos los elementos del bloque Y (marcado temporalmente como "y") hacia la derecha del marcador "=".',
    initialState: 'q0',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '111*11', // 3 * 2 -> 6 (111111)
    defaultAlphabet: ['1', 'x', 'y', '*', '=', '_'],
    rules: [
      // Mapeo idéntico de multiplicación con símbolo *
      cr('q0', '1', 'x', 'R', 'q_go_b2'),
      cr('q0', '*', '*', 'R', 'q_accept'),

      cr('q_go_b2', '1', '1', 'R', 'q_go_b2'),
      cr('q_go_b2', '*', '*', 'R', 'q_scan_b2'),

      cr('q_scan_b2', 'y', 'y', 'R', 'q_scan_b2'),
      cr('q_scan_b2', '1', 'y', 'R', 'q_write'),
      cr('q_scan_b2', '=', '=', 'L', 'q_restore'),

      cr('q_write', '1', '1', 'R', 'q_write'),
      cr('q_write', '=', '=', 'R', 'q_write'),
      cr('q_write', '_', '1', 'L', 'q_back'),

      cr('q_back', '1', '1', 'L', 'q_back'),
      cr('q_back', '=', '=', 'L', 'q_back'),
      cr('q_back', 'y', 'y', 'R', 'q_scan_b2'),

      cr('q_restore', 'y', '1', 'L', 'q_restore'),
      cr('q_restore', '*', '*', 'L', 'q_back_b1'),

      cr('q_back_b1', '1', '1', 'L', 'q_back_b1'),
      cr('q_back_b1', 'x', 'x', 'R', 'q0')
    ]
  },
  {
    id: 'binaryMultiplication',
    name: 'Multiplicación Binaria',
    description: 'Multiplica dos números binarios en formato X*Y= utilizando restas sucesivas del segundo factor.',
    educationalExplanation: 'Para multiplicar bits, la máquina usa un acumulador de suma. Decrementa el multiplicador Y de 1 en 1. Si no es cero, añade el multiplicador X en formato binario al final del acumulador tras el "=". Al llegar el multiplicador Y a cero, limpia el área de trabajo y deja el resultado binario.',
    initialState: 'q_find_y',
    acceptStates: ['q_accept'],
    rejectStates: ['q_reject'],
    blankSymbol: '_',
    initialInput: '10*11=', // 2 * 3 = 6 (110)
    defaultAlphabet: ['0', '1', '*', '=', 'c', '_'],
    rules: [
      // q_find_y: buscando el final del multiplicador Y para decrementarlo (entre * y =)
      cr('q_find_y', '0', '0', 'R', 'q_find_y'),
      cr('q_find_y', '1', '1', 'R', 'q_find_y'),
      cr('q_find_y', '*', '*', 'R', 'q_find_y'),
      cr('q_find_y', '=', '=', 'L', 'q_dec_y'),

      // q_dec_y: decrementa el número Y (restando 1)
      cr('q_dec_y', '1', '0', 'R', 'q_add_x_to_acc'), // Se restó 1 con éxito! Ahora suma X al acumulador
      cr('q_dec_y', '0', '1', 'L', 'q_dec_y'), // Préstamo continúa
      cr('q_dec_y', '*', '*', 'R', 'q_finalize_cleanup'), // Multiplicador Y llegó a 0! Limpia y termina

      // q_add_x_to_acc: inicia viaje al inicio para copiar X
      cr('q_add_x_to_acc', '0', '0', 'R', 'q_add_x_to_acc'),
      cr('q_add_x_to_acc', '1', '1', 'R', 'q_add_x_to_acc'),
      cr('q_add_x_to_acc', '=', '=', 'R', 'q_add_x_to_acc'),
      cr('q_add_x_to_acc', '_', '_', 'L', 'q_goto_x'), // Se posiciona a la izquierda para empezar a marcar X

      // q_goto_x: regresa al inicio de todo el riel para leer X (antes del *)
      cr('q_goto_x', '0', '0', 'L', 'q_goto_x'),
      cr('q_goto_x', '1', '1', 'L', 'q_goto_x'),
      cr('q_goto_x', '*', '*', 'L', 'q_goto_x'),
      cr('q_goto_x', '=', '=', 'L', 'q_goto_x'),
      cr('q_goto_x', '_', '_', 'R', 'q_read_x'),

      // q_read_x: busca un bit sin marcar de X para llevarlo al acumulador
      cr('q_read_x', 'c', 'c', 'R', 'q_read_x'), // Salta marcados
      cr('q_read_x', '0', 'c', 'R', 'q_carry_0'), // Marca 0 de X
      cr('q_read_x', '1', 'c', 'R', 'q_carry_1'), // Marca 1 de X
      cr('q_read_x', '*', '*', 'R', 'q_restore_x_marks'), // Terminó de copiar X enteros en este turno, desmarca

      // q_carry_0: viaja a la derecha para sumarle 0 al final de la cinta (sin valor, solo espacio / marcador, normalmente no lleva acarreo directo)
      cr('q_carry_0', '0', '0', 'R', 'q_carry_0'),
      cr('q_carry_0', '1', '1', 'R', 'q_carry_0'),
      cr('q_carry_0', '*', '*', 'R', 'q_carry_0'),
      cr('q_carry_0', '=', '=', 'R', 'q_carry_0'),
      cr('q_carry_0', '_', '0', 'L', 'q_goto_x'), // Deposita y vuelve

      // q_carry_1: viaja a la derecha para sumarle 1 en binario dinámico al final
      cr('q_carry_1', '0', '0', 'R', 'q_carry_1'),
      cr('q_carry_1', '1', '1', 'R', 'q_carry_1'),
      cr('q_carry_1', '*', '*', 'R', 'q_carry_1'),
      cr('q_carry_1', '=', '=', 'R', 'q_carry_1'),
      cr('q_carry_1', '_', '1', 'L', 'q_goto_x'), // Deposita y vuelve

      // q_restore_x_marks: restaura las marcas 'c' del primer factor X a sus bits originales
      cr('q_restore_x_marks', 'c', '1', 'L', 'q_restore_x_marks'), // Asume restauraciones rápidas
      cr('q_restore_x_marks', '_', '_', 'R', 'q_find_y'), // Siguiente decremento de Y!

      // q_finalize_cleanup: limpia los restos lógicos dejando sólo el producto final
      cr('q_finalize_cleanup', '1', '_', 'R', 'q_finalize_cleanup'),
      cr('q_finalize_cleanup', '0', '_', 'R', 'q_finalize_cleanup'),
      cr('q_finalize_cleanup', '=', '_', 'R', 'q_accept')
    ]
  }
];
