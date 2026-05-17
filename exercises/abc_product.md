# Ejercicio: a^i b^j c^k con i*j = k

Descripción: Acepta cadenas de la forma a^i b^j c^k con i,j,k ≥ 1 y i * j = k.

input: aabbbcccccc
blank: ' '
start state: start

table:
  # Comprobar la forma a^i b^j c^k con i,j,k ≥ 1.
  start:  {        a: {R: a+}}
  a+:     {a: R,   b: {R: b+}}
  b+:     {b: R,   c: {R: c+}}
  c+:     {c: R, ' ': {L: left}}
  left:
    [a,b,c]: L
    ' ': {R: eachA}

  # Luego comprobar que i*j = k.
  eachA:
    a: {write: ' ', R: eachB}
    b: {R: scan}
  eachB:
    a: R
    b: {write: B, R: markC}
    C: {L: nextA}
  markC:
    [b,C]: R
    c: {write: C, L: nextB}
  nextB:
    [b,C]: L
    B: {R: eachB}
  nextA:
    a: L
    B: {write: b, L}
    ' ': {R: eachA}

  scan:
    [b,C]: R
    ' ': {R: accept}
  accept:
