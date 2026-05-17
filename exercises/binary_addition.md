# Ejercicio: Suma binaria

Descripción: Suma dos números binarios separados por `+` y deja la suma en la cinta.

input: '1011+11001'
blank: ' '
start state: right

table:
  right:
    [0,1,+]: R
    ' ': {L: read}

  read:
    0: {write: c, L: have0}
    1: {write: c, L: have1}
    +: {write: ' ', L: rewrite}
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
    ' ': {R: done}
  done:
