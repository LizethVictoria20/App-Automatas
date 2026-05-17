# Ejercicio: Multiplicación binaria

Descripción: Multiplica dos números binarios separados por `*` usando doblado y suma repetida.

input: '11*101'
blank: ' '
start state: start

table:
  start:
    [0,1]: {L: init}
  init:
    ' ': {write: '+', R: right}
  right:
    [0,1,'*']: R
    ' ': {L: readB}

  readB:
    0: {write: ' ', L: doubleL}
    1: {write: ' ', L: addA}
  addA:
    [0,1]: L
    '*': {L: read}
  doubleL:
    [0,1]: L
    '*': {write: 0, R: shift}
  double:
    [0,1,+]: R
    '*': {write: 0, R: shift}
  shift:
    0: {write: '*', R: shift0}
    1: {write: '*', R: shift1}
    ' ': {L: tidy}
  shift0:
    0:   {R: shift0}
    1:   {write: 0, R: shift1}
    ' ': {write: 0, R: right}
  shift1:
    0:   {write: 1, R: shift0}
    1:   {R: shift1}
    ' ': {write: 1, R: right}

  tidy:
    [0,1]: {write: ' ', L}
    +: {write: ' ', L: done}
  done:

  # adder submachine (keeps '+' and continues to 'double')
  read:
    0: {write: c, L: have0}
    1: {write: c, L: have1}
    +: {L: rewrite}
  have0: {[0,1]: L, +: {L: add0}}
  have1: {[0,1]: L, +: {L: add1}}
  add0:
    [0,' ']: {write: O, R: back0}
    1      : {write: I, R: back0}
    [O,I]  : L
  add1:
    [0,' ']: {write: I, R: back1}
    1      : {write: O, L: carry}
    [O,I]  : L
  carry:
    [0,' ']: {write: 1, R: back1}
    1      : {write: 0, L}
  back0:
    [0,1,O,I,+]: R
    c: {write: 0, L: read}
  back1:
    [0,1,O,I,+]: R
    c: {write: 1, L: read}
  rewrite:
    O: {write: 0, L}
    I: {write: 1, L}
    [0,1]: L
    ' ': {R: double}
