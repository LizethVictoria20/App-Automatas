# Ejercicio: Multiplicación unaria

Descripción: Multiplica dos números en notación unaria (tally) separados por `*`.

input: '||*|||'  # prueba '*', '|*|||', '||||*||'
blank: ' '
start state: eachA

table:
  eachA:
    '|': {write: ' ', R: toB}
    '*': {R: skip}
  toB:
    '|': R
    '*': {R: eachB}
  nextA:
    ' ': {write: '|', R: eachA}
    ['|','*']: L

  skip:
    '|': R
    ' ': {R: done}
  done:

  eachB:
    ' ': {L: nextA}
    '|': {write: ' ', R: sep}
  sep:
    ' ': {R: add}
    '|': R
  add:
    ' ': {write: '|', L: sepL}
    '|': R
  sepL:
    ' ': {L: nextB}
    '|': L
  nextB:
    ' ': {write: '|', R: eachB}
    '|': L
